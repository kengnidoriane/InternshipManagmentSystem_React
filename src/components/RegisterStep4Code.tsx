import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterStep4CodeProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CODE_LENGTH = 5;

const RegisterStep4Code = ({ email, onSuccess, onCancel }: RegisterStep4CodeProps) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    // Simulation API : code correct = 12345
    await new Promise((res) => setTimeout(res, 1000));
    if (code.join('') === '12345') {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        navigate('/');
      }, 1200);
    } else {
      setError('Le code est incorrect');
    }
    setLoading(false);
  };

  return (
    <form className="w-ful text-white rounded-xl shadow-lg py-6 px-8 flex flex-col items-start" onSubmit={handleSubmit}>
      <p className="text-white">Un code a été envoyé à l'adresse suivante&nbsp;</p>
      <p className="font-semibold">{email}</p>
      <p>Veuillez l'insérer ci-dessous.</p><br/><br/>
      <div className="w-full flex justify-between mb-2">
        {code.map((value, idx) => (
          <input
            key={idx}
            ref={el => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            placeholder="-"
            className="w-14 h-10 text-center text-black text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={value}
            onChange={e => handleChange(e.target.value, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            autoFocus={idx === 0}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 mb-2 w-full">{error}</p>
      )}
      <div className="flex w-full justify-between mt-4">
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1.5 px-6 rounded transition-colors"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-[#58693e] text-white font-semibold py-1.5 px-6 rounded transition-colors disabled:opacity-50"
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