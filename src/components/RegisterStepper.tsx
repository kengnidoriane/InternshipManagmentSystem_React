import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import RegisterStep3Entreprise from './RegisterStep3Entreprise';
import RegisterStep3Etudiant from './RegisterStep3Etudiant';
import RegisterStep3Enseignant from './RegisterStep3Enseignant';
import RegisterStep4Code from './RegisterStep4Code';
import { useState } from 'react';
import RegisterSuccess from './RegisterSuccess';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { registerStudent, registerEnterprise, registerTeacher } from '../api/registrationApi';
import { useRegistrationStore } from '../store/registrationStore';
import { useNavigate } from 'react-router-dom';

export type AccountType = 'entreprise' | 'etudiant' | 'enseignant' | null;

interface RegisterData {
  email: string;
  password: string;
  accountType: AccountType;
  entreprise?: Record<string, unknown>;
  etudiant?: Record<string, unknown>;
  enseignant?: Record<string, unknown>;
}

const RegisterStepper = () => {
  const { step, formData, setShowSuccess, setStep, setFormData } = useRegistrationStore();
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  let stepContent = null;
  if (step === 1) {
    stepContent = (
      <RegisterStep1
        onNext={(data) => {
          setFormData((prev) => ({ ...prev, ...data }));
          setStep(2);
        }}
      />
    );
  } else if (step === 2) {
    stepContent = (
      <RegisterStep2
        onSelectType={(type) => setFormData((prev) => ({ ...prev, type }))}
        onNext={() => setStep(3)}
        onPrev={() => setStep(1)}
      />
    );
  } else if (step === 3) {
    const handleRegister = async (data: unknown) => {
      setRegisterLoading(true);
      try {
        if (formData.type === 'entreprise') {
          // Mapping explicite pour correspondre au DTO backend
          const entrepriseData = data as Record<string, unknown>;
          await registerEnterprise({
            name: entrepriseData.name,
            email: entrepriseData.email,
            matriculation: entrepriseData.matriculation,
            password: formData.password,
            contact: entrepriseData.contact,
            location: entrepriseData.location,
            city: entrepriseData.city, 
            sectorOfActivity: entrepriseData.sectorOfActivity,
            country: entrepriseData.country,
            remote: entrepriseData.remote,
            paying: entrepriseData.paying,
            logo: entrepriseData.logo,
          });
        } else if (formData.type === 'etudiant') {
          // Mapping explicite pour correspondre au DTO backend
          const etudiantData = data as Record<string, unknown>;
          await registerStudent({
            name: etudiantData.lastName ?? etudiantData.name, // compatibilité
            firstName: etudiantData.firstName,
            email: formData.email,
            password: formData.password,
            sector: etudiantData.sector,
            languages: etudiantData.languages,
            department: etudiantData.department,
            githubLink: etudiantData.githubLink,
            linkedinLink: etudiantData.linkedinLink,
          });
        } else if (formData.type === 'enseignant') {
          // Mapping explicite pour correspondre au DTO backend
          const enseignantData = data as Record<string, unknown>;
          await registerTeacher({
            name: enseignantData.lastName ?? enseignantData.name,
            firstName: enseignantData.firstName,
            department: enseignantData.department,
            email: formData.email,
            password: formData.password,
          });
        }
        setFormData((prev) => ({ ...prev, [formData.type!]: data }));
        setStep(4);
      } catch (e) {
        // setRegisterError(e instanceof Error ? e.message : 'Erreur lors de l\'inscription');
      } finally {
        setRegisterLoading(false);
      }
    };
    if (formData.type === 'entreprise') {
      stepContent = (
        <RegisterStep3Entreprise
          onPrev={() => setStep(2)}
          onFinish={handleRegister}
        />
      );
    } else if (formData.type === 'etudiant') {
      stepContent = (
        <RegisterStep3Etudiant
          onPrev={() => setStep(2)}
          onFinish={handleRegister}
        />
      );
    } else if (formData.type === 'enseignant') {
      stepContent = (
        <RegisterStep3Enseignant
          onPrev={() => setStep(2)}
          onFinish={handleRegister}
        />
      );
    }
  } else if (step === 4) {
    stepContent = (
      <RegisterStep4Code
        email={formData.email}
        accountType={formData.type}
        onSuccess={() => {
          setShowSuccess(true);
          navigate('/felicitations');
        }}
        onCancel={() => setStep(1)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-login-gradient">
      <div className='flex flex-col justify-center py-4 '>
        <img src={logo} alt="Logo" className="max-w-[300px] mx-auto " />
        {/* <p className='text-[#e1d3c1] text-center mx-auto space'>ELITE</p> */}
      </div>
      <h1 className="text-[#b79056] mt-4 text-center mx-auto text-2xl">INSCRIPTION</h1><br/>
      <div className="w-full max-w-[380px] border border-[3px] p-4 border-[#B79056]">
        {registerLoading && <div className="text-center py-2 text-gray-700">Inscription en cours...</div>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterStepper;