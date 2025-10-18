import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, TextArea } from '@/components';
import { api } from '@/lib/api';
import type { Candidate, StageChange, Note } from '@/types';
import './CandidateDetail.css';

export const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<StageChange[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [candidateData, timelineData, notesData] = await Promise.all([
        api.get<Candidate>(`/candidates/${id}`),
        api.get<StageChange[]>(`/candidates/${id}/timeline`),
        api.get<Note[]>(`/candidates/${id}/notes`),
      ]);

      setCandidate(candidateData);
      setTimeline(timelineData);
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to load candidate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    // Extract @mentions
    const mentions = noteContent.match(/@c-\d+/g) || [];

    try {
      await api.post(`/candidates/${id}/notes`, {
        content: noteContent,
        mentions: mentions.map((m) => m.substring(1)), // Remove @
      });

      setNoteContent('');
      loadData();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading candidate...</div>;
  }

  if (!candidate) {
    return <div className="error">Candidate not found</div>;
  }

  return (
    <div className="candidate-detail-page">
      <div className="candidate-header">
        <div>
          <Link to="/candidates" className="back-link">
            ← Back to Candidates
          </Link>
          <h1>{candidate.name}</h1>
          <div className="candidate-contact">
            <span>{candidate.email}</span>
            {candidate.phone && <span> • {candidate.phone}</span>}
          </div>
        </div>
        <span className={`stage-badge stage-${candidate.stage}`}>
          {candidate.stage}
        </span>
      </div>

      <div className="candidate-detail-grid">
        <div className="timeline-section">
          <h2>Timeline</h2>
          <div className="timeline">
            {timeline.map((change) => (
              <div key={change.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-stage">
                      {change.fromStage ? `${change.fromStage} → ` : ''}
                      <strong>{change.toStage}</strong>
                    </span>
                    <span className="timeline-date">
                      {format(new Date(change.changedAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {change.note && <p className="timeline-note">{change.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notes-section">
          <h2>Notes</h2>
          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <strong>{note.createdBy}</strong>
                  <span className="note-date">
                    {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="note-content">{note.content}</p>
                {note.mentions.length > 0 && (
                  <div className="note-mentions">
                    Mentions: {note.mentions.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="add-note">
            <TextArea
              placeholder="Add a note... Use @c-{id} to mention candidates"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
