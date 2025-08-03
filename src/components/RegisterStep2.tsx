import { FiBriefcase, FiUser, FiBook } from 'react-icons/fi';
import RegisterProgress from './RegisterProgress';

export type AccountType = 'entreprise' | 'etudiant' | 'enseignant' | undefined;

import { useRegistrationStore } from '../store/registrationStore';

const cardData = [
  {
    type: 'entreprise',
    label: 'Entreprise',
    icon: <FiBriefcase className="text-3xl mx-auto mb-2" />,
  },
  {
    type: 'etudiant',
    label: 'Étudiant',
    icon: <FiUser className="text-3xl mx-auto mb-2" />,
  },
  {
    type: 'enseignant',
    label: 'Enseignant',
    icon: <FiBook className="text-3xl mx-auto mb-2" />,
  },
] as const;

const RegisterStep2 = () => {
  const { formData, setFormData, setStep } = useRegistrationStore();
  const selectedType: AccountType = formData.type || undefined;

  const handleSelectType = (type: AccountType) => {
    setFormData({ type });
  };

  const handleNext = () => {
    if (selectedType) setStep(3);
  };

  const handlePrev = () => {
    setStep(1);
  };

  return (
    <div>
      <div className="w-full p-2 flex flex-col">
        <h2 className="text-[16px] font-semibold text-white mb-4">Veuillez choisir le type de compte</h2>
        <div className="flex flex-row justify-between gap-1 mb-6 w-full">
          {cardData.map((card) => (
            <button
              key={card.type}
              type="button"
              className={`flex flex-col px-2 py-4 items-center border cursor-pointer border-white hover:border-[#70ADF0] rounded-[5px] w-28 transition-colors
              ${selectedType === card.type ? 'bg-[#70ADF0] shadow-md text-black border-none' : 'bg-none text-white'}`}
              onClick={() => handleSelectType(card.type)}
            >
              {card.icon}
              <span className="font-medium">{card.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full justify-between mt-4">
          <button
            type="button"
            className="w-full hover:bg-gray-300 border border- text-white font-semibold py-1 px-4 rounded transition-colors"
            onClick={handlePrev}
          >
            Précédent
          </button>
          <button
            type="button"
            className="w-full bg-[var(--color-vert)] hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            onClick={handleNext}
            disabled={!selectedType}
          >
            Suivant
          </button>
        </div>
      </div>
      <RegisterProgress step={2} onStepClick={(s) => s === 1 && handlePrev()} />
    </div>
  );
};


export default RegisterStep2; 