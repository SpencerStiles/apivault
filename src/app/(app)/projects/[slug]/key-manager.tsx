'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createApiKey, revokeApiKey, simulateUsage } from '@/lib/actions';

interface Props {
  projectId: string;
  projectSlug: string;
}

export default function KeyManager({ projectId, projectSlug }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [rateLimit, setRateLimit] = useState('1000');
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const result = await createApiKey({
        projectId,
        name,
        rateLimit: parseInt(rateLimit) || 1000,
      });
      setNewKey(result.fullKey);
      setName('');
      setRateLimit('1000');
      router.refresh();
    } catch {
      setError('Failed to create key. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDone() {
    setNewKey(null);
    setCreating(false);
  }

  return (
    <div className="space-y-4">
      {newKey ? (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <p className="text-sm font-medium text-brand-800">Your new API key (copy it now — it won&apos;t be shown again):</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-xs text-gray-900 break-all">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-white"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button
            onClick={handleDone}
            className="mt-3 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Done
          </button>
        </div>
      ) : creating ? (
        <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Create API Key</h3>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500">Key Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production"
                className="mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Rate Limit (req/hr)</label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="mt-1 block w-full rounded-lg border px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={saving || !name.trim()}
              className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Generate Key'}
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-lg border px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Create API Key
        </button>
      )}
    </div>
  );
}
