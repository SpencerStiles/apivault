import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject } from '@/lib/actions';
import { maskKey } from '@/lib/keys';
import KeyManager from './key-manager';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const activeKeys = project.apiKeys.filter((k) => !k.revokedAt);
  const revokedKeys = project.apiKeys.filter((k) => k.revokedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          )}
        </div>
        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Keys</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{project.apiKeys.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Active</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{activeKeys.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Revoked</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{revokedKeys.length}</p>
        </div>
      </div>

      {/* Active keys */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold text-gray-900">Active Keys</h2>
        </div>
        {activeKeys.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No active keys. Create one below.</div>
        ) : (
          <div className="divide-y">
            {activeKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{key.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{maskKey(key.prefix)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-gray-400">
                    <p>Rate: {key.rateLimit}/hr</p>
                    {key.lastUsedAt && <p>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</p>}
                  </div>
                  <Link
                    href={`/projects/${project.slug}/keys/${key.id}`}
                    className="rounded border px-3 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  >
                    Usage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoked keys */}
      {revokedKeys.length > 0 && (
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-gray-500">Revoked Keys</h2>
          </div>
          <div className="divide-y">
            {revokedKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between px-4 py-3 opacity-50">
                <div>
                  <p className="font-medium text-gray-700 line-through">{key.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{maskKey(key.prefix)}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Revoked {key.revokedAt ? new Date(key.revokedAt).toLocaleDateString() : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create key */}
      <KeyManager projectId={project.id} projectSlug={project.slug} />
    </div>
  );
}
