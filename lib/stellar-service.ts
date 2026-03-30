/**
 * Stellar/Soroban service for Renaissance blockchain interactions.
 *
 * NOTE: Install the Stellar SDK before use:
 *   npm install @stellar/stellar-sdk
 */

export class StellarServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = "STELLAR_ERROR",
  ) {
    super(message)
    this.name = "StellarServiceError"
  }
}

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || "testnet"
const STELLAR_RPC_URL =
  process.env.STELLAR_RPC_URL ||
  (STELLAR_NETWORK === "mainnet"
    ? "https://mainnet.stellar.validationcloud.io/v1/soroban/rpc"
    : "https://soroban-testnet.stellar.org")
const CONTRACT_ID = process.env.STELLAR_CONTRACT_ID || ""

if (!CONTRACT_ID) {
  console.warn("[StellarService] STELLAR_CONTRACT_ID is not set")
}

function validatePublicKey(key: string, label = "public key"): void {
  if (!key || typeof key !== "string") {
    throw new StellarServiceError(`${label} is required`, "INVALID_KEY")
  }
  // Stellar public keys are 56-char base32 strings starting with 'G'
  if (!/^G[A-Z2-7]{55}$/.test(key)) {
    throw new StellarServiceError(`Invalid Stellar ${label}`, "INVALID_KEY")
  }
}

function validateAmount(amount: string | number): void {
  const num = Number(amount)
  if (isNaN(num) || num <= 0) {
    throw new StellarServiceError("Amount must be a positive number", "INVALID_AMOUNT")
  }
}

function requireContractId(): void {
  if (!CONTRACT_ID) {
    throw new StellarServiceError(
      "STELLAR_CONTRACT_ID is not configured",
      "MISSING_CONFIG",
    )
  }
}

async function rpcRequest(method: string, params: unknown): Promise<unknown> {
  const res = await fetch(STELLAR_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  })

  if (!res.ok) {
    throw new StellarServiceError(
      `RPC request failed with status ${res.status}`,
      "RPC_ERROR",
    )
  }

  const json = (await res.json()) as { result?: unknown; error?: { message: string } }
  if (json.error) {
    throw new StellarServiceError(json.error.message, "RPC_ERROR")
  }

  return json.result
}

export const stellarService = {
  /**
   * Fetch the XLM balance for a given Stellar account.
   */
  async getAccountBalance(publicKey: string): Promise<string> {
    validatePublicKey(publicKey)

    try {
      const result = await rpcRequest("getAccount", { id: publicKey })
      const account = result as { balances?: Array<{ asset_type: string; balance: string }> }
      const native = account.balances?.find((b) => b.asset_type === "native")
      return native?.balance ?? "0"
    } catch (err) {
      if (err instanceof StellarServiceError) throw err
      throw new StellarServiceError("Failed to fetch account balance", "FETCH_ERROR")
    }
  },

  /**
   * Invoke a Soroban contract function (read-only simulation).
   */
  async simulateContractCall(
    functionName: string,
    args: unknown[] = [],
  ): Promise<unknown> {
    requireContractId()
    if (!functionName || typeof functionName !== "string") {
      throw new StellarServiceError("Function name is required", "INVALID_ARGS")
    }

    try {
      return await rpcRequest("simulateTransaction", {
        contractId: CONTRACT_ID,
        function: functionName,
        args,
      })
    } catch (err) {
      if (err instanceof StellarServiceError) throw err
      throw new StellarServiceError(
        `Failed to simulate contract call: ${functionName}`,
        "SIMULATION_ERROR",
      )
    }
  },

  /**
   * Submit a signed Soroban transaction envelope (XDR string).
   */
  async submitTransaction(signedXdr: string): Promise<{ hash: string }> {
    if (!signedXdr || typeof signedXdr !== "string") {
      throw new StellarServiceError("Signed XDR transaction is required", "INVALID_XDR")
    }

    try {
      const result = await rpcRequest("sendTransaction", { transaction: signedXdr })
      const tx = result as { hash?: string }
      if (!tx.hash) {
        throw new StellarServiceError("No transaction hash returned", "SUBMIT_ERROR")
      }
      return { hash: tx.hash }
    } catch (err) {
      if (err instanceof StellarServiceError) throw err
      throw new StellarServiceError("Failed to submit transaction", "SUBMIT_ERROR")
    }
  },

  /**
   * Poll transaction status until finalized or timeout.
   */
  async getTransactionStatus(
    hash: string,
    maxAttempts = 10,
    intervalMs = 2000,
  ): Promise<{ status: string; result?: unknown }> {
    if (!hash || typeof hash !== "string") {
      throw new StellarServiceError("Transaction hash is required", "INVALID_HASH")
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await rpcRequest("getTransaction", { hash })
      const tx = result as { status: string; result?: unknown }

      if (tx.status === "SUCCESS" || tx.status === "FAILED") {
        return { status: tx.status, result: tx.result }
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
      }
    }

    throw new StellarServiceError(
      "Transaction status polling timed out",
      "TIMEOUT",
    )
  },
}
