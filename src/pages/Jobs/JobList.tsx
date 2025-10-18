import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Job } from '@/types';
import { Button } from '@/components';
import { Link } from 'react-router-dom';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
  onReorder: (jobIds: string[]) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  loading,
  onEdit,
  onArchive,
  onDelete,
  onReorder,
}) => {
  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <p>No jobs found. Create your first job posting!</p>
      </div>
    );
  }

  const moveJob = (dragIndex: number, hoverIndex: number) => {
    const dragJob = jobs[dragIndex];
    const newJobs = [...jobs];
    newJobs.splice(dragIndex, 1);
    newJobs.splice(hoverIndex, 0, dragJob);
    onReorder(newJobs.map((j) => j.id));
  };

  return (
    <div className="job-list">
      {jobs.map((job, index) => (
        <JobCard
          key={job.id}
          job={job}
          index={index}
          moveJob={moveJob}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

interface JobCardProps {
  job: Job;
  index: number;
  moveJob: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, index, moveJob, onEdit, onArchive, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'JOB',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'JOB',
    hover: (item: { index: number }) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveJob(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`job-card ${job.status === 'archived' ? 'archived' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="job-card-header">
        <div className="job-card-drag-handle">⋮⋮</div>
        <div className="job-card-main">
          <div className="job-card-title-row">
            <Link to={`/jobs/${job.id}`} className="job-card-title">
              {job.title}
            </Link>
            <span className={`job-status-badge status-${job.status}`}>
              {job.status}
            </span>
          </div>
          <div className="job-card-meta">
            <span className="job-slug">/{job.slug}</span>
            {job.description && (
              <span className="job-description">{job.description.substring(0, 100)}</span>
            )}
          </div>
          {job.tags.length > 0 && (
            <div className="job-tags">
              {job.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="job-card-actions">
        <Button variant="ghost" size="sm" onClick={() => onEdit(job)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onArchive(job)}>
          {job.status === 'active' ? 'Archive' : 'Unarchive'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(job)} style={{ color: '#ef4444' }}>
          Delete
        </Button>
      </div>
    </div>
  );
};
