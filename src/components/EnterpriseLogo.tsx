import React, { useState, useEffect } from 'react';
import { generateEnterpriseInitials } from '../utils/enterpriseUtils';

interface EnterpriseLogoProps {
  enterpriseName: string;
  enterpriseId?: number;
  hasLogo?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EnterpriseLogo: React.FC<EnterpriseLogoProps> = ({ 
  enterpriseName, 
  enterpriseId, 
  hasLogo = false, 
  className = '',
  size = 'md'
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);



  // Tailles selon le prop size
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-20 w-20 text-lg'
  };

  useEffect(() => {
    if (hasLogo === true && enterpriseId) {
      // Essayer de charger le logo depuis l'API
      const loadLogo = async () => {
        try {
          const response = await fetch('/profilePhoto/getEnterpriseLogo', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            // Vérifier que le blob n'est pas vide
            if (blob.size > 0) {
              const url = URL.createObjectURL(blob);
              setLogoUrl(url);
            } else {
              setLogoError(true);
            }
          } else {
            setLogoError(true);
          }
        } catch (error) {
          // Ne pas logger l'erreur pour éviter le spam console
          setLogoError(true);
        }
      };
      
      loadLogo();
    } else {
      // Pas de logo ou pas d'ID d'entreprise - utiliser directement les initiales
      setLogoError(true);
    }

    // Cleanup
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [hasLogo, enterpriseId]);

  const initials = generateEnterpriseInitials(enterpriseName);

  if (logoUrl && !logoError) {
    return (
      <img 
        src={logoUrl} 
        alt={`Logo ${enterpriseName}`}
        className={`${sizeClasses[size]} rounded-full object-cover border border-[#e1d3c1] bg-white ${className}`}
        onError={() => {
          setLogoError(true);
          if (logoUrl) {
            URL.revokeObjectURL(logoUrl);
            setLogoUrl(null);
          }
        }}
      />
    );
  }

  // Fallback avec initiales
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-[var(--color-vert)] text-white flex items-center justify-center font-semibold border border-[#e1d3c1] ${className}`}>
      {initials}
    </div>
  );
};

export default EnterpriseLogo;