'use client';

import { ConnectionState } from '@/types';

type ConnectionStatusProps = {
  state: ConnectionState;
  reconnectAttempts: number;
};

export default function ConnectionStatus({ state, reconnectAttempts }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case ConnectionState.CONNECTED:
        return {
          label: 'Connected',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          icon: '●',
        };
      case ConnectionState.CONNECTING:
        return {
          label: 'Connecting...',
          color: 'bg-amber-500',
          textColor: 'text-amber-400',
          icon: '◐',
        };
      case ConnectionState.DISCONNECTED:
        return {
          label: 'Disconnected',
          color: 'bg-red-500',
          textColor: 'text-red-400',
          icon: '○',
        };
      case ConnectionState.ERROR:
        return {
          label: 'Error',
          color: 'bg-red-600',
          textColor: 'text-red-400',
          icon: '✕',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2">
        <span className={`${config.color} w-2 h-2 rounded-full ${state === ConnectionState.CONNECTING ? 'animate-pulse' : ''}`} />
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>
      </div>
      
      {reconnectAttempts > 0 && state !== ConnectionState.CONNECTED && (
        <span className="text-xs text-gray-400">
          (Attempt {reconnectAttempts})
        </span>
      )}
    </div>
  );
}
