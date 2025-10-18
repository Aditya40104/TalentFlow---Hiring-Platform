import React from 'react';
import { Input, Select } from '@/components';
import type { JobFilters as IJobFilters } from '@/types';

interface JobFiltersProps {
  filters: IJobFilters;
  onFilterChange: (filters: IJobFilters) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange }) => {
  const handleChange = (field: keyof IJobFilters, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  return (
    <div className="filters-bar">
      <Input
        placeholder="Search jobs..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
      />

      <Select
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
      />
    </div>
  );
};
