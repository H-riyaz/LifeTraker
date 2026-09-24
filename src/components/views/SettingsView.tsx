import React, { useState } from 'react';
import { Settings, Save, Download, Upload, ShieldCheck, User } from 'lucide-react';
import { UserProfile } from '../../types/lifeos';
import { api } from '../../services/api';

interface SettingsViewProps {
  user: UserProfile;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onRefresh }) => {
  const [fullName, setFullName] = useState(user?.fullName || 'Riyaz');
  const [email, setEmail] = useState(user?.email || 'riyaz@lifeos.local');
  const [currency, setCurrency] = useState(user?.currency || 'NPR');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kathmandu');
  const [workGoalHours, setWorkGoalHours] = useState(
    Math.round((user?.dailyWorkGoalMinutes || 360) / 60)
  );
  const [sleepGoalHours, setSleepGoalHours] = useState(
    Math.round((user?.dailySleepGoalMinutes || 480) / 60)
  );
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      await api.updateUserProfile({
        fullName,
        email,
        currency,
        timezone,
        dailyWorkGoalMinutes: Number(workGoalHours) * 60,
        dailySleepGoalMinutes: Number(sleepGoalHours) * 60,
      });
      setSaveMessage('Profile settings saved successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    window.open('/api/data/export?format=json', '_blank');
  };

  const handleExportCsv = () => {
    window.open('/api/data/export?format=csv', '_blank');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setImportStatus('Restoring database...');
        await api.importData(parsed);
        setImportStatus('Data successfully restored!');
        setTimeout(() => setImportStatus(''), 4000);
        onRefresh();
      } catch (err) {
        setImportStatus('Error: Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs text-neutral-400 font-mono">System Configuration & Persistence</div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
          Settings & Data Management
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure currency standards, target circadian metrics, and execute zero-friction full backups.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          {saveMessage}
        </div>
      )}

      {/* User Profile & Operational Targets Form */}
      <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-100 border-b border-neutral-850 pb-3">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Operator Profile & Regional Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Operational Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
            >
              <option value="NPR">NPR (Nepalese Rupee - Default)</option>
              <option value="USD">USD (United States Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="INR">INR (Indian Rupee)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Daily Deep Work Target (Hours)</label>
            <input
              type="number"
              min="1"
              max="16"
              value={workGoalHours}
              onChange={e => setWorkGoalHours(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Daily Sleep Restoration Target (Hours)</label>
            <input
              type="number"
              min="4"
              max="12"
              value={sleepGoalHours}
              onChange={e => setSleepGoalHours(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-850">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Restore */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-100 border-b border-neutral-850 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local Sovereign Data Management & Portability</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Your LifeOS data is preserved atomically on disk with zero vendor lock-in. Export full records at any time or restore a previous snapshot JSON archive.
        </p>

        {importStatus && (
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Export */}
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-850 space-y-3">
            <div className="text-xs font-semibold text-neutral-200">Export LifeOS Ledger</div>
            <p className="text-[11px] text-neutral-500">
              Download your complete schedule, tasks, habits, expenses, workouts, and journal entries.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON Archive</span>
              </button>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Summaries</span>
              </button>
            </div>
          </div>

          {/* Import */}
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-850 space-y-3">
            <div className="text-xs font-semibold text-neutral-200">Restore Snapshot</div>
            <p className="text-[11px] text-neutral-500">
              Upload an existing LifeOS JSON backup file to overwrite current in-memory records.
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Select Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
