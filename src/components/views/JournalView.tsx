import React, { useState } from 'react';
import { BookOpen, Smile, Sparkles, Calendar, Lock } from 'lucide-react';
import { JournalEntry } from '../../types/lifeos';
import { api } from '../../services/api';

interface JournalViewProps {
  entries: JournalEntry[];
  activeDate: string;
  onRefresh: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  activeDate,
  onRefresh,
}) => {
  const existingEntry = entries.find(e => e.entryDate === activeDate);

  const [title, setTitle] = useState(existingEntry?.title || 'Daily Retrospective');
  const [content, setContent] = useState(existingEntry?.content || '');
  const [moodScore, setMoodScore] = useState(existingEntry?.moodScore || 5);
  const [gratitude1, setGratitude1] = useState(existingEntry?.gratitude?.[0] || '');
  const [gratitude2, setGratitude2] = useState(existingEntry?.gratitude?.[1] || '');
  const [gratitude3, setGratitude3] = useState(existingEntry?.gratitude?.[2] || '');
  const [prompt, setPrompt] = useState(existingEntry?.promptUsed || 'What moved the needle most today?');
  const [saving, setSaving] = useState(false);

  const guidedPrompts = [
    'What moved the needle most today?',
    'What was the highest signal moment of my day?',
    'What did I learn or where did my discipline slip?',
    'What am I deeply grateful for right now?',
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const gratitudeList = [gratitude1, gratitude2, gratitude3].filter(Boolean);
      await api.saveJournalEntry({
        entryDate: activeDate,
        title,
        content,
        moodScore: Number(moodScore),
        promptUsed: prompt,
        gratitude: gratitudeList,
        tags: ['retrospective'],
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const moodEmojis = [
    { score: 1, label: 'Low Energy' },
    { score: 2, label: 'Sub-optimal' },
    { score: 3, label: 'Balanced' },
    { score: 4, label: 'Energized' },
    { score: 5, label: 'Peak Flow' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Private & Encrypted Local Storage</span>
            <span aria-hidden="true">·</span>
            <span>{activeDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Daily Journal & Retrospective
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Reflect on actions, log gratitude, and evaluate emotional state without social performance.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          {saving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Mood Selector & Guided Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mood */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <label className="block text-xs font-medium text-neutral-300">Daily Energy & Mood State</label>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {moodEmojis.map(m => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setMoodScore(m.score)}
                  className={`p-2 rounded-lg text-center border transition-colors ${
                    moodScore === m.score
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-sm font-bold font-mono">{m.score}/5</div>
                  <div className="text-[10px] mt-0.5 truncate">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Selector */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <label className="block text-xs font-medium text-neutral-300">Guided Reflection Prompt</label>
            <select
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 mt-1"
            >
              {guidedPrompts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Title & Longform Content */}
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Entry Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Deep clarity, code flow, and high momentum"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-400">Reflective Thoughts</label>
              <span className="text-[11px] text-neutral-500 font-mono">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={8}
              placeholder="Write your honest reflections on today's execution, emotional triggers, and decisions..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-100 leading-relaxed resize-none focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* 3 Gratitude Anchors */}
          <div className="space-y-2 pt-2 border-t border-neutral-850">
            <label className="block text-xs font-medium text-neutral-300">3 Specific Gratitude Anchors</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="1. e.g. Cool morning trail run with fresh air"
                value={gratitude1}
                onChange={e => setGratitude1(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
              />
              <input
                type="text"
                placeholder="2. e.g. Uninterrupted 3-hour focus on relational architecture"
                value={gratitude2}
                onChange={e => setGratitude2(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
              />
              <input
                type="text"
                placeholder="3. e.g. High speed home fiber internet"
                value={gratitude3}
                onChange={e => setGratitude3(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Past Entries Archive */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">Journal Archive</h3>
        <div className="divide-y divide-neutral-850">
          {entries.map(ent => (
            <div key={ent.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-200">{ent.title}</span>
                  <span className="text-[11px] text-neutral-500 font-mono">· {ent.entryDate}</span>
                </div>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  Mood: {ent.moodScore}/5
                </span>
              </div>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {ent.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
