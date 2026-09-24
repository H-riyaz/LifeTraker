import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { ViewType } from '../layout/Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (moduleName: string) => {
    onClose();
    if (moduleName === 'Tasks') onNavigate('tasks');
    else if (moduleName === 'Habits') onNavigate('habits');
    else if (moduleName === 'Journal') onNavigate('journal');
    else if (moduleName === 'Goals') onNavigate('goals');
    else if (moduleName === 'Finance') onNavigate('finances');
    else onNavigate('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-start justify-center pt-20 p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, habits, transactions, journal, goals..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="p-6 text-center text-xs text-neutral-400">Searching across LifeOS...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center text-xs text-neutral-400">
              No matching records found for "{query}".
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r.module)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-800 transition-colors text-left group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold tracking-wider">
                        {r.module}
                      </span>
                      {r.date && (
                        <span className="text-[11px] text-neutral-400 font-mono">· {r.date}</span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-neutral-200 truncate mt-0.5">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{r.detail}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-6 text-center text-xs text-neutral-400">
              Type keywords like <span className="text-neutral-300 font-mono">"systems"</span>,{' '}
              <span className="text-neutral-300 font-mono">"sleep"</span>, or{' '}
              <span className="text-neutral-300 font-mono">"food"</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
