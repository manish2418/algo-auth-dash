import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ value, onChange, length = 6, className, ...props }, ref) => {
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, newValue: string) => {
      if (newValue.length > 1) return;
      
      const newOTP = value.split('');
      newOTP[index] = newValue;
      onChange(newOTP.join(''));

      // Auto focus next input
      if (newValue && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').slice(0, length);
      onChange(pastedData);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3",
          className
        )}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-semibold bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary/50"
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export { OTPInput };