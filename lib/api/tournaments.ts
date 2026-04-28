export type TournamentStatus = "upcoming" | "active" | "completed"

export interface Participant {
    id: string
    username: string
    avatarUrl?: string
    seed: number
}

export interface BracketMatch {
    id: string
    round: number
    position: number
    participant1?: Participant
    participant2?: Participant
    winnerId?: string
    scheduledAt?: string
    score?: { p1: number; p2: number }
}

export interface PrizeTier {
    place: string
    amount: number
    currency: string
    percentage: number
}

export interface Tournament {
    id: string
    name: string
    description: string
    game: string
    status: TournamentStatus
    entryFee: number
    currency: string
    prizePool: number
    maxParticipants: number
    currentParticipants: number
    startDate: string
    endDate: string
    imageUrl: string
    prizes: PrizeTier[]
    bracket: BracketMatch[]
    isRegistered?: boolean
}

const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: "t001",
        name: "Premier League Prediction Cup",
        description: "Predict match outcomes across the Premier League season for a chance to win the grand prize.",
        game: "Football Prediction",
        status: "active",
        entryFee: 5,
        currency: "STRK",
        prizePool: 1200,
        maxParticipants: 64,
        currentParticipants: 48,
        startDate: "2025-05-01T10:00:00Z",
        endDate: "2025-05-15T22:00:00Z",
        imageUrl: "/tournaments/t001.png",
        prizes: [
            { place: "1st", amount: 600, currency: "STRK", percentage: 50 },
            { place: "2nd", amount: 300, currency: "STRK", percentage: 25 },
            { place: "3rd", amount: 180, currency: "STRK", percentage: 15 },
            { place: "4th", amount: 120, currency: "STRK", percentage: 10 },
        ],
        bracket: generateBracket(8, "t001"),
        isRegistered: true,
    },
    {
        id: "t002",
        name: "El Clasico Fantasy Showdown",
        description: "Pick the perfect squad for El Clasico and dominate the leaderboard.",
        game: "Fantasy Football",
        status: "upcoming",
        entryFee: 10,
        currency: "STRK",
        prizePool: 2000,
        maxParticipants: 32,
        currentParticipants: 14,
        startDate: "2025-05-20T18:00:00Z",
        endDate: "2025-05-21T22:00:00Z",
        imageUrl: "/tournaments/t002.png",
        prizes: [
            { place: "1st", amount: 1000, currency: "STRK", percentage: 50 },
            { place: "2nd", amount: 500, currency: "STRK", percentage: 25 },
            { place: "3rd", amount: 300, currency: "STRK", percentage: 15 },
            { place: "4th", amount: 200, currency: "STRK", percentage: 10 },
        ],
        bracket: generateBracket(4, "t002"),
        isRegistered: false,
    },
    {
        id: "t003",
        name: "Champions League Oracle",
        description: "Prove you know Champions League football better than everyone else.",
        game: "Match Prediction",
        status: "completed",
        entryFee: 3,
        currency: "STRK",
        prizePool: 500,
        maxParticipants: 16,
        currentParticipants: 16,
        startDate: "2025-04-01T10:00:00Z",
        endDate: "2025-04-30T22:00:00Z",
        imageUrl: "/tournaments/t003.png",
        prizes: [
            { place: "1st", amount: 250, currency: "STRK", percentage: 50 },
            { place: "2nd", amount: 125, currency: "STRK", percentage: 25 },
            { place: "3rd", amount: 75, currency: "STRK", percentage: 15 },
            { place: "4th", amount: 50, currency: "STRK", percentage: 10 },
        ],
        bracket: generateBracket(4, "t003"),
        isRegistered: false,
    },
]

function generateBracket(size: number, prefix: string): BracketMatch[] {
    const matches: BracketMatch[] = []
    const rounds = Math.log2(size)
    const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
        "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi"]

    let matchId = 0
    for (let round = 0; round < rounds; round++) {
        const matchesInRound = size / Math.pow(2, round + 1)
        for (let pos = 0; pos < matchesInRound; pos++) {
            const match: BracketMatch = {
                id: `${prefix}-r${round}-m${pos}`,
                round,
                position: pos,
            }
            if (round === 0) {
                match.participant1 = { id: `p${matchId * 2}`, username: names[matchId * 2] || `Player ${matchId * 2 + 1}`, seed: matchId * 2 + 1 }
                match.participant2 = { id: `p${matchId * 2 + 1}`, username: names[matchId * 2 + 1] || `Player ${matchId * 2 + 2}`, seed: matchId * 2 + 2 }
                if (prefix === "t003") {
                    match.winnerId = match.participant1.id
                    match.score = { p1: 3, p2: 1 }
                }
            }
            matches.push(match)
            matchId++
        }
    }
    return matches
}

export const tournamentAPI = {
    getTournaments: async (): Promise<Tournament[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return MOCK_TOURNAMENTS
    },

    getTournamentById: async (id: string): Promise<Tournament | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return MOCK_TOURNAMENTS.find((t) => t.id === id)
    },

    registerForTournament: async (tournamentId: string, userId: string): Promise<{ success: boolean; message: string }> => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        const tournament = MOCK_TOURNAMENTS.find((t) => t.id === tournamentId)
        if (!tournament) return { success: false, message: "Tournament not found" }
        if (tournament.isRegistered) return { success: false, message: "Already registered" }
        if (tournament.currentParticipants >= tournament.maxParticipants) return { success: false, message: "Tournament is full" }
        return { success: true, message: "Successfully registered!" }
    },
}
