import React from 'react';
import FilterBar from '../../../components/shared/FilterBar';

const StudentFilters = ({ values, onChange, onReset }) => {
  const filters = [
    {
      key: 'search',
      label: 'Search Students',
      type: 'search',
      placeholder: 'Name or Email...',
    },
    {
      key: 'grade',
      label: 'Grade',
      type: 'select',
      options: [
        { label: 'All Grades', value: '' },
        { label: 'Grade 3', value: '3' },
        { label: 'Grade 4', value: '4' },
        { label: 'Grade 5', value: '5' },
      ],
    },
    {
      key: 'section',
      label: 'Section',
      type: 'select',
      options: [
        { label: 'All Sections', value: '' },
        { label: 'Section A', value: 'A' },
        { label: 'Section B', value: 'B' },
        { label: 'Section C', value: 'C' },
      ],
    },
  ];

  return (
    <FilterBar
      filters={filters}
      values={values}
      onChange={onChange}
      onReset={onReset}
    />
  );
};

export default StudentFilters;
