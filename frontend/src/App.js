import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobCard from './components/JobRow';
import AddJobForm from './components/AddJobForm';
import FilterBar from './components/FilterBar';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import ActiveFilters from './components/ActiveFilters';
import JobDetailsModal from './components/JobDetailsModal';
import { dummyJobs } from './dummyData'; // Import the dummy data

import { Container, Grid, Typography, CircularProgress, Box, Alert, Modal, Paper, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://127.0.0.1:5000/api';
const initialFilters = { search: '', location: '', job_type: 'All', tags: '', sort: 'date_desc' };
const JOBS_PER_PAGE = 12;

function App() {
  const [jobs, setJobs] = useState([]);
  const [visibleJobsCount, setVisibleJobsCount] = useState(JOBS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.tags) params.tags = filters.tags;
      if (filters.job_type && filters.job_type !== 'All') params.job_type = filters.job_type;
      if (filters.sort) params.sort = filters.sort;

      const response = await axios.get(`${API_URL}/jobs`, { params });
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to the server. Displaying sample data.');
      setJobs(dummyJobs); // <-- THIS IS THE ONLY LOGICAL CHANGE
      console.error(err);
    } finally {
      setLoading(false);
      setVisibleJobsCount(JOBS_PER_PAGE);
    }
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => { fetchJobs(); }, 500);
    return () => { clearTimeout(handler); };
  }, [filters, fetchJobs]);

  const handleShowMore = () => setVisibleJobsCount(prev => prev + JOBS_PER_PAGE);
  const handleShowLess = () => {
    setVisibleJobsCount(JOBS_PER_PAGE);
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleResetFilters = () => setFilters(initialFilters);
  const handleOpenAddModal = () => { setJobToEdit(null); setOpenAddEditModal(true); };
  const handleOpenEditModal = (job) => { setJobToEdit(job); setOpenAddEditModal(true); };
  const handleCloseAddEditModal = () => { setOpenAddEditModal(false); setJobToEdit(null); };

  const handleOpenDetailsModal = (job) => setSelectedJobDetails(job);
  const handleCloseDetailsModal = () => setSelectedJobDetails(null);

  const handleSaveJob = async (jobData, jobId) => {
    if (error) { toast.error("Cannot save in offline mode."); return; }
    setIsSubmitting(true);
    const isEditing = !!jobId;
    const action = isEditing ? axios.put(`${API_URL}/jobs/${jobId}`, jobData) : axios.post(`${API_URL}/jobs`, jobData);
    try {
      await action;
      toast.success(isEditing ? 'Job updated' : 'Job added');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to save job.');
    } finally {
      setIsSubmitting(false);
      handleCloseAddEditModal();
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (error) { toast.error("Cannot delete in offline mode."); return; }
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${API_URL}/jobs/${jobId}`);
        toast.success('Job deleted');
        fetchJobs();
      } catch (err) {
        toast.error('Failed to delete job.');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f9fafb' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Navbar onAddNewJob={handleOpenAddModal} />

      <main style={{ flexGrow: 1 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Generate Your Career Alpha
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.8)" sx={{ textAlign: 'center' }}>
              Discover elite roles where your analytical skills will drive market-beating performance.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }} id="results-section">
          <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: '12px' }}>
            <FilterBar filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
          </Paper>
          
          <ActiveFilters filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />

          <Box sx={{ mt: 2 }}>
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
            ) : (
              <Box>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Showing {Math.min(visibleJobsCount, jobs.length)} of {jobs.length} open positions
                </Typography>
                
                <Grid container spacing={3}>
                  {jobs.length > 0 ? jobs.slice(0, visibleJobsCount).map((job) => (
                    <Grid item key={job.id} xs={12} sm={6} md={4}>
                      <JobCard
                        job={job}
                        onDelete={handleDeleteJob}
                        onEdit={handleOpenEditModal}
                        onViewDetails={handleOpenDetailsModal}
                      />
                    </Grid>
                  )) : (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 5, textAlign: 'center', border: '2px dashed #e0e0e0', boxShadow: 'none' }}>
                        <Typography variant="h6" color="text.secondary">No jobs found.</Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 4, mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  {visibleJobsCount < jobs.length && (
                    <Button variant="contained" size="large" onClick={handleShowMore}>Show More</Button>
                  )}
                  {visibleJobsCount > JOBS_PER_PAGE && (
                    <Button variant="outlined" size="large" onClick={handleShowLess}>Show Less</Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </main>

      <Modal open={openAddEditModal} onClose={handleCloseAddEditModal}>
        <AddJobForm onSave={handleSaveJob} handleClose={handleCloseAddEditModal} jobToEdit={jobToEdit} isSubmitting={isSubmitting} />
      </Modal>

      <JobDetailsModal job={selectedJobDetails} open={!!selectedJobDetails} onClose={handleCloseDetailsModal} />

      <Footer />
    </Box>
  );
}

export default App;