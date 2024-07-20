import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "primary" | "secondary" | "danger" | "success";
}

const Button = ({
  children,
  className,
  onClick,
  color = "primary",
  ...otherProps
}: ButtonProps) => {
  const cn = "btn btn-" + color + " " + className;
  return (
    <button type="button" className={cn} onClick={onClick} {...otherProps}>
      {children}
    </button>
  );
};

export default Button;
