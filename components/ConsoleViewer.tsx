import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Trash2 } from 'lucide-react';

interface ConsoleViewerProps {
  logs: LogEntry[];
  onClear: () => void;
}

const ConsoleViewer: React.FC<ConsoleViewerProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800 shadow-2xl w-80 fixed right-0 top-0 bottom-0 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2 text-gray-100 font-mono text-sm">
          <Terminal size={16} className="text-blue-500" />
          <span>Render Logs</span>
        </div>
        <button 
          onClick={onClear}
          className="p-1.5 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded transition-colors"
          title="Clear logs"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar">
        {logs.length === 0 && (
          <div className="text-gray-600 italic text-center mt-10">
            Waiting for events...
          </div>
        )}
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`p-2 rounded border-l-2 ${
              log.type === 'render' ? 'border-yellow-500 bg-yellow-900/10 text-yellow-200' :
              log.type === 'action' ? 'border-blue-500 bg-blue-900/10 text-blue-200' :
              'border-gray-500 text-gray-300'
            }`}
          >
            <div className="opacity-50 text-[10px] mb-1">{log.timestamp}</div>
            <div>{log.message}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="p-3 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-500 text-center">
        Check browser console for raw logs
      </div>
    </div>
  );
};

export default ConsoleViewer;