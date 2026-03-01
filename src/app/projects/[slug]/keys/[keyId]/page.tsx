import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApiKeyUsage, simulateUsage, revokeApiKey } from '@/lib/actions';
import { prisma } from '@/lib/db';
import { maskKey } from '@/lib/keys';
import UsageActions from './usage-actions';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string; keyId: string };
  searchParams: { page?: string };
}

export default async function KeyUsagePage({ params, searchParams }: Props) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: params.keyId },
    include: { project: true },
  });
  if (!apiKey) notFound();

  const page = Math.max(1, parseInt(searchParams.page ?? '1') || 1);
  const { logs, total, totalPages } = await getApiKeyUsage(apiKey.id, page, 50);

  const successCount = logs.filter((l) => l.status >= 200 && l.status < 400).length;
  const errorCount = logs.filter((l) => l.status >= 400).length;
  const avgLatency = logs.length > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.latency, 0) / logs.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{apiKey.name}</h1>
          <p className="mt-0.5 font-mono text-sm text-gray-400">{maskKey(apiKey.prefix)}</p>
        </div>
        <Link
          href={`/projects/${params.slug}`}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Project
        </Link>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Status</p>
          <p className={`mt-1 font-semibold ${apiKey.revokedAt ? 'text-red-600' : 'text-green-600'}`}>
            {apiKey.revokedAt ? 'Revoked' : 'Active'}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Requests</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Success / Error</p>
          <p className="mt-1 font-semibold text-gray-900">
            <span className="text-green-600">{successCount}</span> / <span className="text-red-600">{errorCount}</span>
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Avg Latency</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{avgLatency}ms</p>
        </div>
      </div>

      {/* Actions */}
      <UsageActions apiKeyId={apiKey.id} projectSlug={params.slug} revoked={!!apiKey.revokedAt} />

      {/* Usage logs */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Requests ({total} total)
          </h2>
          {totalPages > 1 && (
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
          )}
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No usage recorded. Simulate some requests below.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500">Method</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Endpoint</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Latency</th>
                  <th className="px-4 py-3 font-medium text-gray-500">IP</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono font-medium text-gray-600">
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{log.endpoint}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-medium ${log.status < 400 ? 'text-green-600' : 'text-red-600'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{log.latency}ms</td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-400">{log.ip}</td>
                    <td className="px-4 py-2 text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="border-t px-4 py-3 flex items-center justify-between">
            <Link
              href={`/projects/${params.slug}/keys/${params.keyId}?page=${page - 1}`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                page <= 1 ? 'pointer-events-none opacity-40' : ''
              }`}
              aria-disabled={page <= 1}
            >
              Previous
            </Link>
            <span className="text-xs text-gray-500">
              {page} / {totalPages}
            </span>
            <Link
              href={`/projects/${params.slug}/keys/${params.keyId}?page=${page + 1}`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                page >= totalPages ? 'pointer-events-none opacity-40' : ''
              }`}
              aria-disabled={page >= totalPages}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
