import { ReactNode } from "react";

export interface AlertObject {
  active: boolean;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  message?: string;
}

interface AlertProps {
  children: ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  onClose: () => void;
}

const Alert = ({
  children,
  className,
  color = "primary",
  onClose,
}: AlertProps) => {
  const cn = "alert alert-dismissible alert-" + color + " " + className;
  return (
    <div className={cn} role="alert">
      {children}
      <button type="button" onClick={onClose} className="btn-close"></button>
    </div>
  );
};

export default Alert;
