/**
 * Génère les initiales d'une entreprise selon la logique demandée :
 * - Un seul mot : première lettre en majuscule
 * - Deux mots ou plus : premières lettres des deux premiers mots en majuscule
 */
export const generateEnterpriseInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return 'E'; // Fallback pour nom vide
  }
  
  if (words.length === 1) {
    // Un seul mot : première lettre en majuscule
    return words[0].charAt(0).toUpperCase();
  } else {
    // Deux mots ou plus : premières lettres des deux premiers mots
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  }
};

/**
 * Exemples de test :
 * - "Apple" → "A"
 * - "Microsoft Corporation" → "MC"
 * - "Google LLC Inc" → "GL"
 * - "IBM" → "I"
 * - "Amazon Web Services" → "AW"
 */