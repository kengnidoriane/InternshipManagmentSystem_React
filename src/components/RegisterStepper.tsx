import { useState } from 'react';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import RegisterStep3Entreprise from './RegisterStep3Entreprise';
import RegisterStep3Etudiant from './RegisterStep3Etudiant';
import RegisterStep3Enseignant from './RegisterStep3Enseignant';
import RegisterStep4Code from './RegisterStep4Code';
import RegisterSuccess from './RegisterSuccess';
import logo from '../assets/logo.png';

export type AccountType = 'entreprise' | 'etudiant' | 'enseignant' | null;

interface RegisterData {
  email: string;
  password: string;
  accountType: AccountType;
  // Ajoute ici les autres champs selon le type de compte
  entreprise?: { /* ... */ };
  etudiant?: { /* ... */ };
  enseignant?: { /* ... */ };
}

const RegisterStepper = () => {
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    accountType: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Gestion du rendu de l'étape courante
  let stepContent = null;
  if (showSuccess) {
    stepContent = <RegisterSuccess />;
  } else if (step === 1) {
    stepContent = (
      <RegisterStep1
        data={registerData}
        onNext={(data) => {
          setRegisterData((prev) => ({ ...prev, ...data }));
          setStep(2);
        }}
      />
    );
  } else if (step === 2) {
    stepContent = (
      <RegisterStep2
        selectedType={registerData.accountType}
        onSelectType={(type) => setRegisterData((prev) => ({ ...prev, accountType: type }))}
        onNext={() => setStep(3)}
        onPrev={() => setStep(1)}
      />
    );
  } else if (step === 3) {
    if (registerData.accountType === 'entreprise') {
      stepContent = (
        <RegisterStep3Entreprise
          onPrev={() => setStep(2)}
          onFinish={(data) => {
            setRegisterData((prev) => ({ ...prev, entreprise: data }));
            setStep(4);
          }}
        />
      );
    } else if (registerData.accountType === 'etudiant') {
      stepContent = (
        <RegisterStep3Etudiant
          onPrev={() => setStep(2)}
          onFinish={(data) => {
            setRegisterData((prev) => ({ ...prev, etudiant: data }));
            setStep(4);
          }}
        />
      );
    } else if (registerData.accountType === 'enseignant') {
      stepContent = (
        <RegisterStep3Enseignant
          onPrev={() => setStep(2)}
          onFinish={(data) => {
            setRegisterData((prev) => ({ ...prev, enseignant: data }));
            setStep(4);
          }}
        />
      );
    }
  } else if (step === 4) {
    stepContent = (
      <RegisterStep4Code
        email={registerData.email}
        onSuccess={() => setShowSuccess(true)}
        onCancel={() => setStep(1)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-login-gradient">
      <div className="flex flex-col items-center mb-8 mt-8">
        <img src={logo} alt="Logo" className="max-w-[200px] mx-auto mb-2" />
      </div>
      <div className="w-full max-w-[440px] border border-[#e1d3c1]">
        {stepContent}
      </div>
    </div>
  );
};

export default RegisterStepper; 