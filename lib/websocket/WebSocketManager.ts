// WebSocket Connection Manager
// Handles connection pooling, reconnection logic, and message queuing

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface WebSocketManagerOptions {
  url: string;
  protocols?: string | string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
  maxReconnectInterval?: number;
  backoffMultiplier?: number;
  debug?: boolean;
}

interface QueuedMessage {
  channel: string;
  data: any;
  timestamp: number;
}

type EventCallback = (data: any) => void;

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private options: Required<Omit<WebSocketManagerOptions, 'protocols'>> & Pick<WebSocketManagerOptions, 'protocols'>;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempt = 0;
  private messageQueue: QueuedMessage[] = [];
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastPongTimestamp: number = Date.now();

  constructor(options: WebSocketManagerOptions) {
    this.options = {
      reconnectAttempts: options.reconnectAttempts ?? 10,
      reconnectInterval: options.reconnectInterval ?? 1000,
      maxReconnectInterval: options.maxReconnectInterval ?? 30000,
      backoffMultiplier: options.backoffMultiplier ?? 2,
      debug: options.debug ?? false,
      ...options,
    };
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.log('Already connected');
        resolve();
        return;
      }

      this.status = 'connecting';
      this.log(`Connecting to ${this.options.url}...`);

      try {
        this.ws = new WebSocket(this.options.url, this.options.protocols);

        this.ws.onopen = () => {
          this.status = 'connected';
          this.reconnectAttempt = 0;
          this.lastPongTimestamp = Date.now();
          this.log('Connected successfully');
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('status', { status: 'connected' });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            this.log('Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error);
          this.emit('error', { error });
          reject(error);
        };

        this.ws.onclose = (event) => {
          this.status = 'disconnected';
          this.stopHeartbeat();
          this.log(`Connection closed: ${event.code} ${event.reason}`);
          this.emit('status', { status: 'disconnected' });

          if (!event.wasClean && this.reconnectAttempt < this.options.reconnectAttempts) {
            this.reconnect();
          }
        };
      } catch (error) {
        this.log('Connection error:', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.log('Disconnecting...');
    this.stopHeartbeat();
    this.clearReconnectTimeout();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }

    this.status = 'disconnected';
    this.emit('status', { status: 'disconnected' });
  }

  // Subscribe to a channel
  subscribe(channel: string, callback: EventCallback): void {
    if (!this.eventListeners.has(channel)) {
      this.eventListeners.set(channel, new Set());
    }
    this.eventListeners.get(channel)!.add(callback);

    // Send subscribe message to server
    this.sendToChannel('control', {
      type: 'subscribe',
      channel,
    });

    this.log(`Subscribed to channel: ${channel}`);
  }

  // Unsubscribe from a channel
  unsubscribe(channel: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(channel);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(channel);
      }
    }

    this.sendToChannel('control', {
      type: 'unsubscribe',
      channel,
    });

    this.log(`Unsubscribed from channel: ${channel}`);
  }

  // Send message to a specific channel
  sendToChannel(channel: string, data: any): void {
    const message = {
      channel,
      data,
      timestamp: Date.now(),
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      this.log(`Message sent to ${channel}:`, data);
    } else {
      // Queue message for later delivery
      this.messageQueue.push(message);
      this.log(`Message queued for ${channel} (offline)`, data);
    }
  }

  // Get current connection status
  getStatus(): ConnectionStatus {
    return this.status;
  }

  // Check if connected
  isConnected(): boolean {
    return this.status === 'connected';
  }

  // Get message queue length
  getQueueLength(): number {
    return this.messageQueue.length;
  }

  // Private methods

  private handleMessage(data: any): void {
    const { channel, type, payload } = data;

    // Handle pong response
    if (type === 'pong') {
      this.lastPongTimestamp = Date.now();
      return;
    }

    // Emit to channel listeners
    if (channel && this.eventListeners.has(channel)) {
      this.eventListeners.get(channel)!.forEach((callback) => {
        try {
          callback(payload || data);
        } catch (error) {
          this.log('Error in event listener:', error);
        }
      });
    }

    // Emit to generic listeners
    if (this.eventListeners.has('*')) {
      this.eventListeners.get('*')!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.log('Error in wildcard listener:', error);
        }
      });
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempt >= this.options.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.emit('error', { error: new Error('Max reconnection attempts reached') });
      return;
    }

    this.status = 'reconnecting';
    this.emit('status', { status: 'reconnecting' });

    const delay = Math.min(
      this.options.reconnectInterval * Math.pow(this.options.backoffMultiplier, this.reconnectAttempt),
      this.options.maxReconnectInterval
    );

    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1})`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempt++;
      this.connect().catch((error) => {
        this.log('Reconnection failed:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // Check if last pong was too long ago
        const timeSinceLastPong = Date.now() - this.lastPongTimestamp;
        if (timeSinceLastPong > 60000) {
          this.log('Heartbeat timeout, reconnecting...');
          this.ws.close(4000, 'Heartbeat timeout');
          return;
        }

        // Send ping
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        this.log('Heartbeat ping sent');
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private async flushMessageQueue(): Promise<void> {
    const queue = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of queue) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        this.log(`Queued message sent to ${message.channel}`);
      } else {
        this.messageQueue.push(message);
        break;
      }
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.log('Error emitting event:', error);
        }
      });
    }
  }

  private log(...args: any[]): void {
    if (this.options.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }
}

// Export singleton instance getter
let instance: WebSocketManager | null = null;

export function getWebSocketManager(options: WebSocketManagerOptions): WebSocketManager {
  if (!instance) {
    instance = new WebSocketManager(options);
  }
  return instance;
}

export function resetWebSocketManager(): void {
  if (instance) {
    instance.disconnect();
    instance = null;
  }
}
