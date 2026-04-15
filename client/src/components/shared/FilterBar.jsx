import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';

const FilterBar = ({ filters, values, onChange, onReset }) => {
  const hasActiveFilters = Object.values(values).some(v => v !== '' && v !== null);

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      {filters.map((f) => {
        if (f.type === 'select') {
          return (
            <div key={f.key} className="w-full sm:w-48">
              <Select
                label={f.label}
                options={f.options}
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === 'search') {
          return (
            <div key={f.key} className="w-full sm:w-64">
              <Input
                label={f.label}
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
              />
            </div>
          );
        }
        return null;
      })}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-[38px] text-gray-600 hover:bg-gray-100 hover:text-gray-950"
          onClick={onReset}
          icon={X}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
