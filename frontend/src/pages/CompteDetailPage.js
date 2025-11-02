import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/App';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, MapPin, Phone, Mail, User, Calendar, Edit } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CompteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compte, setCompte] = useState(null);
  const [creator, setCreator] = useState(null);
  const [opportunites, setOpportunites] = useState([]);
  const [qualityRecords, setQualityRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompteDetails();
  }, [id]);

  const fetchCompteDetails = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const [compteRes, oppsRes, qualityRes, usersRes] = await Promise.all([
        axios.get(`${API}/comptes/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/opportunites`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/quality`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      
      setCompte(compteRes.data);
      
      // Find creator
      const creatorUser = usersRes.data.find(u => u.id === compteRes.data.created_by);
      setCreator(creatorUser);
      
      // Filter opportunites and quality for this compte
      setOpportunites(oppsRes.data.filter(o => o.compte_id === id));
      setQualityRecords(qualityRes.data.filter(q => q.compte_id === id));
    } catch (error) {
      console.error('Error fetching compte details:', error);
      toast.error('Erreur lors du chargement');
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

  if (!compte) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-600">Compte non trouvé</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="compte-detail-page">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/comptes')} data-testid="back-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{compte.raison_sociale}</h1>
            <p className="text-gray-600 mt-1">Fiche Client / Prospect</p>
          </div>
        </div>

        {/* Main Info Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Division</p>
                <p className="font-medium text-gray-900">{compte.division}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Région</p>
                <p className="font-medium text-gray-900">{compte.region}</p>
              </div>
              {compte.secteur && (
                <div>
                  <p className="text-sm text-gray-500">Secteur d'activité</p>
                  <p className="font-medium text-gray-900">{compte.secteur}</p>
                </div>
              )}
              {compte.taille && (
                <div>
                  <p className="text-sm text-gray-500">Taille</p>
                  <p className="font-medium text-gray-900">{compte.taille}</p>
                </div>
              )}
              {compte.source && (
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium text-gray-900">{compte.source}</p>
                </div>
              )}
            </div>

            {(compte.adresse || compte.ville || compte.code_postal) && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    {compte.adresse && <p className="font-medium text-gray-900">{compte.adresse}</p>}
                    {(compte.ville || compte.code_postal) && (
                      <p className="font-medium text-gray-900">
                        {compte.code_postal} {compte.ville}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info Card */}
        {(compte.contact_nom || compte.contact_email || compte.contact_telephone) && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Contact Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {compte.contact_nom && (
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{compte.contact_nom}</p>
                  {compte.contact_poste && (
                    <p className="text-sm text-gray-600">{compte.contact_poste}</p>
                  )}
                </div>
              )}
              {compte.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <a href={`mailto:${compte.contact_email}`} className="text-blue-600 hover:underline">
                    {compte.contact_email}
                  </a>
                </div>
              )}
              {compte.contact_telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <a href={`tel:${compte.contact_telephone}`} className="text-blue-600 hover:underline">
                    {compte.contact_telephone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Creator & Date Info */}
        <Card className="glass-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Créé par: <strong>{creator?.name || 'Utilisateur inconnu'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(compte.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunites */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Opportunités ({opportunites.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunites.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune opportunité pour ce compte</p>
            ) : (
              <div className="space-y-2">
                {opportunites.map((opp) => (
                  <div key={opp.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{opp.type_besoin || 'Opportunité'}</p>
                        <p className="text-sm text-gray-600">Statut: {opp.statut}</p>
                      </div>
                      {opp.montant_estime && (
                        <p className="text-green-700 font-semibold">
                          {opp.montant_estime.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quality Records */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Fiches Qualité ({qualityRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {qualityRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune fiche qualité pour ce compte</p>
            ) : (
              <div className="space-y-2">
                {qualityRecords.map((quality) => (
                  <div key={quality.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{quality.periode}</p>
                        <p className="text-sm text-gray-600">{quality.type_prestation}</p>
                      </div>
                      <div className="text-right">
                        {quality.taux_service && (
                          <p className="text-sm text-blue-700">Taux service: {quality.taux_service}%</p>
                        )}
                        {quality.score_satisfaction && (
                          <p className="text-sm text-yellow-700">Score: {quality.score_satisfaction}/9</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompteDetailPage;
