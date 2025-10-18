import React, { useState } from 'react';
import { Button, Input, TextArea } from '@/components';
import type { Assessment, Question } from '@/types';
import './AssessmentPreview.css';

interface AssessmentPreviewProps {
  assessment: Assessment;
  onClose: () => void;
}

export const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({
  assessment,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditionalLogic) return true;

    const { questionId, operator, value } = question.conditionalLogic;
    const answer = answers[questionId];

    switch (operator) {
      case 'equals':
        return answer === value;
      case 'not-equals':
        return answer !== value;
      case 'contains':
        return Array.isArray(answer)
          ? answer.includes(value)
          : String(answer).includes(String(value));
      default:
        return true;
    }
  };

  const validateAnswer = (question: Question, answer: any): string | null => {
    if (question.required && !answer) {
      return 'This field is required';
    }

    if (!answer) return null;

    if (question.validation) {
      const { minLength, maxLength, min, max } = question.validation;

      if (minLength && String(answer).length < minLength) {
        return `Minimum length is ${minLength}`;
      }

      if (maxLength && String(answer).length > maxLength) {
        return `Maximum length is ${maxLength}`;
      }

      if (min !== undefined && Number(answer) < min) {
        return `Minimum value is ${min}`;
      }

      if (max !== undefined && Number(answer) > max) {
        return `Maximum value is ${max}`;
      }
    }

    return null;
  };

  return (
    <div className="assessment-preview">
      <div className="preview-header">
        <h1>{assessment.title}</h1>
        <Button onClick={onClose}>Close Preview</Button>
      </div>

      {assessment.description && (
        <p className="preview-description">{assessment.description}</p>
      )}

      <div className="preview-content">
        {assessment.sections.map((section) => (
          <div key={section.id} className="preview-section">
            <h2>{section.title}</h2>
            {section.description && <p className="section-description">{section.description}</p>}

            <div className="preview-questions">
              {section.questions.map((question) => {
                if (!shouldShowQuestion(question)) return null;

                const error = validateAnswer(question, answers[question.id]);

                return (
                  <div key={question.id} className="preview-question">
                    <label className="question-label">
                      {question.title}
                      {question.required && <span className="required">*</span>}
                    </label>

                    {question.description && (
                      <p className="question-description">{question.description}</p>
                    )}

                    <QuestionInput
                      question={question}
                      value={answers[question.id]}
                      onChange={(value) => handleAnswerChange(question.id, value)}
                    />

                    {error && <p className="question-error">{error}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'single-choice':
      return (
        <div className="radio-group">
          {question.options?.map((option) => (
            <label key={option.id} className="radio-label">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      );

    case 'multi-choice':
      return (
        <div className="checkbox-group">
          {question.options?.map((option) => (
            <label key={option.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={(value || []).includes(option.value)}
                onChange={(e) => {
                  const current = value || [];
                  if (e.target.checked) {
                    onChange([...current, option.value]);
                  } else {
                    onChange(current.filter((v: string) => v !== option.value));
                  }
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      );

    case 'short-text':
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
        />
      );

    case 'long-text':
      return (
        <TextArea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
          rows={5}
        />
      );

    case 'numeric':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a number"
        />
      );

    case 'file-upload':
      return (
        <div className="file-upload">
          <input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
          />
          {value && <p className="file-name">Selected: {value}</p>}
        </div>
      );

    default:
      return null;
  }
};
