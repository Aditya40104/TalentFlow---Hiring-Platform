import { http, HttpResponse } from 'msw';
import { db } from '@/db';
import type { Assessment, AssessmentResponse } from '@/types';

const API_BASE = '/api';

export const assessmentHandlers = [
  // GET /api/assessments - List assessments
  http.get(`${API_BASE}/assessments`, async ({ request }) => {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');

    let query = db.assessments.toCollection();

    if (jobId) {
      query = db.assessments.where('jobId').equals(jobId);
    }

    const assessments = await query.toArray();
    return HttpResponse.json(assessments);
  }),

  // GET /api/assessments/:id - Get single assessment
  http.get(`${API_BASE}/assessments/:id`, async ({ params }) => {
    const { id } = params;
    const assessment = await db.assessments.get(id as string);

    if (!assessment) {
      return HttpResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return HttpResponse.json(assessment);
  }),

  // POST /api/assessments - Create assessment
  http.post(`${API_BASE}/assessments`, async ({ request }) => {
    const body = (await request.json()) as Partial<Assessment>;

    const newAssessment: Assessment = {
      id: crypto.randomUUID(),
      jobId: body.jobId!,
      title: body.title!,
      description: body.description || '',
      sections: body.sections || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.assessments.add(newAssessment);
    return HttpResponse.json(newAssessment, { status: 201 });
  }),

  // PUT /api/assessments/:id - Update assessment
  http.put(`${API_BASE}/assessments/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Assessment>;

    const assessment = await db.assessments.get(id as string);
    if (!assessment) {
      return HttpResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const updated: Assessment = {
      ...assessment,
      ...body,
      id: assessment.id,
      updatedAt: new Date(),
    };

    await db.assessments.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/assessments/:id - Delete assessment
  http.delete(`${API_BASE}/assessments/:id`, async ({ params }) => {
    const { id } = params;
    await db.assessments.delete(id as string);
    return HttpResponse.json({ success: true });
  }),

  // GET /api/assessments/:id/responses - Get responses for assessment
  http.get(`${API_BASE}/assessments/:id/responses`, async ({ params }) => {
    const { id } = params;
    const responses = await db.assessmentResponses
      .where('assessmentId')
      .equals(id as string)
      .toArray();

    return HttpResponse.json(responses);
  }),

  // POST /api/assessments/:id/responses - Submit assessment response
  http.post(`${API_BASE}/assessments/:id/responses`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { candidateId: string; answers: Record<string, any> };

    // Check if response already exists
    const existing = await db.assessmentResponses
      .where(['assessmentId', 'candidateId'])
      .equals([id as string, body.candidateId])
      .first();

    if (existing) {
      // Update existing response
      const updated: AssessmentResponse = {
        ...existing,
        answers: body.answers,
        updatedAt: new Date(),
      };
      await db.assessmentResponses.put(updated);
      return HttpResponse.json(updated);
    }

    // Create new response
    const newResponse: AssessmentResponse = {
      id: crypto.randomUUID(),
      assessmentId: id as string,
      candidateId: body.candidateId,
      answers: body.answers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.assessmentResponses.add(newResponse);
    return HttpResponse.json(newResponse, { status: 201 });
  }),

  // POST /api/assessments/:assessmentId/responses/:responseId/submit - Submit final response
  http.post(`${API_BASE}/assessments/:assessmentId/responses/:responseId/submit`, async ({ params }) => {
    const { responseId } = params;

    const response = await db.assessmentResponses.get(responseId as string);
    if (!response) {
      return HttpResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    await db.assessmentResponses.update(responseId as string, {
      submittedAt: new Date(),
    });

    const updated = await db.assessmentResponses.get(responseId as string);
    return HttpResponse.json(updated);
  }),

  // GET /api/candidates/:candidateId/responses - Get candidate's responses
  http.get(`${API_BASE}/candidates/:candidateId/responses`, async ({ params }) => {
    const { candidateId } = params;
    const responses = await db.assessmentResponses
      .where('candidateId')
      .equals(candidateId as string)
      .toArray();

    return HttpResponse.json(responses);
  }),
];
