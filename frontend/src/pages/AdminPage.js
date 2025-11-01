import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Users, FileText, Save, Download, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const [translations, setTranslations] = useState([]);
  const [users, setUsers] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [opportunites, setOpportunites] = useState([]);
  const [qualityRecords, setQualityRecords] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [translationDialogOpen, setTranslationDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('comptes');
  
  const [userFormData, setUserFormData] = useState({
    email: '',
    name: '',
    role: 'DevCo_IDF',
    division: 'ALS FRESH FOOD',
    region: 'IDF'
  });

  const [translationFormData, setTranslationFormData] = useState({
    key: '',
    value: '',
    lang: 'fr-FR'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [usersRes, translationsRes] = await Promise.all([
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/translations`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setTranslations(translationsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/admin/users`, userFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Utilisateur créé avec succès !');
      setUserDialogOpen(false);
      fetchData();
      setUserFormData({
        email: '',
        name: '',
        role: 'DevCo_IDF',
        division: 'ALS FRESH FOOD',
        region: 'IDF'
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('session_token');
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Utilisateur supprimé avec succès !');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    }
  };

  const handleInitTranslations = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/admin/translations/init`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      console.error('Error initializing translations:', error);
      toast.error('Erreur lors de l\'initialisation');
    }
  };

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${API}/admin/export-data`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_als_groupe_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export Excel téléchargé avec succès !');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleCreateTranslation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/admin/translations`, translationFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Clé de traduction créée avec succès !');
      setTranslationDialogOpen(false);
      fetchData();
      setTranslationFormData({
        key: '',
        value: '',
        lang: 'fr-FR'
      });
    } catch (error) {
      console.error('Error creating translation:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleUpdateTranslation = async (id, newValue) => {
    try {
      const token = localStorage.getItem('session_token');
      await axios.put(`${API}/admin/translations/${id}`, 
        { value: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Texte mis à jour !');
      fetchData();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast.error('Erreur lors de la mise à jour');
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
      <div className="p-6 space-y-6" data-testid="admin-page">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              Administration
            </h1>
            <p className="text-gray-600 mt-1">Gestion des utilisateurs, textes et paramètres</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleExportData}
            data-testid="export-data-button"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter toutes les données (Excel)
          </Button>
        </div>

        <Tabs defaultValue="translations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="translations" data-testid="tab-translations">
              <FileText className="h-4 w-4 mr-2" />
              Textes & Libellés
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Translations Tab */}
          <TabsContent value="translations" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Gérer tous les textes affichés dans l'application
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleInitTranslations}
                  data-testid="init-translations-button"
                >
                  Initialiser les textes par défaut
                </Button>
                <Dialog open={translationDialogOpen} onOpenChange={setTranslationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-als-primary" data-testid="add-translation-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Clé
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvelle Clé de Traduction</DialogTitle>
                    <DialogDescription>
                      Ajouter un nouveau texte dynamique
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTranslation} className="space-y-4">
                    <div>
                      <Label htmlFor="key">Identifiant de la clé</Label>
                      <Input
                        id="key"
                        value={translationFormData.key}
                        onChange={(e) => setTranslationFormData({ ...translationFormData, key: e.target.value })}
                        placeholder="ex: dashboard.welcome"
                        required
                        data-testid="input-translation-key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Valeur (texte affiché)</Label>
                      <Input
                        id="value"
                        value={translationFormData.value}
                        onChange={(e) => setTranslationFormData({ ...translationFormData, value: e.target.value })}
                        placeholder="ex: Bienvenue"
                        required
                        data-testid="input-translation-value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lang">Langue</Label>
                      <Select
                        value={translationFormData.lang}
                        onValueChange={(value) => setTranslationFormData({ ...translationFormData, lang: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr-FR">Français</SelectItem>
                          <SelectItem value="en-GB">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full btn-als-primary" data-testid="submit-translation-button">
                      Créer la Clé
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {translations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune clé de traduction définie</p>
                  <p className="text-sm text-gray-400 mt-1">Créez des clés pour personnaliser les textes</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {translations.map((translation) => (
                  <Card key={translation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{translation.key}</p>
                          <p className="text-xs text-gray-500">{translation.lang}</p>
                        </div>
                        <Input
                          value={translation.value}
                          onChange={(e) => {
                            const newTranslations = translations.map(t =>
                              t.id === translation.id ? { ...t, value: e.target.value } : t
                            );
                            setTranslations(newTranslations);
                          }}
                          className="col-span-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTranslation(translation.id, translation.value)}
                          className="btn-als-primary"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Gérer les utilisateurs et leurs rôles
              </p>
              <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-als-primary" data-testid="add-user-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvel Utilisateur</DialogTitle>
                    <DialogDescription>
                      Créer un nouvel utilisateur
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="user-name">Nom complet</Label>
                      <Input
                        id="user-name"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                        required
                        data-testid="input-user-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required
                        data-testid="input-user-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-role">Rôle</Label>
                      <Select
                        value={userFormData.role}
                        onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}
                      >
                        <SelectTrigger data-testid="select-user-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin_Directeur">Directeur Commercial</SelectItem>
                          <SelectItem value="Assistante_Direction">Assistante Direction</SelectItem>
                          <SelectItem value="Directrice_Clientele">Directrice Clientèle</SelectItem>
                          <SelectItem value="Assistante_Clientele">Assistante Clientèle</SelectItem>
                          <SelectItem value="DevCo_IDF">Développement Commercial IDF</SelectItem>
                          <SelectItem value="DevCo_HDF">Développement Commercial HDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-division">Division</Label>
                      <Select
                        value={userFormData.division}
                        onValueChange={(value) => setUserFormData({ ...userFormData, division: value })}
                      >
                        <SelectTrigger data-testid="select-user-division">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALS FRESH FOOD">ALS FRESH FOOD</SelectItem>
                          <SelectItem value="ALS PHARMA">ALS PHARMA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-region">Région</Label>
                      <Select
                        value={userFormData.region}
                        onValueChange={(value) => setUserFormData({ ...userFormData, region: value })}
                      >
                        <SelectTrigger data-testid="select-user-region">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IDF">Île-de-France</SelectItem>
                          <SelectItem value="HDF">Hauts-de-France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full btn-als-primary" data-testid="submit-user-button">
                      Créer l'Utilisateur
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow" data-testid={`user-card-${user.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        data-testid={`delete-user-${user.id}`}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {user.role}
                        </span>
                        {user.division && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            {user.division}
                          </span>
                        )}
                        {user.region && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {user.region}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Commerciaux</CardTitle>
                <CardDescription>
                  Configuration des paramètres globaux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Paramètres avancés</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Configuration des statuts pipeline, secteurs d'activité, et objectifs commerciaux
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
