import { LabelHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  children: ReactNode;
  className?: string;
  label: string;
  labelProps: LabelHTMLAttributes<HTMLLabelElement>;
}

function Field({ children, className, label, labelProps }: FieldProps) {
  const cn = "form-floating " + className;
  return (
    <div className={cn}>
      {children}
      <label {...labelProps}>{label}</label>
    </div>
  );
}

export default Field;
