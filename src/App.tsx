import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { LandingPage } from './pages/Landing/LandingPage';
import { JobsPage } from './pages/Jobs/JobsPage';
import { CandidatesPage } from './pages/Candidates/CandidatesPage';
import { CandidateDetailPage } from './pages/Candidates/CandidateDetail';
import { AssessmentsPage } from './pages/Assessments/AssessmentsPage';
import { AssessmentBuilderPage } from './pages/Assessments/AssessmentBuilder';
import { initializeDatabase } from './db';
import './App.css';

function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initializeDatabase().then(() => {
      setDbInitialized(true);
    });
  }, []);

  if (!dbInitialized) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Initializing TalentFlow...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobsPage /></Layout>} />
        <Route path="/candidates" element={<Layout><CandidatesPage /></Layout>} />
        <Route path="/candidates/:id" element={<Layout><CandidateDetailPage /></Layout>} />
        <Route path="/assessments" element={<Layout><AssessmentsPage /></Layout>} />
        <Route path="/assessments/:id/edit" element={<Layout><AssessmentBuilderPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
