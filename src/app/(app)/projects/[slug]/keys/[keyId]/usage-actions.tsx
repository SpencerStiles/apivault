'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { simulateUsage, revokeApiKey } from '@/lib/actions';

interface Props {
  apiKeyId: string;
  projectSlug: string;
  revoked: boolean;
}

export default function UsageActions({ apiKeyId, projectSlug, revoked }: Props) {
  const router = useRouter();
  const [simulating, setSimulating] = useState(false);
  const [revoking, setRevoking] = useState(false);

  async function handleSimulate() {
    setSimulating(true);
    await simulateUsage(apiKeyId);
    setSimulating(false);
    router.refresh();
  }

  async function handleRevoke() {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    setRevoking(true);
    await revokeApiKey(apiKeyId);
    router.push(`/projects/${projectSlug}`);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleSimulate}
        disabled={simulating || revoked}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {simulating ? 'Simulating...' : 'Simulate Usage'}
      </button>
      {!revoked && (
        <button
          onClick={handleRevoke}
          disabled={revoking}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {revoking ? 'Revoking...' : 'Revoke Key'}
        </button>
      )}
    </div>
  );
}
