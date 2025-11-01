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
import { Plus, Search, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ComptesPage = () => {
  const [comptes, setComptes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    raison_sociale: '',
    division: 'ALS FRESH FOOD',
    region: 'IDF',
    adresse: '',
    ville: '',
    code_postal: '',
    secteur: '',
    taille: 'PME',
    contact_nom: '',
    contact_poste: '',
    contact_email: '',
    contact_telephone: '',
    source: 'Prospection'
  });

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [comptesRes, usersRes] = await Promise.all([
        axios.get(`${API}/comptes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      setComptes(comptesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching comptes:', error);
      toast.error('Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('session_token');
      await axios.post(`${API}/comptes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Client/Prospect créé avec succès !');
      setDialogOpen(false);
      fetchComptes();
      setFormData({
        raison_sociale: '',
        division: 'ALS FRESH FOOD',
        region: 'IDF',
        adresse: '',
        ville: '',
        code_postal: '',
        secteur: '',
        taille: 'PME',
        contact_nom: '',
        contact_poste: '',
        contact_email: '',
        contact_telephone: '',
        source: 'Prospection'
      });
    } catch (error) {
      console.error('Error creating compte:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const filteredComptes = comptes.filter(compte =>
    compte.raison_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compte.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compte.contact_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCreatorName = (createdBy) => {
    const creator = users.find(u => u.id === createdBy);
    return creator ? creator.name : 'Inconnu';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="comptes-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients / Prospects</h1>
            <p className="text-gray-600 mt-1">Gestion de la base clients et prospects</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-als-primary" data-testid="add-compte-button">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Compte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau Client / Prospect</DialogTitle>
                <DialogDescription>
                  Créer une nouvelle fiche client ou prospect
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="raison_sociale">Raison Sociale *</Label>
                    <Input
                      id="raison_sociale"
                      value={formData.raison_sociale}
                      onChange={(e) => setFormData({ ...formData, raison_sociale: e.target.value })}
                      required
                      data-testid="input-raison-sociale"
                    />
                  </div>
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
                  <div className="col-span-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      data-testid="input-adresse"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      data-testid="input-ville"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code_postal">Code Postal</Label>
                    <Input
                      id="code_postal"
                      value={formData.code_postal}
                      onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                      data-testid="input-code-postal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secteur">Secteur d'activité</Label>
                    <Input
                      id="secteur"
                      value={formData.secteur}
                      onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                      placeholder="Restauration, E-commerce, etc."
                      data-testid="input-secteur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taille">Taille</Label>
                    <Select
                      value={formData.taille}
                      onValueChange={(value) => setFormData({ ...formData, taille: value })}
                    >
                      <SelectTrigger data-testid="select-taille">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TPE">TPE</SelectItem>
                        <SelectItem value="PME">PME</SelectItem>
                        <SelectItem value="Enseigne">Enseigne</SelectItem>
                        <SelectItem value="Groupe">Groupe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Contact Principal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_nom">Nom</Label>
                      <Input
                        id="contact_nom"
                        value={formData.contact_nom}
                        onChange={(e) => setFormData({ ...formData, contact_nom: e.target.value })}
                        data-testid="input-contact-nom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_poste">Poste</Label>
                      <Input
                        id="contact_poste"
                        value={formData.contact_poste}
                        onChange={(e) => setFormData({ ...formData, contact_poste: e.target.value })}
                        data-testid="input-contact-poste"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        data-testid="input-contact-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_telephone">Téléphone</Label>
                      <Input
                        id="contact_telephone"
                        value={formData.contact_telephone}
                        onChange={(e) => setFormData({ ...formData, contact_telephone: e.target.value })}
                        data-testid="input-contact-telephone"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger data-testid="select-source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospection">Prospection</SelectItem>
                      <SelectItem value="Salon">Salon</SelectItem>
                      <SelectItem value="Recommandation">Recommandation</SelectItem>
                      <SelectItem value="Réseau">Réseau</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full btn-als-primary" data-testid="submit-compte-button">
                  Créer le Compte
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par raison sociale, ville, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="search-comptes"
          />
        </div>

        {/* Comptes List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComptes.map((compte) => (
              <Card 
                key={compte.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer" 
                data-testid={`compte-card-${compte.id}`}
                onClick={() => window.location.href = `/comptes/${compte.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {compte.raison_sociale}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {compte.division}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {compte.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {compte.ville && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {compte.ville} {compte.code_postal && `(${compte.code_postal})`}
                    </div>
                  )}
                  {compte.contact_nom && (
                    <div className="pt-2 border-t">
                      <p className="font-medium text-gray-900">{compte.contact_nom}</p>
                      {compte.contact_poste && (
                        <p className="text-xs text-gray-500">{compte.contact_poste}</p>
                      )}
                      {compte.contact_email && (
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{compte.contact_email}</span>
                        </div>
                      )}
                      {compte.contact_telephone && (
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{compte.contact_telephone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredComptes.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun compte trouvé</p>
            <p className="text-gray-400 text-sm mt-1">Commencez par créer un nouveau client ou prospect</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComptesPage;