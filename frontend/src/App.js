import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import '@/App.css';

// Pages
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import ComptesPage from '@/pages/ComptesPage';
import CompteDetailPage from '@/pages/CompteDetailPage';
import OpportunitesPage from '@/pages/OpportunitesPage';
import QualitePage from '@/pages/QualitePage';
import IncidentsPage from '@/pages/IncidentsPage';
import SatisfactionPage from '@/pages/SatisfactionPage';
import AdminPage from '@/pages/AdminPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingAuth, setProcessingAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check for session_id in URL fragment (Google OAuth callback)
    const hash = window.location.hash;
    if (hash && hash.includes('session_id=')) {
      setProcessingAuth(true);
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      
      try {
        const response = await axios.post(`${API}/auth/google-session`, {
          session_id: sessionId
        }, { withCredentials: true });
        
        setUser(response.data.user);
        localStorage.setItem('session_token', response.data.session_token);
        
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
        toast.success(`Bienvenue ${response.data.user.name} !`);
      } catch (error) {
        console.error('Error processing Google session:', error);
        toast.error("Erreur lors de l'authentification Google");
      } finally {
        setProcessingAuth(false);
        setLoading(false);
      }
      return;
    }

    // Check existing session
    const token = localStorage.getItem('session_token');
    if (token) {
      try {
        const response = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setUser(response.data);
      } catch (error) {
        console.error('Session expired:', error);
        localStorage.removeItem('session_token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('session_token', response.data.token);
      toast.success(`Bienvenue ${response.data.user.name} !`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    try {
      const response = await axios.post(`${API}/auth/register`, { email, password, name, role });
      setUser(response.data.user);
      localStorage.setItem('session_token', response.data.token);
      toast.success('Compte créé avec succès !');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création du compte');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('session_token');
      toast.success('Déconnexion réussie');
    }
  };

  if (loading || processingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-blue-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/comptes" element={user ? <ComptesPage /> : <Navigate to="/login" />} />
          <Route path="/opportunites" element={user ? <OpportunitesPage /> : <Navigate to="/login" />} />
          <Route path="/qualite" element={user ? <QualitePage /> : <Navigate to="/login" />} />
          <Route path="/incidents" element={user ? <IncidentsPage /> : <Navigate to="/login" />} />
          <Route path="/satisfaction" element={user ? <SatisfactionPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'Admin_Directeur' ? <AdminPage /> : <Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
