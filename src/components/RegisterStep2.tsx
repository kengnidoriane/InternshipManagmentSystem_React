import { FiBriefcase, FiUser, FiBook } from 'react-icons/fi';
import RegisterProgress from './RegisterProgress';

export type AccountType = 'entreprise' | 'etudiant' | 'enseignant' | null;

interface RegisterStep2Props {
  selectedType: AccountType;
  onSelectType: (type: AccountType) => void;
  onNext: () => void;
  onPrev: () => void;
}

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

const RegisterStep2 = ({ selectedType, onSelectType, onNext, onPrev }: RegisterStep2Props) => {
  return (
    <div>
      <div className="w-full border border-[#e1d3c1] rounded-xl shadow-lg p-2 flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white mb-4 text-center">Veuillez choisir le type de compte</h2>
        <div className="flex flex-row justify-center gap-4 mb-6 w-full">
          {cardData.map((card) => (
            <button
              key={card.type}
              type="button"
              className={`flex flex-col items-center border border-white rounded-lg px-2 py-2 w-32 transition-colors
              ${selectedType === card.type ? 'bg-[#112799] shadow-md text-black' : 'bg-none text-white'}`}
              onClick={() => onSelectType(card.type)}
            >
              {card.icon}
              <span className="font-medium">{card.label}</span>
            </button>
          ))}
        </div>
        <div className="flex w-full justify-between mt-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded transition-colors"
            onClick={onPrev}
          >
            Précédent
          </button>
          <button
            type="button"
            className="bg-[#58693e] hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            onClick={onNext}
            disabled={!selectedType}
          >
            Suivant
          </button>
        </div>
      </div>
      <RegisterProgress step={2} onStepClick={(s) => s === 1 && onPrev()} />
    </div>
  );
};

export default RegisterStep2; 