interface RegisterProgressProps {
  step: number; // 1, 2, 3
  onStepClick?: (step: number) => void;
}

const RegisterProgress = ({ step, onStepClick }: RegisterProgressProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-2">
      {[1, 2, 3].map((s) => {
        const isActive = s <= step;
        return (
          <button
            key={s}
            type="button"
            className={`h-2 w-14 rounded-full transition-all duration-200
              ${isActive ? 'bg-[#B79056] cursor-pointer' : 'border border-[#B79056] cursor-default'}
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