import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const SatisfactionPage = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6" data-testid="satisfaction-page">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enquêtes de Satisfaction</h1>
          <p className="text-gray-600 mt-1">Suivi des réponses aux enquêtes clients</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Module Enquêtes Satisfaction
            </CardTitle>
            <CardDescription>
              Fonctionnalité en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Enquêtes de satisfaction clients</p>
              <p className="text-gray-500 text-sm">
                Cette section permettra de gérer les enquêtes de satisfaction clients avec notation 0-9,
                envoi automatique de liens sécurisés, et analyse des retours par thème.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 inline-block">
                <p className="text-sm text-blue-900 font-medium">Thèmes d'évaluation :</p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 text-left">
                  <li>• Conducteurs (ponctualité, présentation, attitude)</li>
                  <li>• Matériel & Véhicules (propreté, conformité)</li>
                  <li>• Tournées réalisées (respect consignes, BL)</li>
                  <li>• Service Clientèle (joignabilité, réactivité)</li>
                  <li>• Évaluation globale</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SatisfactionPage;