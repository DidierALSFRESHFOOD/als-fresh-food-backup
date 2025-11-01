import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { TrendingUp, Users, FileText, AlertCircle, CheckCircle, DollarSign, Star, Package } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-truck-overlay min-h-screen" data-testid="dashboard">
        <div className="content-overlay p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bienvenue, {user?.name} 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'Admin_Directeur' && 'Direction Commerciale'}
              {user?.role === 'Assistante_Direction' && 'Assistante Direction Commerciale'}
              {user?.role === 'Directrice_Clientele' && 'Direction Clientèle'}
              {user?.role === 'Assistante_Clientele' && 'Assistante Clientèle'}
              {user?.role === 'DevCo_IDF' && 'Développement Commercial Île-de-France'}
              {user?.role === 'DevCo_HDF' && 'Développement Commercial Hauts-de-France'}
            </p>
          </div>

          {/* Commercial Stats */}
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Module Commercial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="stat-card glass-card" data-testid="stat-ca-signe">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    CA Signé
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.commercial?.ca_signe?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || '0 €'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Chiffre d'affaires total</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-comptes">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Clients / Prospects
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.commercial?.total_comptes || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Comptes actifs</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-opportunites">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Opportunités
                  </CardTitle>
                  <FileText className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.commercial?.total_opportunites || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">En cours et signées</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-signees">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Opportunités Signées
                  </CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.commercial?.opportunites_signees || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.commercial?.total_opportunites > 0
                      ? `${((stats?.commercial?.opportunites_signees / stats?.commercial?.total_opportunites) * 100).toFixed(1)}% de conversion`
                      : 'Aucune conversion'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quality Stats */}
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-blue-600" />
              Module Qualité & Service Clientèle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="stat-card glass-card" data-testid="stat-satisfaction">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Score Satisfaction
                  </CardTitle>
                  <Star className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.qualite?.score_satisfaction_moyen || 0}/9
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Note moyenne clients</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-quality-records">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Fiches Qualité
                  </CardTitle>
                  <Package className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.qualite?.total_quality_records || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enregistrements qualité</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-incidents">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Incidents Total
                  </CardTitle>
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.qualite?.total_incidents || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tous incidents enregistrés</p>
                </CardContent>
              </Card>

              <Card className="stat-card glass-card" data-testid="stat-incidents-ouverts">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Incidents Ouverts
                  </CardTitle>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {stats?.qualite?.incidents_ouverts || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">En attente de résolution</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          {(user?.role === 'Admin_Directeur' || user?.role === 'Assistante_Direction') && (
            <div className="animate-fade-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>
                    Accès directs aux fonctionnalités principales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/comptes" className="btn-als-primary text-white px-4 py-3 rounded-lg text-center font-medium">
                      Nouveau Client/Prospect
                    </a>
                    <a href="/opportunites" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:shadow-lg transition-shadow">
                      Nouvelle Opportunité
                    </a>
                    <a href="/qualite" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:shadow-lg transition-shadow">
                      Nouvelle Fiche Qualité
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;