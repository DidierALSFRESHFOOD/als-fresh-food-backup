import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/App';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertTriangle, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const IncidentsPage = () => {
  const { user } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [qualityRecords, setQualityRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({
    quality_record_id: '',
    type: 'Retard',
    gravite: 'Moyen',
    description: '',
    statut: 'Ouvert',
    action_corrective: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [incidentsRes, qualityRes] = await Promise.all([
        axios.get(`${API}/incidents`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/quality`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setIncidents(incidentsRes.data);
      setQualityRecords(qualityRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/incidents`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Incident créé avec succès !');
      setDialogOpen(false);
      fetchData();
      setFormData({
        quality_record_id: '',
        type: 'Retard',
        gravite: 'Moyen',
        description: '',
        statut: 'Ouvert',
        action_corrective: ''
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const getGraviteColor = (gravite) => {
    switch (gravite) {
      case 'Critique':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Moyen':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Faible':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatutColor = (statut) => {
    return statut === 'Ouvert' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-green-100 text-green-700';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="incidents-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incidents Qualité</h1>
            <p className="text-gray-600 mt-1">Suivi et résolution des incidents</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-als-primary" data-testid="add-incident-button">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvel Incident</DialogTitle>
                <DialogDescription>
                  Déclarer un nouvel incident qualité
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="quality_record_id">Fiche Qualité *</Label>
                  <Select
                    value={formData.quality_record_id}
                    onValueChange={(value) => setFormData({ ...formData, quality_record_id: value })}
                    required
                  >
                    <SelectTrigger data-testid="select-quality-record">
                      <SelectValue placeholder="Sélectionner une fiche qualité" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityRecords.map((record) => (
                        <SelectItem key={record.id} value={record.id}>
                          {record.periode} - {record.division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type d'incident</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger data-testid="select-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retard">Retard</SelectItem>
                        <SelectItem value="Anomalie">Anomalie</SelectItem>
                        <SelectItem value="Non-conformité">Non-conformité</SelectItem>
                        <SelectItem value="Réclamation">Réclamation</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gravite">Gravité</Label>
                    <Select
                      value={formData.gravite}
                      onValueChange={(value) => setFormData({ ...formData, gravite: value })}
                    >
                      <SelectTrigger data-testid="select-gravite">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Critique">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                    data-testid="input-description"
                  />
                </div>

                <div>
                  <Label htmlFor="action_corrective">Action corrective</Label>
                  <Textarea
                    id="action_corrective"
                    value={formData.action_corrective}
                    onChange={(e) => setFormData({ ...formData, action_corrective: e.target.value })}
                    rows={2}
                    data-testid="input-action"
                  />
                </div>

                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value) => setFormData({ ...formData, statut: value })}
                  >
                    <SelectTrigger data-testid="select-statut">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ouvert">Ouvert</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Résolu">Résolu</SelectItem>
                      <SelectItem value="Clos">Clos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full btn-als-primary" data-testid="submit-incident-button">
                  Créer l'Incident
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incidents.map((incident) => (
              <Card 
                key={incident.id} 
                className={`hover:shadow-lg transition-shadow border-l-4 ${getGraviteColor(incident.gravite).split(' ')[2]}`}
                data-testid={`incident-card-${incident.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${
                          incident.gravite === 'Critique' ? 'text-red-600' :
                          incident.gravite === 'Moyen' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        {incident.type}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getGraviteColor(incident.gravite)}`}>
                        {incident.gravite}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatutColor(incident.statut)}`}>
                        {incident.statut}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                {incident.action_corrective && (
                  <CardContent>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Action corrective :</p>
                      <p className="text-sm text-blue-700">{incident.action_corrective}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun incident enregistré</p>
            <p className="text-gray-400 text-sm mt-1">Déclarez un incident si nécessaire</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IncidentsPage;