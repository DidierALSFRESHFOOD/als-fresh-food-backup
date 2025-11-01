import React, { useState, useContext } from 'react';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-truck-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-700/90"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_logistikpi/artifacts/kpnkwozt_ALS_logo_dessin_coul.png" 
              alt="ALS Logo" 
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Suivi Activité Commerciale
          </h1>
          <p className="text-blue-100 text-lg flex items-center justify-center gap-2">
            <Truck className="h-5 w-5" />
            ALS FRESH FOOD • ALS PHARMA
          </p>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md glass-card shadow-2xl" data-testid="login-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace commercial et qualité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {/* Login Form */}
              <div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre.email@als-groupe.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      data-testid="login-email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      data-testid="login-password-input"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full btn-als-primary" 
                    disabled={loading}
                    data-testid="login-submit-button"
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                    <LogIn className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-blue-100 text-sm text-center">
          © 2025 ALS GROUPE - Transport frigorifique du dernier kilomètre
        </p>
      </div>
    </div>
  );
};

export default LoginPage;