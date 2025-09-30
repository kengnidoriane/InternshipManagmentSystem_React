import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, resendToken } from '../api/registrationApi';
import { useRegistrationStore } from '../store/registrationStore';
import Spinner from './Spinner';
import { sanitizeForHTML } from '../utils/security';

const CODE_LENGTH = 5;

interface RegisterStep4CodeProps {
  email?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RegisterStep4Code = ({ email, onSuccess, onCancel }: RegisterStep4CodeProps) => {
  const { setStep, reset, formData } = useRegistrationStore();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const cooldownIntervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const effectiveEmail = email ?? formData?.email ?? '';

  // Initial cooldown: 1 minute (60s) before first resend
  useEffect(() => {
    const INITIAL_COOLDOWN_SECONDS = 60;
    setResendCooldown(INITIAL_COOLDOWN_SECONDS);

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }
    cooldownIntervalRef.current = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

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
      await verifyEmail({ email: effectiveEmail, token: code.join('') });
      setSubmitted(true);
      setTimeout(() => {
        reset();
        setStep(1);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/login');
        }
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Le code est incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!effectiveEmail || resendCooldown > 0) return;

    setResendLoading(true);
    setError('');
    try {
      await resendToken(effectiveEmail);
      setResendSuccess(true);
      setResendCooldown(60);

      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
      cooldownIntervalRef.current = window.setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) {
              clearInterval(cooldownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      // Gestion des erreurs spécifiques du backend
      if (err.response?.status === 400) {
        setError('Utilisateur déjà vérifié');
      } else if (err.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else {
        setError(err.response?.data || err.message || 'Erreur lors du renvoi du code');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form className="w-full text-white flex flex-col items-start" onSubmit={handleSubmit}>
      <p className="text-white">Un code a été envoyé à l'adresse suivante&nbsp;</p>
      <p className="font-semibold" dangerouslySetInnerHTML={{ __html: sanitizeForHTML(effectiveEmail || 'Adresse email introuvable') }}></p><br/>
      <p>Veuillez l'insérer ci-dessous.</p><br/>
      <div className="w-full flex justify-between mb-2" role="group" aria-label="Code de vérification">
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
            aria-label={`Chiffre ${idx + 1}`}
            title={`Chiffre ${idx + 1}`}
            placeholder="•"
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
          disabled={resendLoading || resendCooldown > 0 || !effectiveEmail}
          className="text-[var(--color-jaune)] hover:text-[var(--color-vert)] underline text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {resendLoading && <Spinner size={14} />}
          {resendLoading ? 'Envoi...' :
           resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` :
           'Renvoyer le code'}
        </button>
        {!effectiveEmail && (
          <p className="text-xs text-red-400 mt-1">Adresse email manquante pour renvoyer le code.</p>
        )}
      </div>
      <div className="flex w-full justify-between gap-2 mt-4">
        <button
          type="button"
          className=" border border-[#58693e] text-[var(--color-light)] w-full py-1 px-6 rounded transition-colors"
          onClick={() => { reset(); setStep(1); if (onCancel) { onCancel(); } }}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[var(--color-vert)] text-[var(--color-light)] w-full py-1 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
          disabled={!isComplete || loading}
        >
          {loading && <Spinner size={16} />}
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