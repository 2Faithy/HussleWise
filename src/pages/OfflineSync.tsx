import { useState, useEffect } from 'react';
import {
  Wifi, WifiOff, MessageSquare, Send, RefreshCw,
  CheckCircle2, AlertTriangle, Clock, Trash2,
} from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { formatNaira } from '../utils/currency';

export default function OfflineSync() {
  const { offlineQueue, simulateIncomingSMS, syncOfflineQueue, clearSyncedEntries } = useBusinessData();
  const isOnline = useOnlineStatus();
  const [smsInput, setSmsInput] = useState('');
  const [autoSynced, setAutoSynced] = useState(false);

  const queuedEntries = offlineQueue.filter((e) => e.status === 'queued');
  const syncedEntries = offlineQueue.filter((e) => e.status === 'synced');

  // Auto-sync whenever connectivity returns and there's a queue waiting
  useEffect(() => {
    if (isOnline && queuedEntries.length > 0 && !autoSynced) {
      syncOfflineQueue();
      setAutoSynced(true);
    }
    if (!isOnline) {
      setAutoSynced(false);
    }
  }, [isOnline, queuedEntries.length]);

  const handleSimulateSMS = () => {
    if (!smsInput.trim()) return;
    simulateIncomingSMS(smsInput);
    setSmsInput('');
  };

  const quickExamples = ['SALE 5000 Tomatoes basket', 'SALE 3500 Delivery service', 'EXPENSE 2000 Transport'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Offline Sync
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          No internet? Log sales via SMS — they sync automatically once you're back online.
        </p>
      </div>

      {/* Connection status */}
      <div className={`rounded-2xl p-6 mb-8 flex items-center gap-4 ${isOnline ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
          {isOnline ? <Wifi size={22} className="text-green-600" /> : <WifiOff size={22} className="text-red-500" />}
        </div>
        <div className="flex-1">
          <p className={`font-body font-bold ${isOnline ? 'text-green-700' : 'text-red-600'}`}>
            {isOnline ? "You're online" : "You're offline"}
          </p>
          <p className="font-body text-xs text-brand-ink/60">
            {isOnline
              ? queuedEntries.length > 0
                ? 'Syncing your queued entries now...'
                : 'All entries are synced.'
              : 'Log sales via SMS below — they\'ll queue and sync automatically once reconnected.'}
          </p>
        </div>
        {queuedEntries.length > 0 && (
          <span className="font-body text-xs font-bold bg-brand-accent text-brand-ink px-3 py-1.5 rounded-full shrink-0">
            {queuedEntries.length} queued
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* SMS format instructions */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center">
              <MessageSquare size={18} className="text-brand-primary" />
            </div>
            <h3 className="font-headline font-bold text-brand-ink">How It Works</h3>
          </div>

          <p className="font-body text-sm text-brand-ink/70 mb-4">
            When you have no internet, text your sale or expense to <span className="font-bold text-brand-ink">32000</span> in this format:
          </p>

          <div className="bg-brand-bg/30 rounded-lg p-4 font-body text-sm text-brand-ink mb-4 space-y-2">
            <p><span className="font-bold text-brand-primary">SALE</span> [amount] [item] — e.g. "SALE 5000 Tomatoes"</p>
            <p><span className="font-bold text-brand-primary">EXPENSE</span> [amount] [type] — e.g. "EXPENSE 2000 Transport"</p>
          </div>

          <p className="font-body text-xs text-brand-ink/50">
            Your entry is queued instantly and syncs into your Sales & Expenses records the moment your phone reconnects to the internet — no need to re-enter anything.
          </p>
        </div>

        {/* Simulate incoming SMS (demo tool) */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center">
              <Send size={18} className="text-brand-primary" />
            </div>
            <h3 className="font-headline font-bold text-brand-ink">Simulate an SMS</h3>
          </div>
          <p className="font-body text-xs text-brand-ink/50 mb-4">
            For this demo — type a message as if it came in via SMS.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateSMS()}
              placeholder="e.g. SALE 5000 Tomatoes"
              className="flex-1 font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
            <button
              onClick={handleSimulateSMS}
              className="shrink-0 bg-brand-primary text-brand-bg font-body text-sm font-bold px-4 rounded-lg hover:opacity-90 transition"
            >
              Send
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickExamples.map((ex) => (
              <button
                key={ex}
                onClick={() => setSmsInput(ex)}
                className="font-body text-xs text-brand-primary bg-brand-bg/30 px-3 py-1.5 rounded-full hover:bg-brand-bg/50 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue + history */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline text-lg font-bold text-brand-ink">Message Log</h2>
        {syncedEntries.length > 0 && (
          <button
            onClick={clearSyncedEntries}
            className="flex items-center gap-1.5 font-body text-xs font-bold text-brand-ink/50 hover:text-red-500 transition"
          >
            <Trash2 size={13} /> Clear synced
          </button>
        )}
      </div>

      {offlineQueue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-primary/10 text-center py-14">
          <p className="font-body text-sm text-brand-ink/50">No messages yet. Try simulating one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-primary/10 divide-y divide-brand-primary/5">
          {offlineQueue.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                {entry.status === 'synced' && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
                {entry.status === 'queued' && <Clock size={18} className="text-yellow-600 shrink-0" />}
                {entry.status === 'error' && <AlertTriangle size={18} className="text-red-500 shrink-0" />}

                <div>
                  <p className="font-body text-sm font-bold text-brand-ink">"{entry.rawMessage}"</p>
                  <p className="font-body text-xs text-brand-ink/50">
                    {entry.status === 'error'
                      ? 'Could not parse this message — check the format'
                      : `${entry.type === 'sale' ? 'Sale' : 'Expense'} · ${entry.description}`}
                    {' · '}{entry.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {entry.amount && (
                  <span className="font-body text-sm font-bold text-brand-ink">{formatNaira(entry.amount)}</span>
                )}
                <span
                  className={`font-body text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                    entry.status === 'synced' ? 'bg-green-50 text-green-700'
                    : entry.status === 'queued' ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-600'
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isOnline && queuedEntries.length > 0 && (
        <button
          onClick={syncOfflineQueue}
          disabled
          className="w-full flex items-center justify-center gap-2 bg-brand-primary/40 text-brand-bg font-body font-bold px-6 py-3 rounded-lg mt-5 cursor-not-allowed"
        >
          <RefreshCw size={16} /> Waiting for connection to sync...
        </button>
      )}
    </div>
  );
}