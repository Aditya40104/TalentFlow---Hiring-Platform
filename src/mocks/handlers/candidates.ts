import { http, HttpResponse } from 'msw';
import { db } from '@/db';
import type { Candidate, CandidateFilters, PaginatedResponse, StageChange, Note } from '@/types';

const API_BASE = '/api';

export const candidateHandlers = [
  // GET /api/candidates - List candidates with pagination and filters
  http.get(`${API_BASE}/candidates`, async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') as CandidateFilters['stage'];
    const jobId = url.searchParams.get('jobId');

    let query = db.candidates.orderBy('appliedAt').reverse();

    const allCandidates = await query.toArray();
    
    let filtered = allCandidates.filter((candidate) => {
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !candidate.name.toLowerCase().includes(searchLower) &&
          !candidate.email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (stage && candidate.stage !== stage) {
        return false;
      }
      if (jobId && candidate.jobId !== jobId) {
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const response: PaginatedResponse<Candidate> = {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  // GET /api/candidates/:id - Get single candidate
  http.get(`${API_BASE}/candidates/:id`, async ({ params }) => {
    const { id } = params;
    const candidate = await db.candidates.get(id as string);

    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return HttpResponse.json(candidate);
  }),

  // POST /api/candidates - Create candidate
  http.post(`${API_BASE}/candidates`, async ({ request }) => {
    const body = (await request.json()) as Partial<Candidate>;

    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: body.name!,
      email: body.email!,
      phone: body.phone,
      jobId: body.jobId!,
      stage: 'applied',
      appliedAt: new Date(),
      updatedAt: new Date(),
    };

    await db.candidates.add(newCandidate);

    // Add initial stage change
    const stageChange: StageChange = {
      id: crypto.randomUUID(),
      candidateId: newCandidate.id,
      fromStage: null,
      toStage: 'applied',
      changedAt: new Date(),
    };
    await db.stageChanges.add(stageChange);

    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  // PUT /api/candidates/:id - Update candidate
  http.put(`${API_BASE}/candidates/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Candidate>;

    const candidate = await db.candidates.get(id as string);
    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const updated: Candidate = {
      ...candidate,
      ...body,
      id: candidate.id,
      updatedAt: new Date(),
    };

    await db.candidates.put(updated);
    return HttpResponse.json(updated);
  }),

  // PATCH /api/candidates/:id/stage - Update candidate stage
  http.patch(`${API_BASE}/candidates/:id/stage`, async ({ params, request }) => {
    const { id } = params;
    const { stage, note } = (await request.json()) as { stage: Candidate['stage']; note?: string };

    const candidate = await db.candidates.get(id as string);
    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const oldStage = candidate.stage;
    await db.candidates.update(id as string, { stage, updatedAt: new Date() });

    // Record stage change
    const stageChange: StageChange = {
      id: crypto.randomUUID(),
      candidateId: id as string,
      fromStage: oldStage,
      toStage: stage,
      changedAt: new Date(),
      note,
    };
    await db.stageChanges.add(stageChange);

    const updated = await db.candidates.get(id as string);
    return HttpResponse.json(updated);
  }),

  // GET /api/candidates/:id/timeline - Get candidate timeline
  http.get(`${API_BASE}/candidates/:id/timeline`, async ({ params }) => {
    const { id } = params;
    const stageChanges = await db.stageChanges
      .where('candidateId')
      .equals(id as string)
      .toArray();

    return HttpResponse.json(stageChanges.sort((a, b) => 
      a.changedAt.getTime() - b.changedAt.getTime()
    ));
  }),

  // GET /api/candidates/:id/notes - Get candidate notes
  http.get(`${API_BASE}/candidates/:id/notes`, async ({ params }) => {
    const { id } = params;
    const notes = await db.notes
      .where('candidateId')
      .equals(id as string)
      .reverse()
      .sortBy('createdAt');

    return HttpResponse.json(notes);
  }),

  // POST /api/candidates/:id/notes - Add note
  http.post(`${API_BASE}/candidates/:id/notes`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { content: string; mentions: string[] };

    const note: Note = {
      id: crypto.randomUUID(),
      candidateId: id as string,
      content: body.content,
      mentions: body.mentions || [],
      createdAt: new Date(),
      createdBy: 'Current User',
    };

    await db.notes.add(note);
    return HttpResponse.json(note, { status: 201 });
  }),

  // DELETE /api/candidates/:id - Delete candidate
  http.delete(`${API_BASE}/candidates/:id`, async ({ params }) => {
    const { id } = params;
    await db.candidates.delete(id as string);
    return HttpResponse.json({ success: true });
  }),
];
