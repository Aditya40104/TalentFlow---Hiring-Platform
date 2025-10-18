import React, { useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Link } from 'react-router-dom';
import { Button, Input, Select } from '@/components';
import { api } from '@/lib/api';
import type { Candidate, CandidateFilters, PaginatedResponse } from '@/types';
import './CandidatesPage.css';

export const CandidatesPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CandidateFilters>({});

  const parentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      // Load all candidates for virtualization/kanban
      const response = await api.get<PaginatedResponse<Candidate>>('/candidates', {
        page: 1,
        pageSize: 10000,
        ...filters,
      });

      setCandidates(response.data);
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof CandidateFilters, value: any) => {
    setFilters({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleStageChange = async (candidateId: string, newStage: Candidate['stage']) => {
    try {
      await api.patch(`/candidates/${candidateId}/stage`, { stage: newStage });
      loadCandidates();
    } catch (error) {
      console.error('Failed to update candidate stage:', error);
    }
  };

  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="candidates-page">
      <div className="page-header">
        <div>
          <h1>Candidates</h1>
          <p className="page-description">
            {candidates.length} candidates in pipeline
          </p>
        </div>
        <div className="view-toggle">
          <Button
            variant={view === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'kanban' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            Kanban Board
          </Button>
        </div>
      </div>

      <div className="filters-bar">
        <Input
          placeholder="Search by name or email..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <Select
          options={[
            { value: '', label: 'All Stages' },
            { value: 'applied', label: 'Applied' },
            { value: 'screening', label: 'Screening' },
            { value: 'interview', label: 'Interview' },
            { value: 'offer', label: 'Offer' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'hired', label: 'Hired' },
          ]}
          value={filters.stage || ''}
          onChange={(e) => handleFilterChange('stage', e.target.value)}
        />
      </div>

      {view === 'list' ? (
        <div ref={parentRef} className="candidate-list-container">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const candidate = candidates[virtualRow.index];
              return (
                <div
                  key={candidate.id}
                  className="candidate-card"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="candidate-card-content">
                    <div className="candidate-info">
                      <Link to={`/candidates/${candidate.id}`} className="candidate-name">
                        {candidate.name}
                      </Link>
                      <div className="candidate-meta">
                        <span>{candidate.email}</span>
                        {candidate.phone && <span> • {candidate.phone}</span>}
                      </div>
                    </div>
                    <div className="candidate-stage">
                      <span className={`stage-badge stage-${candidate.stage}`}>
                        {candidate.stage}
                      </span>
                      <Select
                        options={[
                          { value: 'applied', label: 'Applied' },
                          { value: 'screening', label: 'Screening' },
                          { value: 'interview', label: 'Interview' },
                          { value: 'offer', label: 'Offer' },
                          { value: 'rejected', label: 'Rejected' },
                          { value: 'hired', label: 'Hired' },
                        ]}
                        value={candidate.stage}
                        onChange={(e) => handleStageChange(candidate.id, e.target.value as Candidate['stage'])}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <KanbanBoard candidates={candidates} onStageChange={handleStageChange} />
      )}
    </div>
  );
};

interface KanbanBoardProps {
  candidates: Candidate[];
  onStageChange: (candidateId: string, newStage: Candidate['stage']) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates, onStageChange }) => {
  const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'offer', 'rejected', 'hired'];

  const stageLabels: Record<Candidate['stage'], string> = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    hired: 'Hired',
  };

  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<Candidate['stage'], Candidate[]>);

  return (
    <div className="kanban-board">
      {stages.map((stage) => (
        <div key={stage} className="kanban-column">
          <div className="kanban-column-header">
            <h3>{stageLabels[stage]}</h3>
            <span className="kanban-count">{candidatesByStage[stage].length}</span>
          </div>
          <div className="kanban-cards">
            {candidatesByStage[stage].map((candidate) => (
              <div key={candidate.id} className="kanban-card">
                <Link to={`/candidates/${candidate.id}`} className="kanban-card-name">
                  {candidate.name}
                </Link>
                <div className="kanban-card-email">{candidate.email}</div>
                <Select
                  options={stages.map((s) => ({ value: s, label: stageLabels[s] }))}
                  value={candidate.stage}
                  onChange={(e) => onStageChange(candidate.id, e.target.value as Candidate['stage'])}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
