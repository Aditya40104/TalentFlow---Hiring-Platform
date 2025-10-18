import { http, HttpResponse } from 'msw';
import { db } from '@/db';
import type { Job, JobFilters, PaginatedResponse } from '@/types';

const API_BASE = '/api';

export const jobHandlers = [
  // GET /api/jobs - List jobs with pagination and filters
  http.get(`${API_BASE}/jobs`, async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') as JobFilters['status'];
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean);

    let query = db.jobs.orderBy('order');

    const allJobs = await query.toArray();
    
    let filtered = allJobs.filter((job) => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (status && job.status !== status) {
        return false;
      }
      if (tags && tags.length > 0 && !tags.some(tag => job.tags.includes(tag))) {
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const response: PaginatedResponse<Job> = {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/jobs/:id - Get single job
  http.get(`${API_BASE}/jobs/:id`, async ({ params }) => {
    const { id } = params;
    const job = await db.jobs.get(id as string);

    if (!job) {
      return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return HttpResponse.json(job);
  }),

  // POST /api/jobs - Create job
  http.post(`${API_BASE}/jobs`, async ({ request }) => {
    const body = (await request.json()) as Partial<Job>;

    // Check if slug is unique
    const existing = await db.jobs.where('slug').equals(body.slug!).first();
    if (existing) {
      return HttpResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    // Get max order
    const jobs = await db.jobs.toArray();
    const maxOrder = jobs.length > 0 ? Math.max(...jobs.map(j => j.order)) : -1;

    const newJob: Job = {
      id: crypto.randomUUID(),
      title: body.title!,
      slug: body.slug!,
      description: body.description || '',
      status: 'active',
      tags: body.tags || [],
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.jobs.add(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  // PUT /api/jobs/:id - Update job
  http.put(`${API_BASE}/jobs/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Job>;

    const job = await db.jobs.get(id as string);
    if (!job) {
      return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== job.slug) {
      const existing = await db.jobs.where('slug').equals(body.slug).first();
      if (existing) {
        return HttpResponse.json({ error: 'Slug must be unique' }, { status: 400 });
      }
    }

    const updated: Job = {
      ...job,
      ...body,
      id: job.id,
      updatedAt: new Date(),
    };

    await db.jobs.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/jobs/:id - Delete job
  http.delete(`${API_BASE}/jobs/:id`, async ({ params }) => {
    const { id } = params;
    await db.jobs.delete(id as string);
    return HttpResponse.json({ success: true });
  }),

  // POST /api/jobs/reorder - Reorder jobs
  http.post(`${API_BASE}/jobs/reorder`, async ({ request }) => {
    const { jobIds } = (await request.json()) as { jobIds: string[] };

    // Update order for each job
    await Promise.all(
      jobIds.map((id, index) =>
        db.jobs.update(id, { order: index })
      )
    );

    return HttpResponse.json({ success: true });
  }),

  // POST /api/jobs/:id/archive - Archive job
  http.post(`${API_BASE}/jobs/:id/archive`, async ({ params }) => {
    const { id } = params;
    await db.jobs.update(id as string, { status: 'archived', updatedAt: new Date() });
    const job = await db.jobs.get(id as string);
    return HttpResponse.json(job);
  }),

  // POST /api/jobs/:id/unarchive - Unarchive job
  http.post(`${API_BASE}/jobs/:id/unarchive`, async ({ params }) => {
    const { id } = params;
    await db.jobs.update(id as string, { status: 'active', updatedAt: new Date() });
    const job = await db.jobs.get(id as string);
    return HttpResponse.json(job);
  }),
];
