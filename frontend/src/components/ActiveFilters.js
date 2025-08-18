// frontend/src/components/ActiveFilters.js
import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const ActiveFilters = ({ filters, onFilterChange }) => {
  const activeFilters = Object.entries(filters).filter(([key, value]) => value && (key !== 'sort') && !(key === 'job_type' && value === 'All'));

  if (activeFilters.length === 0) {
    return null; // Don't render anything if no filters are active
  }

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters };
    if (filterKey === 'job_type') {
      newFilters[filterKey] = 'All';
    } else {
      newFilters[filterKey] = '';
    }
    onFilterChange(newFilters);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Filtering by:</Typography>
      {activeFilters.map(([key, value]) => (
        <Chip
          key={key}
          label={`${key.replace('_', ' ')}: ${value}`}
          onDelete={() => handleRemoveFilter(key)}
          color="primary"
        />
      ))}
    </Box>
  );
};

export default ActiveFilters;