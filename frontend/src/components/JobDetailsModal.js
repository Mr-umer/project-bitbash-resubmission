import React from 'react';
import { Modal, Box, Typography, Divider, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const JobDetailsModal = ({ job, open, onClose }) => {
  if (!job) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {job.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {job.company}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ my: 2 }}>
          <Typography variant="body1"><strong>Location:</strong> {job.location}</Typography>
          <Typography variant="body1"><strong>Job Type:</strong> {job.job_type}</Typography>
          <Typography variant="body1"><strong>Posted On:</strong> {job.posting_date}</Typography>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Tags</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {job.tags && job.tags.split(',').map((tag, index) => (
            <Chip key={index} label={tag.trim()} />
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default JobDetailsModal;