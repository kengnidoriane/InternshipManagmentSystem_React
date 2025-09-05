import React, { useState, useEffect } from 'react';
import { generateEnterpriseInitials } from '../../utils/enterpriseUtils';
import { getEnterpriseLogo } from '../../api/enterpriseApi';

interface EnterpriseLogoProps {
  enterpriseName: string;
  enterpriseId?: number;
  hasLogo?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
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
    lg: 'h-16 w-16 text-base',
    xl: 'h-20 w-20 text-lg',
    '2xl': 'h-24 w-24 text-xl',
    '3xl': 'h-32 w-32 text-2xl'
  };

  useEffect(() => {
    if (hasLogo === true) {
      // Essayer de charger le logo depuis l'API
      const loadLogo = async () => {
        try {
          const response = await getEnterpriseLogo();
          if (response.data && response.data.size > 0) {
            const url = URL.createObjectURL(response.data);
            setLogoUrl(url);
          } else {
            setLogoError(true);
          }
        } catch (error) {
          setLogoError(true);
        }
      };
      
      loadLogo();
    } else {
      // Pas de logo - utiliser directement les initiales
      setLogoError(true);
    }

    // Cleanup
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [hasLogo]);

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