import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { api } from '@/lib/api';
import type { Assessment } from '@/types';
import './AssessmentsPage.css';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await api.get<Assessment[]>('/assessments');
      setAssessments(data);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;

    try {
      await api.delete(`/assessments/${id}`);
      loadAssessments();
    } catch (error) {
      console.error('Failed to delete assessment:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading assessments...</div>;
  }

  return (
    <div className="assessments-page">
      <div className="page-header">
        <div>
          <h1>Assessments</h1>
          <p className="page-description">
            Create and manage job assessments
          </p>
        </div>
        <Button onClick={() => navigate('/assessments/new/edit')}>
          + Create Assessment
        </Button>
      </div>

      {assessments.length === 0 ? (
        <div className="empty-state">
          <p>No assessments yet. Create your first assessment!</p>
        </div>
      ) : (
        <div className="assessments-grid">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-card-content">
                <h3>{assessment.title}</h3>
                {assessment.description && (
                  <p className="assessment-description">{assessment.description}</p>
                )}
                <div className="assessment-meta">
                  <span>{assessment.sections.length} sections</span>
                  <span>•</span>
                  <span>
                    {assessment.sections.reduce(
                      (sum, s) => sum + s.questions.length,
                      0
                    )}{' '}
                    questions
                  </span>
                </div>
              </div>
              <div className="assessment-actions">
                <Link to={`/assessments/${assessment.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(assessment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
