import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, TextArea, Select } from '@/components';
import { api } from '@/lib/api';
import type { Assessment, AssessmentSection, Question, QuestionType } from '@/types';
import { AssessmentPreview } from './AssessmentPreview';
import './AssessmentBuilder.css';

export const AssessmentBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Partial<Assessment>>({
    title: '',
    description: '',
    sections: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadAssessment();
    }
  }, [id]);

  const loadAssessment = async () => {
    try {
      const data = await api.get<Assessment>(`/assessments/${id}`);
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load assessment:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (id && id !== 'new') {
        await api.put(`/assessments/${id}`, assessment);
      } else {
        const created = await api.post<Assessment>('/assessments', assessment);
        navigate(`/assessments/${created.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to save assessment:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setAssessment({
      ...assessment,
      sections: [
        ...(assessment.sections || []),
        {
          id: crypto.randomUUID(),
          title: 'New Section',
          questions: [],
          order: assessment.sections?.length || 0,
        },
      ],
    });
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setAssessment({
      ...assessment,
      sections: assessment.sections?.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    setAssessment({
      ...assessment,
      sections: assessment.sections?.filter((s) => s.id !== sectionId),
    });
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'short-text',
      title: 'New Question',
      required: false,
    };

    setAssessment({
      ...assessment,
      sections: assessment.sections?.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    });
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    setAssessment({
      ...assessment,
      sections: assessment.sections?.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      ),
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setAssessment({
      ...assessment,
      sections: assessment.sections?.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      ),
    });
  };

  if (showPreview) {
    return (
      <AssessmentPreview
        assessment={assessment as Assessment}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="assessment-builder">
      <div className="builder-header">
        <div>
          <h1>{id === 'new' ? 'Create Assessment' : 'Edit Assessment'}</h1>
        </div>
        <div className="builder-actions">
          <Button variant="secondary" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Assessment
          </Button>
        </div>
      </div>

      <div className="builder-content">
        <div className="builder-meta">
          <Input
            label="Assessment Title"
            value={assessment.title}
            onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
            required
          />
          <TextArea
            label="Description"
            value={assessment.description}
            onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="sections-list">
          {assessment.sections?.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              allQuestions={assessment.sections?.flatMap((s) => s.questions) || []}
              onUpdate={(updates) => updateSection(section.id, updates)}
              onDelete={() => deleteSection(section.id)}
              onAddQuestion={() => addQuestion(section.id)}
              onUpdateQuestion={(qId, updates) => updateQuestion(section.id, qId, updates)}
              onDeleteQuestion={(qId) => deleteQuestion(section.id, qId)}
            />
          ))}

          <Button variant="secondary" onClick={addSection}>
            + Add Section
          </Button>
        </div>
      </div>
    </div>
  );
};

interface SectionEditorProps {
  section: AssessmentSection;
  allQuestions: Question[];
  onUpdate: (updates: Partial<AssessmentSection>) => void;
  onDelete: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  allQuestions,
  onUpdate,
  onDelete,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <Input
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Section title"
        />
        <Button variant="danger" size="sm" onClick={onDelete}>
          Delete Section
        </Button>
      </div>

      {section.description && (
        <TextArea
          value={section.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Section description"
          rows={2}
        />
      )}

      <div className="questions-list">
        {section.questions.map((question) => (
          <QuestionEditor
            key={question.id}
            question={question}
            allQuestions={allQuestions}
            onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
            onDelete={() => onDeleteQuestion(question.id)}
          />
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={onAddQuestion}>
        + Add Question
      </Button>
    </div>
  );
};

interface QuestionEditorProps {
  question: Question;
  allQuestions: Question[];
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  allQuestions,
  onUpdate,
  onDelete,
}) => {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'single-choice', label: 'Single Choice' },
    { value: 'multi-choice', label: 'Multiple Choice' },
    { value: 'short-text', label: 'Short Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'numeric', label: 'Numeric' },
    { value: 'file-upload', label: 'File Upload' },
  ];

  const needsOptions = question.type === 'single-choice' || question.type === 'multi-choice';

  return (
    <div className="question-card">
      <div className="question-header">
        <Select
          options={questionTypes}
          value={question.type}
          onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
          Required
        </label>
        <Button variant="danger" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>

      <Input
        value={question.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Question title"
      />

      <TextArea
        value={question.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Description (optional)"
        rows={2}
      />

      {needsOptions && (
        <OptionsEditor
          options={question.options || []}
          onChange={(options) => onUpdate({ options })}
        />
      )}

      <ConditionalLogicEditor
        question={question}
        allQuestions={allQuestions.filter((q) => q.id !== question.id)}
        onUpdate={onUpdate}
      />
    </div>
  );
};

interface OptionsEditorProps {
  options: Question['options'];
  onChange: (options: Question['options']) => void;
}

const OptionsEditor: React.FC<OptionsEditorProps> = ({ options = [], onChange }) => {
  const addOption = () => {
    onChange([
      ...options,
      { id: crypto.randomUUID(), label: 'New Option', value: `option-${options.length + 1}` },
    ]);
  };

  const updateOption = (index: number, label: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label };
    onChange(newOptions);
  };

  const deleteOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="options-editor">
      <label className="field-label">Options:</label>
      {options.map((option, index) => (
        <div key={option.id} className="option-row">
          <Input
            value={option.label}
            onChange={(e) => updateOption(index, e.target.value)}
            placeholder="Option label"
          />
          <Button variant="danger" size="sm" onClick={() => deleteOption(index)}>
            ×
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={addOption}>
        + Add Option
      </Button>
    </div>
  );
};

interface ConditionalLogicEditorProps {
  question: Question;
  allQuestions: Question[];
  onUpdate: (updates: Partial<Question>) => void;
}

const ConditionalLogicEditor: React.FC<ConditionalLogicEditorProps> = ({
  question,
  allQuestions,
  onUpdate,
}) => {
  const [enabled, setEnabled] = useState(!!question.conditionalLogic);

  const toggleConditional = () => {
    if (enabled) {
      onUpdate({ conditionalLogic: undefined });
    } else {
      onUpdate({
        conditionalLogic: {
          questionId: allQuestions[0]?.id || '',
          operator: 'equals',
          value: '',
        },
      });
    }
    setEnabled(!enabled);
  };

  if (allQuestions.length === 0) {
    return null;
  }

  return (
    <div className="conditional-logic">
      <label className="checkbox-label">
        <input type="checkbox" checked={enabled} onChange={toggleConditional} />
        Show only if condition is met
      </label>

      {enabled && question.conditionalLogic && (
        <div className="conditional-controls">
          <Select
            options={allQuestions.map((q) => ({ value: q.id, label: q.title }))}
            value={question.conditionalLogic.questionId}
            onChange={(e) =>
              onUpdate({
                conditionalLogic: { ...question.conditionalLogic!, questionId: e.target.value },
              })
            }
          />
          <Select
            options={[
              { value: 'equals', label: 'Equals' },
              { value: 'not-equals', label: 'Not Equals' },
              { value: 'contains', label: 'Contains' },
            ]}
            value={question.conditionalLogic.operator}
            onChange={(e) =>
              onUpdate({
                conditionalLogic: {
                  ...question.conditionalLogic!,
                  operator: e.target.value as any,
                },
              })
            }
          />
          <Input
            value={String(question.conditionalLogic.value)}
            onChange={(e) =>
              onUpdate({
                conditionalLogic: { ...question.conditionalLogic!, value: e.target.value },
              })
            }
            placeholder="Value"
          />
        </div>
      )}
    </div>
  );
};
