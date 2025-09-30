/**
 * Utilitaires de sécurité pour l'application
 */

/**
 * Sanitise les données avant logging pour éviter les injections de logs
 * Supprime les caractères de contrôle et les retours à la ligne
 */
export const sanitizeForLog = (input: any): string => {
  if (input === null || input === undefined) {
    return 'null';
  }
  
  const str = String(input);
  // Supprimer les caractères de contrôle, retours à la ligne et caractères dangereux
  return str
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/[<>'"&]/g, '_')
    .substring(0, 200); // Limiter la taille
};

/**
 * Sanitise les données pour affichage HTML (prévention XSS)
 */
export const sanitizeForHTML = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Logger sécurisé qui sanitise automatiquement les données
 */
export const secureLog = {
  info: (message: string, data?: any) => {
    console.log(sanitizeForLog(message), data ? sanitizeForLog(data) : '');
  },
  error: (message: string, error?: any) => {
    console.error(sanitizeForLog(message), error ? sanitizeForLog(error) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(sanitizeForLog(message), data ? sanitizeForLog(data) : '');
  }
};