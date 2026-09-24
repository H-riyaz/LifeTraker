import React, { useState } from 'react';
import { Bot, Sparkles, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';

interface AiAssistantViewProps {
  activeDate: string;
  onRefresh: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ activeDate, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'assistant'>('planner');

  // Assistant Chat State
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello Riyaz. I am your LifeOS intelligence companion, grounded strictly in your authentic recorded metrics. Ask me anything about your focus trends, sleep debt, budget pacing, or habit streaks.',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Daily Planner State
  const [plannerPreferences, setPlannerPreferences] = useState(
    'Schedule morning high-alertness deep work sprint for systems programming; protect 8-hour sleep window; reserve 45 mins for evening run.'
  );
  const [planResult, setPlanResult] = useState<any>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [planApplied, setPlanApplied] = useState(false);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || chatLoading) return;

    const userText = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const reply = await api.askAiAssistant(userText, activeDate);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `Error: ${err.message || 'Could not query assistant'}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlannerLoading(true);
    setPlanApplied(false);
    try {
      const res = await api.generateAiDailyPlan(activeDate, plannerPreferences, false);
      setPlanResult(res.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setPlannerLoading(false);
    }
  };

  const handleApplyToTimeline = async () => {
    if (!planResult) return;
    try {
      await api.generateAiDailyPlan(activeDate, plannerPreferences, true);
      setPlanApplied(true);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Server-side Gemini 3.8 Flash Integration</span>
            <span aria-hidden="true">·</span>
            <span>Zero-AI-Slop Grounded Intelligence</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            AI Assistant & Daily Planner
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Synthesize your tasks, habits, and calendar into optimal execution schedules without hallucinated data.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'planner' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'assistant' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Data Inquiries</span>
          </button>
        </div>
      </div>

      {/* PLANNER TAB */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                Optimization Directives & Preferences for {activeDate}
              </label>
              <textarea
                rows={2}
                value={plannerPreferences}
                onChange={e => setPlannerPreferences(e.target.value)}
                placeholder="e.g. Focus on high priority tasks, gym workout at 17:30, screens off by 22:00..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono">
                Ingests pending tasks, habit streaks, and sleep constraints.
              </span>
              <button
                onClick={handleGeneratePlan}
                disabled={plannerLoading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{plannerLoading ? 'Optimizing Schedule...' : 'Generate Daily Schedule'}</span>
              </button>
            </div>
          </div>

          {planResult && (
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-100">Proposed Timeline Schedule</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{planResult.summary}</p>
                </div>
                <button
                  onClick={handleApplyToTimeline}
                  disabled={planApplied}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    planApplied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{planApplied ? 'Applied to Timeline!' : 'Apply to Today’s Timeline'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {planResult.schedule.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-neutral-950 border border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <span className="font-mono font-semibold text-indigo-400 shrink-0 min-w-[95px]">
                        {item.time}
                      </span>
                      <div>
                        <div className="font-medium text-neutral-200">{item.title}</div>
                        <div className="text-[11px] text-neutral-400 leading-relaxed">{item.rationale}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-neutral-850 text-neutral-400 uppercase shrink-0 self-start md:self-auto">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ASSISTANT CHAT TAB */}
      {activeTab === 'assistant' && (
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center shrink-0 text-white mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-xl whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-neutral-950 border border-neutral-850 text-neutral-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3 text-xs text-neutral-400 items-center">
                <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span>Analyzing your recorded metrics...</span>
              </div>
            )}
          </div>

          {/* Prompt suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-neutral-850">
            {[
              'How was my productivity this past week?',
              'Where is most of my money going this month?',
              'What habit has my longest active streak?',
              'Did late screen time affect my sleep quality?',
            ].map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-[11px] text-neutral-400 hover:text-neutral-200 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-neutral-850">
            <input
              type="text"
              placeholder="Ask questions about your authentic recorded data..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !query.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
