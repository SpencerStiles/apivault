import Link from 'next/link';
import { listProjects, getStats } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [projects, stats] = await Promise.all([listProjects(), getStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your projects and API keys.</p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: stats.projectCount },
          { label: 'Total Keys', value: stats.keyCount },
          { label: 'Active Keys', value: stats.activeKeyCount },
          { label: 'Total Requests', value: stats.totalRequests },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">No projects yet</h3>
          <p className="mt-2 text-sm text-gray-500">Create a project to start managing API keys.</p>
          <Link
            href="/projects/new"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <div className="rounded-lg border bg-white p-5 transition-shadow hover:shadow-md">
                <h2 className="font-semibold text-gray-900">{project.name}</h2>
                {project.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">{project.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>{project._count.apiKeys} keys</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
