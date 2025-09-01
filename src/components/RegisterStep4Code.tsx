import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, resendToken } from '../api/registrationApi';
import { useAuthStore } from '../store/authStore';
import { useRegistrationStore } from '../store/registrationStore';

const CODE_LENGTH = 5;

interface RegisterStep4CodeProps {
  email?: string;
  accountType?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RegisterStep4Code = ({ email, accountType, onSuccess, onCancel }: RegisterStep4CodeProps) => {
  const { setStep, reset } = useRegistrationStore();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();





  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (pasted.length > 0) {
      const newCode = pasted.split('');
      while (newCode.length < CODE_LENGTH) newCode.push('');
      setCode(newCode);
      setTimeout(() => {
        const nextIdx = Math.min(pasted.length, CODE_LENGTH - 1);
        inputsRef.current[nextIdx]?.focus();
      }, 0);
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const isComplete = code.every((c) => c.length === 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyEmail({ email: email ?? '', token: code.join('') });
      setSubmitted(true);
      setTimeout(() => {
        reset();
        setStep(1);
        navigate('/register-success');
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Le code est incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendCooldown > 0) return;
    
    setResendLoading(true);
    setError('');
    try {
      await resendToken(email);
      setResendSuccess(true);
      setResendCooldown(60);
      
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renvoi du code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form className="w-ful text-white flex flex-col items-start" onSubmit={handleSubmit}>
      <p className="text-white">Un code a été envoyé à l'adresse suivante&nbsp;</p>
      <p className="font-semibold">{email}</p><br/>
      <p>Veuillez l'insérer ci-dessous.</p><br/>
      <div className="w-full flex justify-between mb-2">
        {code.map((value, idx) => (
          <input
            key={idx}
            ref={el => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-14 h-10 text-center text-black text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={value}
            onChange={e => handleChange(e.target.value, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            autoFocus={idx === 0}
            onPaste={handlePaste}
          />
        ))}
      </div><br/><br/>
      {error && (
        <p className="text-xs text-red-600 mb-2 w-full">{error}</p>
      )}
      {resendSuccess && (
        <p className="text-xs text-green-600 mb-2 w-full">Code renvoyé avec succès !</p>
      )}
      
      <div className="w-full text-center mb-4">
        <p className="text-sm text-gray-300 mb-2">Vous n'avez pas reçu le code ?</p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendLoading || resendCooldown > 0}
          className="text-[var(--color-jaune)] hover:text-[var(--color-vert)] underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendLoading ? 'Envoi...' : 
           resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 
           'Renvoyer le code'}
        </button>
      </div>
      <div className="flex w-full justify-between gap-2 mt-4">
        <button
          type="button"
          className=" border border-[#58693e] text-[var(--color-light)] w-full py-1 px-6 rounded transition-colors"
          onClick={() => { reset(); setStep(1); }}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[var(--color-vert)] text-[var(--color-light)] w-full py-1 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer "
          disabled={!isComplete || loading}
        >
          {loading ? 'Vérification...' : 'Valider'}
        </button>
      </div>
      {submitted && (
        <div className="mt-4 text-green-700 text-center font-semibold animate-fade-in">
          Bienvenue sur la plateforme !
        </div>
      )}
    </form>
  );
};

export default RegisterStep4Code;