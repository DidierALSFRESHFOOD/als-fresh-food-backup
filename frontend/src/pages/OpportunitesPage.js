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
import { Plus, TrendingUp, DollarSign, Calendar, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OpportunitesPage = () => {
  const { user } = useContext(AuthContext);
  const [opportunites, setOpportunites] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({
    compte_id: '',
    type_besoin: '',
    volumes_estimes: '',
    temperatures: '',
    frequence: '',
    marchandises: '',
    depart: '',
    arrivee: '',
    contraintes_horaires: '',
    urgence: 'immédiat',
    canal: 'Appel',
    statut: 'Prospecté',
    montant_estime: '',
    commentaires: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [oppsRes, comptesRes] = await Promise.all([
        axios.get(`${API}/opportunites`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/comptes`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setOpportunites(oppsRes.data);
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
        montant_estime: formData.montant_estime ? parseFloat(formData.montant_estime) : null
      };
      await axios.post(`${API}/opportunites`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Opportunité créée avec succès !');
      setDialogOpen(false);
      fetchData();
      setFormData({
        compte_id: '',
        type_besoin: '',
        volumes_estimes: '',
        temperatures: '',
        frequence: '',
        marchandises: '',
        depart: '',
        arrivee: '',
        contraintes_horaires: '',
        urgence: 'immédiat',
        canal: 'Appel',
        statut: 'Prospecté',
        montant_estime: '',
        commentaires: ''
      });
    } catch (error) {
      console.error('Error creating opportunite:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'Prospecté': 'badge-prospected',
      'En discussion': 'badge-discussion',
      'Devis envoyé': 'badge-devis',
      'Négociation': 'badge-negociation',
      'Signé': 'badge-signe',
      'Perdu': 'badge-perdu'
    };
    return badges[statut] || 'badge-prospected';
  };

  const getCompteById = (id) => comptes.find(c => c.id === id);

  const handleEditStart = (opp) => {
    setEditingId(opp.id);
    setEditData({
      compte_id: opp.compte_id,
      type_besoin: opp.type_besoin || '',
      volumes_estimes: opp.volumes_estimes || '',
      temperatures: opp.temperatures || '',
      frequence: opp.frequence || '',
      marchandises: opp.marchandises || '',
      depart: opp.depart || '',
      arrivee: opp.arrivee || '',
      contraintes_horaires: opp.contraintes_horaires || '',
      urgence: opp.urgence || '',
      canal: opp.canal || '',
      statut: opp.statut,
      montant_estime: opp.montant_estime || '',
      commentaires: opp.commentaires || ''
    });
  };

  const handleEditSave = async (oppId) => {
    try {
      const token = localStorage.getItem('session_token');
      const payload = {
        ...editData,
        montant_estime: editData.montant_estime ? parseFloat(editData.montant_estime) : null
      };
      await axios.put(`${API}/opportunites/${oppId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Opportunité modifiée avec succès !');
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating opportunite:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la modification');
    }
  };

  const canEdit = (opp) => {
    return user && (opp.commercial_responsable === user.id || user.role === 'Admin_Directeur');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="opportunites-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Opportunités Commerciales</h1>
            <p className="text-gray-600 mt-1">Pipeline de vente et suivi des opportunités</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-als-primary" data-testid="add-opportunite-button">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Opportunité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle Opportunité</DialogTitle>
                <DialogDescription>
                  Créer une nouvelle opportunité commerciale
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="compte_id">Client / Prospect *</Label>
                  <Select
                    value={formData.compte_id}
                    onValueChange={(value) => setFormData({ ...formData, compte_id: value })}
                    required
                  >
                    <SelectTrigger data-testid="select-compte">
                      <SelectValue placeholder="Sélectionner un compte" />
                    </SelectTrigger>
                    <SelectContent>
                      {comptes.map((compte) => (
                        <SelectItem key={compte.id} value={compte.id}>
                          {compte.raison_sociale} ({compte.division} - {compte.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type_besoin">Type de besoin</Label>
                    <Input
                      id="type_besoin"
                      value={formData.type_besoin}
                      onChange={(e) => setFormData({ ...formData, type_besoin: e.target.value })}
                      placeholder="Livraison mutualisée, Tournée dédiée..."
                      data-testid="input-type-besoin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="urgence">Urgence</Label>
                    <Select
                      value={formData.urgence}
                      onValueChange={(value) => setFormData({ ...formData, urgence: value })}
                    >
                      <SelectTrigger data-testid="select-urgence">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immédiat">Immédiat</SelectItem>
                        <SelectItem value="<1 mois">&lt;1 mois</SelectItem>
                        <SelectItem value="<3 mois">&lt;3 mois</SelectItem>
                        <SelectItem value=">3 mois">&gt;3 mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="volumes_estimes">Volumes estimés</Label>
                    <Input
                      id="volumes_estimes"
                      value={formData.volumes_estimes}
                      onChange={(e) => setFormData({ ...formData, volumes_estimes: e.target.value })}
                      placeholder="10 palettes, 20m³..."
                      data-testid="input-volumes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperatures">Températures requises</Label>
                    <Input
                      id="temperatures"
                      value={formData.temperatures}
                      onChange={(e) => setFormData({ ...formData, temperatures: e.target.value })}
                      placeholder="Frais, Surgelé, 2-8°C..."
                      data-testid="input-temperatures"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequence">Fréquence</Label>
                    <Input
                      id="frequence"
                      value={formData.frequence}
                      onChange={(e) => setFormData({ ...formData, frequence: e.target.value })}
                      placeholder="Quotidien, Hebdomadaire..."
                      data-testid="input-frequence"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marchandises">Marchandises</Label>
                    <Input
                      id="marchandises"
                      value={formData.marchandises}
                      onChange={(e) => setFormData({ ...formData, marchandises: e.target.value })}
                      placeholder="Alimentaire, Pharmaceutique..."
                      data-testid="input-marchandises"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depart">Départ</Label>
                    <Input
                      id="depart"
                      value={formData.depart}
                      onChange={(e) => setFormData({ ...formData, depart: e.target.value })}
                      placeholder="Lieu de départ"
                      data-testid="input-depart"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrivee">Arrivée</Label>
                    <Input
                      id="arrivee"
                      value={formData.arrivee}
                      onChange={(e) => setFormData({ ...formData, arrivee: e.target.value })}
                      placeholder="Lieu d'arrivée"
                      data-testid="input-arrivee"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contraintes_horaires">Contraintes horaires</Label>
                  <Input
                    id="contraintes_horaires"
                    value={formData.contraintes_horaires}
                    onChange={(e) => setFormData({ ...formData, contraintes_horaires: e.target.value })}
                    placeholder="Horaires spécifiques..."
                    data-testid="input-contraintes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="canal">Canal</Label>
                    <Select
                      value={formData.canal}
                      onValueChange={(value) => setFormData({ ...formData, canal: value })}
                    >
                      <SelectTrigger data-testid="select-canal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appel">Appel</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Salon">Salon</SelectItem>
                        <SelectItem value="Visite">Visite</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="Prospecté">Prospecté</SelectItem>
                        <SelectItem value="En discussion">En discussion</SelectItem>
                        <SelectItem value="Devis envoyé">Devis envoyé</SelectItem>
                        <SelectItem value="Négociation">Négociation</SelectItem>
                        <SelectItem value="Signé">Signé</SelectItem>
                        <SelectItem value="Perdu">Perdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="montant_estime">Montant estimé (€)</Label>
                  <Input
                    id="montant_estime"
                    type="number"
                    step="0.01"
                    value={formData.montant_estime}
                    onChange={(e) => setFormData({ ...formData, montant_estime: e.target.value })}
                    data-testid="input-montant"
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

                <Button type="submit" className="w-full btn-als-primary" data-testid="submit-opportunite-button">
                  Créer l'Opportunité
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Opportunites List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {opportunites.map((opp) => {
              const compte = getCompteById(opp.compte_id);
              return (
                <Card key={opp.id} className="hover:shadow-lg transition-shadow" data-testid={`opportunite-card-${opp.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          {compte?.raison_sociale || 'Client non trouvé'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{opp.type_besoin}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(opp.statut)}`}>
                        {opp.statut}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {opp.montant_estime && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-700">
                            {opp.montant_estime.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-600">
                        <span className="font-medium">Canal:</span> {opp.canal}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Urgence:</span> {opp.urgence}
                      </div>
                    </div>
                    {opp.commentaires && (
                      <p className="text-sm text-gray-600 mt-3 border-t pt-3">
                        {opp.commentaires}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && opportunites.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucune opportunité trouvée</p>
            <p className="text-gray-400 text-sm mt-1">Créez votre première opportunité commerciale</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OpportunitesPage;