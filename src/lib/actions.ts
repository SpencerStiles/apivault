'use server';

import { prisma } from './db';
import { generateApiKey } from './keys';
import { revalidatePath } from 'next/cache';

// ──────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────

export async function createProject(data: { name: string; description?: string }) {
  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Math.random().toString(36).slice(2, 7);

    const project = await prisma.project.create({
      data: { name: data.name, description: data.description ?? '', slug },
    });

    revalidatePath('/');
    return project;
  } catch (err) {
    console.error('[createProject]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function getProject(slug: string) {
  try {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        apiKeys: { orderBy: { createdAt: 'desc' } },
        _count: { select: { apiKeys: true } },
      },
    });
  } catch (err) {
    console.error('[getProject]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function listProjects() {
  try {
    return prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { apiKeys: true } },
      },
    });
  } catch (err) {
    console.error('[listProjects]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath('/');
  } catch (err) {
    console.error('[deleteProject]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// API Keys
// ──────────────────────────────────────────────

export async function createApiKey(data: {
  projectId: string;
  name: string;
  scopes?: string[];
  rateLimit?: number;
  expiresAt?: string;
}) {
  try {
    // Validate name
    const trimmedName = (data.name ?? '').trim();
    if (!trimmedName) {
      throw new Error('Key name is required.');
    }
    if (trimmedName.length > 100) {
      throw new Error('Key name must be 100 characters or fewer.');
    }

    // Validate rateLimit
    const rateLimit = data.rateLimit ?? 1000;
    if (!Number.isInteger(rateLimit) || rateLimit <= 0) {
      throw new Error('Rate limit must be a positive integer.');
    }

    // Validate expiresAt
    if (data.expiresAt !== undefined && data.expiresAt !== '') {
      const expiry = new Date(data.expiresAt);
      if (isNaN(expiry.getTime())) {
        throw new Error('Expiry date is not a valid date.');
      }
      if (expiry <= new Date()) {
        throw new Error('Expiry date must be in the future.');
      }
    }

    const { key, prefix, hash } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        projectId: data.projectId,
        name: trimmedName,
        prefix,
        hash,
        scopes: data.scopes ? JSON.stringify(data.scopes) : '',
        rateLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    revalidatePath('/');
    // Return the full key only once at creation time
    return { ...apiKey, fullKey: key };
  } catch (err) {
    console.error('[createApiKey]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function revokeApiKey(id: string) {
  try {
    await prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
    revalidatePath('/');
  } catch (err) {
    console.error('[revokeApiKey]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function deleteApiKey(id: string) {
  try {
    await prisma.apiKey.delete({ where: { id } });
    revalidatePath('/');
  } catch (err) {
    console.error('[deleteApiKey]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

export async function getApiKeyUsage(
  apiKeyId: string,
  page: number = 1,
  pageSize: number = 50,
) {
  try {
    const skip = (page - 1) * pageSize;
    const [logs, total] = await Promise.all([
      prisma.usageLog.findMany({
        where: { apiKeyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.usageLog.count({ where: { apiKeyId } }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return { logs, total, page, pageSize, totalPages };
  } catch (err) {
    console.error('[getApiKeyUsage]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// Usage Simulation
// ──────────────────────────────────────────────

export async function simulateUsage(apiKeyId: string) {
  try {
    const endpoints = ['/api/users', '/api/posts', '/api/data', '/api/search', '/api/auth'];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const statuses = [200, 200, 200, 200, 201, 400, 401, 404, 500];

    const logs = Array.from({ length: 5 + Math.floor(Math.random() * 15) }, () => ({
      apiKeyId,
      endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      latency: Math.floor(Math.random() * 500) + 10,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    }));

    await prisma.usageLog.createMany({ data: logs });

    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() },
    });

    revalidatePath('/');
  } catch (err) {
    console.error('[simulateUsage]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}

// ──────────────────────────────────────────────
// Stats
// ──────────────────────────────────────────────

export async function getStats() {
  try {
    const [projectCount, keyCount, activeKeyCount, totalRequests] = await Promise.all([
      prisma.project.count(),
      prisma.apiKey.count(),
      prisma.apiKey.count({ where: { revokedAt: null } }),
      prisma.usageLog.count(),
    ]);

    return { projectCount, keyCount, activeKeyCount, totalRequests };
  } catch (err) {
    console.error('[getStats]', err);
    throw new Error(err instanceof Error ? err.message : 'Operation failed');
  }
}
