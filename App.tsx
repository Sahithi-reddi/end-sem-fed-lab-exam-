import React, { useState, useCallback, useMemo } from 'react';
import EventCard from './components/EventCard';
import ConsoleViewer from './components/ConsoleViewer';
import { MOCK_EVENTS } from './constants';
import { LogEntry } from './types';
import { Activity, Zap, Info, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [bookedEvents, setBookedEvents] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  // Dummy state to force parent re-renders
  const [tick, setTick] = useState(0); 
  const [useOptimization, setUseOptimization] = useState(true);

  // Helper to add logs to our visual console
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), entry]); // Keep last 50 logs
  }, []);

  // 1. The Optimized Handler (using useCallback)
  // By using the functional update pattern `setBookedEvents(prev => ...)`
  // we remove the dependency on `bookedEvents` state. 
  // Dependency array is empty [], so this function reference NEVER changes.
  const handleBookOptimized = useCallback((id: string) => {
    addLog(`Booking Action: ID ${id}`, 'action');
    console.log(`%c[Action] Booking ID ${id}`, 'color: #3b82f6');
    
    setBookedEvents(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [addLog]);

  // 2. The Un-Optimized Handler (Standard function)
  // This function is recreated on EVERY render of App because it's defined in the render scope.
  const handleBookUnoptimized = (id: string) => {
    addLog(`Booking Action (Unoptimized): ID ${id}`, 'action');
    console.log(`%c[Action] Booking ID ${id}`, 'color: #ef4444');

    setBookedEvents(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Toggle forcing a re-render
  const forceUpdate = () => {
    setTick(t => t + 1);
    addLog('Parent component forcibly re-rendered', 'info');
  };

  const clearLogs = () => setLogs([]);

  // Select which handler to pass down based on the toggle
  const onBookHandler = useOptimization ? handleBookOptimized : handleBookUnoptimized;

  return (
    <div className="min-h-screen bg-gray-900 pr-80"> {/* Padding right for log panel */}
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">EventFlow</h1>
                <p className="text-xs text-blue-400 font-medium">Performance Demo</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <div className="text-xs text-gray-500 uppercase font-semibold">Booked Events</div>
                <div className="text-2xl font-mono text-white leading-none">{bookedEvents.size}</div>
              </div>
              
              <div className="h-8 w-px bg-gray-700 mx-2"></div>

              {/* Optimization Toggle */}
              <div className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg border border-gray-700">
                <span className={`text-sm font-medium ${useOptimization ? 'text-green-400' : 'text-gray-400'}`}>
                  useCallback: {useOptimization ? 'ON' : 'OFF'}
                </span>
                <button 
                  onClick={() => {
                    setUseOptimization(!useOptimization);
                    addLog(`Switched optimization to ${!useOptimization ? 'ON' : 'OFF'}`, 'info');
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    useOptimization ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useOptimization ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Controls Section */}
        <section className="mb-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Performance Test Zone
              </h2>
              <p className="text-gray-400 text-sm max-w-xl">
                Click "Force Parent Re-render" to trigger an update in the App component. 
                <br/>
                If <span className="text-green-400 font-mono">useCallback</span> is <strong>ON</strong>, the child Event Cards will <strong>NOT</strong> re-render.
                <br/>
                If <span className="text-red-400 font-mono">useCallback</span> is <strong>OFF</strong>, all cards will re-render unnecessarily.
              </p>
            </div>
            <button
              onClick={forceUpdate}
              className="flex-shrink-0 bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-xl font-medium transition-all active:scale-95 flex items-center gap-2 border border-gray-600 hover:border-gray-500"
            >
              <RefreshCw size={18} className={tick % 2 === 0 ? "" : "rotate-180 transition-transform duration-300"} />
              Force Parent Re-render ({tick})
            </button>
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isBooked={bookedEvents.has(event.id)}
              onBook={onBookHandler}
              logRender={(msg) => addLog(msg, 'render')}
            />
          ))}
        </div>

        {/* Explanation Footer */}
        <footer className="mt-12 border-t border-gray-800 pt-8 text-gray-500 text-sm">
          <div className="flex items-start gap-3">
            <Info size={16} className="mt-1 flex-shrink-0" />
            <div>
              <p className="mb-2">
                <strong>Why does this work?</strong> The <code>EventCard</code> component is wrapped in <code>React.memo</code>. 
                It only re-renders if its props change.
              </p>
              <p>
                When <code>useCallback</code> is used in the parent, the <code>onBook</code> function reference remains stable across renders. 
                Therefore, <code>EventCard</code> sees the exact same props and skips rendering.
              </p>
            </div>
          </div>
        </footer>

      </main>

      {/* Log Panel */}
      <ConsoleViewer logs={logs} onClear={clearLogs} />
    </div>
  );
};

export default App;