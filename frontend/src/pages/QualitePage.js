import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Star, Package } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QualitePage = () => {
  const [qualityRecords, setQualityRecords] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    compte_id: '',
    division: 'ALS FRESH FOOD',
    region: 'IDF',
    periode: '',
    type_prestation: 'Livraison',
    taux_service: '',
    nb_incidents: 0,
    score_satisfaction: '',
    commentaires: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [qualityRes, comptesRes] = await Promise.all([
        axios.get(`${API}/quality`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/comptes`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setQualityRecords(qualityRes.data);
      setComptes(comptesRes.data);
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
      const payload = {
        ...formData,
        taux_service: formData.taux_service ? parseFloat(formData.taux_service) : null,
        score_satisfaction: formData.score_satisfaction ? parseFloat(formData.score_satisfaction) : null,
        nb_incidents: parseInt(formData.nb_incidents) || 0
      };
      await axios.post(`${API}/quality`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Fiche qualité créée avec succès !');
      setDialogOpen(false);
      fetchData();
      setFormData({
        compte_id: '',
        division: 'ALS FRESH FOOD',
        region: 'IDF',
        periode: '',
        type_prestation: 'Livraison',
        taux_service: '',
        nb_incidents: 0,
        score_satisfaction: '',
        commentaires: ''
      });
    } catch (error) {
      console.error('Error creating quality record:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const getCompteById = (id) => comptes.find(c => c.id === id);

  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="qualite-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Qualité de Service</h1>
            <p className="text-gray-600 mt-1">Suivi de la satisfaction client et taux de service</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-als-primary" data-testid="add-quality-button">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Fiche Qualité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle Fiche Qualité</DialogTitle>
                <DialogDescription>
                  Enregistrer une nouvelle fiche qualité client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="compte_id">Client *</Label>
                  <Select
                    value={formData.compte_id}
                    onValueChange={(value) => setFormData({ ...formData, compte_id: value })}
                    required
                  >
                    <SelectTrigger data-testid="select-compte">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {comptes.map((compte) => (
                        <SelectItem key={compte.id} value={compte.id}>
                          {compte.raison_sociale} ({compte.division})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="division">Division *</Label>
                    <Select
                      value={formData.division}
                      onValueChange={(value) => setFormData({ ...formData, division: value })}
                    >
                      <SelectTrigger data-testid="select-division">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALS FRESH FOOD">ALS FRESH FOOD</SelectItem>
                        <SelectItem value="ALS PHARMA">ALS PHARMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Région *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value })}
                    >
                      <SelectTrigger data-testid="select-region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDF">Île-de-France</SelectItem>
                        <SelectItem value="HDF">Hauts-de-France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="periode">Période *</Label>
                    <Input
                      id="periode"
                      value={formData.periode}
                      onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                      placeholder="Janvier 2025, Semaine 3..."
                      required
                      data-testid="input-periode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type_prestation">Type de prestation</Label>
                    <Select
                      value={formData.type_prestation}
                      onValueChange={(value) => setFormData({ ...formData, type_prestation: value })}
                    >
                      <SelectTrigger data-testid="select-prestation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Livraison">Livraison</SelectItem>
                        <SelectItem value="Tournée">Tournée</SelectItem>
                        <SelectItem value="Logistique">Logistique</SelectItem>
                        <SelectItem value="Transport pharma">Transport pharma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taux_service">Taux de service (%)</Label>
                    <Input
                      id="taux_service"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.taux_service}
                      onChange={(e) => setFormData({ ...formData, taux_service: e.target.value })}
                      data-testid="input-taux-service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="score_satisfaction">Score satisfaction (0-9)</Label>
                    <Input
                      id="score_satisfaction"
                      type="number"
                      step="0.1"
                      min="0"
                      max="9"
                      value={formData.score_satisfaction}
                      onChange={(e) => setFormData({ ...formData, score_satisfaction: e.target.value })}
                      data-testid="input-score"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nb_incidents">Nombre d'incidents</Label>
                  <Input
                    id="nb_incidents"
                    type="number"
                    min="0"
                    value={formData.nb_incidents}
                    onChange={(e) => setFormData({ ...formData, nb_incidents: e.target.value })}
                    data-testid="input-incidents"
                  />
                </div>

                <div>
                  <Label htmlFor="commentaires">Commentaires</Label>
                  <Textarea
                    id="commentaires"
                    value={formData.commentaires}
                    onChange={(e) => setFormData({ ...formData, commentaires: e.target.value })}
                    rows={3}
                    data-testid="input-commentaires"
                  />
                </div>

                <Button type="submit" className="w-full btn-als-primary" data-testid="submit-quality-button">
                  Créer la Fiche Qualité
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quality Records List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {qualityRecords.map((record) => {
              const compte = getCompteById(record.compte_id);
              return (
                <Card key={record.id} className="hover:shadow-lg transition-shadow" data-testid={`quality-card-${record.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          {compte?.raison_sociale || 'Client non trouvé'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {record.periode} • {record.type_prestation}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {record.division}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {record.region}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {record.taux_service !== null && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-blue-700">{record.taux_service}%</p>
                          <p className="text-xs text-gray-600 mt-1">Taux de service</p>
                        </div>
                      )}
                      {record.score_satisfaction !== null && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <p className="text-2xl font-bold text-yellow-700">{record.score_satisfaction}</p>
                            <span className="text-sm text-gray-500">/9</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Satisfaction</p>
                        </div>
                      )}
                      <div className={`${record.nb_incidents > 0 ? 'bg-orange-50' : 'bg-green-50'} rounded-lg p-3`}>
                        <p className={`text-2xl font-bold ${record.nb_incidents > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                          {record.nb_incidents}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Incidents</p>
                      </div>
                    </div>
                    {record.commentaires && (
                      <p className="text-sm text-gray-600 mt-4 border-t pt-3">
                        {record.commentaires}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && qualityRecords.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucune fiche qualité trouvée</p>
            <p className="text-gray-400 text-sm mt-1">Créez votre première fiche qualité</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QualitePage;