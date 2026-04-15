import React from 'react';
import FilterBar from '../../../components/shared/FilterBar';

const AdminUserFilters = ({ values, onChange, onReset }) => {
  const filters = [
    {
      key: 'search',
      label: 'Search Admin',
      type: 'search',
      placeholder: 'Name or Email...',
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'All Roles', value: '' },
        { label: 'Main Admin', value: 'main_admin' },
        { label: 'Sub Admin', value: 'sub_admin' },
      ],
    },
  ];

  const handleChange = (key, value) => {
    onChange(key, value);
  };

  const isFilterActive = Object.values(values).some(v => v !== '' && v !== null);

  return (
    <FilterBar
      filters={filters}
      values={values}
      onChange={handleChange}
      onReset={isFilterActive ? onReset : null}
    />
  );
};

export default AdminUserFilters;
