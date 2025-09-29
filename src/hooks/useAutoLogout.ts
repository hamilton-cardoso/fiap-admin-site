import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
      
      if (!tokenExpiresAt) {
        return;
      }

      const expiresAt = new Date(tokenExpiresAt).getTime();
      const now = new Date().getTime();
      
      // Se o token já expirou
      if (expiresAt <= now) {
        authService.logout();
        toast.error('Sua sessão expirou. Faça login novamente.');
        navigate('/login');
        return;
      }

      // Calcula o tempo até a expiração
      const timeUntilExpiry = expiresAt - now;
      
      // Se faltar menos de 1 minuto, avisa o usuário
      if (timeUntilExpiry <= 60000 && timeUntilExpiry > 0) {
        toast.warning('Sua sessão expirará em breve.');
      }
    };

    // Verifica imediatamente
    checkTokenExpiration();

    // Verifica a cada 30 segundos
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [navigate]);
}
