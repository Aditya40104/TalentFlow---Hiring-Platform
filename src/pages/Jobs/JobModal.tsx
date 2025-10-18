import React, { useState } from 'react';
import { Modal, Button, Input, TextArea } from '@/components';
import type { Job } from '@/types';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onSave: (jobData: Partial<Job>) => Promise<void>;
}

export const JobModal: React.FC<JobModalProps> = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    slug: job?.slug || '',
    description: job?.description || '',
    tags: job?.tags.join(', ') || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title if creating new job
    if (field === 'title' && !job) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
    } catch (error: any) {
      if (error.message?.includes('unique')) {
        setErrors({ slug: 'This slug is already in use' });
      } else {
        setErrors({ general: 'Failed to save job' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={job ? 'Edit Job' : 'Create New Job'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSaving}>
            {job ? 'Save Changes' : 'Create Job'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <Input
            label="Job Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
            required
            placeholder="e.g., Senior Frontend Developer"
          />

          <Input
            label="Slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            error={errors.slug}
            required
            placeholder="e.g., senior-frontend-developer"
            helperText="Used in URLs. Must be unique."
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Job description..."
            rows={4}
          />

          <Input
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="React, TypeScript, Remote (comma-separated)"
            helperText="Separate tags with commas"
          />

          {errors.general && <p className="error-text">{errors.general}</p>}
        </div>
      </form>
    </Modal>
  );
};
