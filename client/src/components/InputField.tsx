import { InputHTMLAttributes } from "react";

function InputField({
  className,
  ...otherProps
}: InputHTMLAttributes<HTMLInputElement>) {
  const cn = "form-control " + className;
  return <input className={cn} {...otherProps} />;
}

export default InputField;
