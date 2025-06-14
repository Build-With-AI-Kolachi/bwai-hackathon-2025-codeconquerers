import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import RecordPage from './pages/RecordPage';
import DirectoryPage from './pages/DirectoryPage';
import SharePage from './pages/SharePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/share" element={<SharePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;