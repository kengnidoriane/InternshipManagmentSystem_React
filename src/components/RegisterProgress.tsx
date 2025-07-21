interface RegisterProgressProps {
  step: number; // 1, 2, 3
  onStepClick?: (step: number) => void;
}

const RegisterProgress = ({ step, onStepClick }: RegisterProgressProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {[1, 2, 3].map((s) => {
        const isActive = s <= step;
        return (
          <button
            key={s}
            type="button"
            className={`h-2 w-12 rounded-full transition-all duration-200
              ${isActive ? 'bg-[#58693e] cursor-pointer' : 'bg-gray-300 cursor-default'}
            `}
            onClick={() => isActive && onStepClick && s < step && onStepClick(s)}
            disabled={!isActive || s === step}
            aria-label={`Aller à l'étape ${s}`}
          />
        );
      })}
    </div>
  );
};

export default RegisterProgress; 