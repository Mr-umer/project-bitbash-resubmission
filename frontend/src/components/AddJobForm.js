import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const AddJobForm = ({ onSave, handleClose, jobToEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!jobToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        location: jobToEdit.location || '',
        job_type: jobToEdit.job_type || '',
        tags: jobToEdit.tags || '',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: '',
        tags: '',
      });
    }
  }, [jobToEdit, isEditing]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.company.trim()) tempErrors.company = "Company is required.";
    if (!formData.location.trim()) tempErrors.location = "Location is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData, jobToEdit ? jobToEdit.id : null);
    }
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {isEditing ? 'Edit Job' : 'Add New Job'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          margin="normal"
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          required
          margin="normal"
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          error={!!errors.company}
          helperText={errors.company}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          required
          margin="normal"
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Job Type (e.g., Full-time)"
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tags (comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Box sx={{ position: 'relative', ml: 1 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Add Job'}
            </Button>
            {isSubmitting && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.main',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default AddJobForm;