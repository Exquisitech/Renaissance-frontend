'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { getWebSocketManager } from '@/lib/websocket/WebSocketManager';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface ConnectionStatusIndicatorProps {
  className?: string;
}

export default function ConnectionStatusIndicator({ className }: ConnectionStatusIndicatorProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    const ws = getWebSocketManager({
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      debug: process.env.NODE_ENV === 'development',
    });

    // Subscribe to status changes
    const handleStatusChange = (data: any) => {
      setStatus(data.status);
    };

    ws.subscribe('status', handleStatusChange);

    // Get initial status
    setStatus(ws.getStatus());

    return () => {
      ws.unsubscribe('status', handleStatusChange);
    };
  }, []);

  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600',
        };
      case 'connecting':
        return {
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          label: 'Connecting...',
          variant: 'secondary' as const,
          className: 'bg-blue-500 hover:bg-blue-600',
        };
      case 'reconnecting':
        return {
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          label: 'Reconnecting...',
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'disconnected':
      default:
        return {
          icon: <WifiOff className="h-3 w-3" />,
          label: 'Disconnected',
          variant: 'destructive' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`gap-1.5 ${config.className} ${className || ''}`}>
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </Badge>
  );
}
