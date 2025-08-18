import React from 'react';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';

const FilterBar = ({ filters, onFilterChange, onResetFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        {/* Note: Grid columns were adjusted slightly to fit the new dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth variant="outlined" placeholder="Job title or company" name="search" value={filters.search || ''} onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField fullWidth variant="outlined" placeholder="Location" name="location" value={filters.location || ''} onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField fullWidth variant="outlined" placeholder="Tags (e.g., Python)" name="tags" value={filters.tags || ''} onChange={handleInputChange} />
        </Grid>
        
        {/* --- THIS IS THE NEW DROPDOWN --- */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Job Type</InputLabel>
            <Select
              label="Job Type"
              name="job_type"
              value={filters.job_type || 'All'}
              onChange={handleInputChange}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* ------------------------------- */}

        <Grid item xs={12} sm={12} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sort By</InputLabel>
            <Select label="Sort By" name="sort" value={filters.sort || 'date_desc'} onChange={handleInputChange}>
              <MenuItem value="date_desc">Date (Newest)</MenuItem>
              <MenuItem value="date_asc">Date (Oldest)</MenuItem>
              <MenuItem value="company_asc">Company (A-Z)</MenuItem>
              <MenuItem value="company_desc">Company (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'right', mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={onResetFilters}
          sx={{ 
            bgcolor: '#2dd4bf', 
            '&:hover': { bgcolor: '#1caaa0' }
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterBar;