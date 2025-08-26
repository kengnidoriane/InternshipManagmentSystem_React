// Script de test pour vérifier les endpoints des entreprises
import { getAllEnterprises, getEnterpriseById, getEnterpriseLogoById } from './api/enterpriseApi';

const testEnterprises = async () => {
  try {
    console.log('=== Test getAllEnterprises ===');
    const response = await getAllEnterprises();
    console.log('Entreprises récupérées:', response.data);
    
    if (response.data && response.data.length > 0) {
      const firstEnterprise = response.data[0];
      console.log('\n=== Test getEnterpriseById ===');
      const detailResponse = await getEnterpriseById(firstEnterprise.id);
      console.log('Détails entreprise:', detailResponse.data);
      
      if (firstEnterprise.hasLogo?.hasLogo) {
        console.log('\n=== Test getEnterpriseLogoById ===');
        try {
          const logoResponse = await getEnterpriseLogoById(firstEnterprise.id);
          console.log('Logo récupéré, taille:', logoResponse.data.size);
        } catch (logoErr) {
          console.error('Erreur logo:', logoErr.message);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du test:', error.message);
  }
};

export default testEnterprises;