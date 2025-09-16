import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './common/Header';
import Home from './client/Home';
import Footer from './common/Footer';
import Blog from './client/Blog';
import BlogPost from './client/BlogPost';
import Publication from './client/Publication';
import PublicationDetail from './client/PublicationDetail';
import PerfectCarbonCalculator from './client/CarbonCalculator';
import Register from './client/Register';
import Login from './client/Login';
import Dashboard from './admin/Dashboard';
import DashboardHome from './admin/DashboardHome';
import HabitTracker from './admin/HabitTracker';
import Leaderboard from './admin/Leaderboard';
import DashboardEducation from './admin/DashboardEducation';
import DashboardImpact from './admin/DashboardImpact';
import Profile from './common/Profile';
import Settings from './common/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import ThemeWrapper from './common/ThemeWrapper';
import GreenEvents from './client/GreenEvents';
import CommunityForum from './client/CommunityForum';
import ForumPostDetail from './client/ForumPostDetail'; // Import ForumPostDetail
import DashboardForum from './admin/DashboardForum';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardCampaigns from './admin/DashboardCampaigns';
import DashboardChallenges from './admin/DashboardChallenges';

function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/publication" element={<Publication />} />
            <Route path="/publication/:slug" element={<PublicationDetail />} />
            <Route path="/carbon-calculator" element={<PerfectCarbonCalculator />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<GreenEvents />} />
            <Route path="/forum" element={<CommunityForum />} />
            <Route path="/dashboard" element={<Dashboard name="User" />}>
              <Route index element={<DashboardHome />} />
              <Route path="habit-tracker" element={<HabitTracker />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="education" element={<DashboardEducation />} />
              <Route path="impact" element={<DashboardImpact />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="events" element={<GreenEvents />} />
              <Route path="carbon-calculator" element={<PerfectCarbonCalculator />} />
              <Route path="forum" element={<DashboardForum />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;