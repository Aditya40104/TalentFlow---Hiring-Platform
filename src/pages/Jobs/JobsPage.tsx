import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { JobList } from './JobList';
import { JobModal } from './JobModal';
import { JobFilters } from './JobFilters';
import { Button } from '@/components';
import { api } from '@/lib/api';
import type { Job, JobFilters as IJobFilters, PaginatedResponse } from '@/types';
import './JobsPage.css';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<IJobFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    loadJobs();
  }, [pagination.page, pagination.pageSize, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get<PaginatedResponse<Job>>('/jobs', {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
        tags: filters.tags?.join(','),
      });

      setJobs(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSave = async (jobData: Partial<Job>) => {
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, jobData);
      } else {
        await api.post('/jobs', jobData);
      }
      setIsModalOpen(false);
      loadJobs();
    } catch (error) {
      console.error('Failed to save job:', error);
      throw error;
    }
  };

  const handleArchive = async (job: Job) => {
    try {
      if (job.status === 'active') {
        await api.post(`/jobs/${job.id}/archive`, {});
      } else {
        await api.post(`/jobs/${job.id}/unarchive`, {});
      }
      loadJobs();
    } catch (error) {
      console.error('Failed to archive/unarchive job:', error);
    }
  };

  const handleDelete = async (job: Job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/jobs/${job.id}`);
      loadJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleReorder = async (jobIds: string[]) => {
    // Optimistic update
    const reordered = jobIds.map((id, index) => {
      const job = jobs.find((j) => j.id === id)!;
      return { ...job, order: index };
    });
    setJobs(reordered);

    try {
      await api.post('/jobs/reorder', { jobIds });
    } catch (error) {
      console.error('Failed to reorder jobs:', error);
      // Rollback on error
      loadJobs();
    }
  };

  const handleFilterChange = (newFilters: IJobFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p className="page-description">
            Manage job postings and recruitment pipeline
          </p>
        </div>
        <Button onClick={handleCreate}>+ Create Job</Button>
      </div>

      <JobFilters filters={filters} onFilterChange={handleFilterChange} />

      <DndProvider backend={HTML5Backend}>
        <JobList
          jobs={jobs}
          loading={loading}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </DndProvider>

      <div className="pagination">
        <div className="pagination-info">
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
          {pagination.total} jobs
        </div>
        <div className="pagination-controls">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="pagination-page">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <JobModal
          job={editingJob}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
