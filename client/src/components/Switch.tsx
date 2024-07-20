import { SetStateAction, Dispatch } from "react";

interface SwitchProps {
  disabled?: boolean;
  toggle: boolean;
  label?: string;
  setToggle: Dispatch<SetStateAction<boolean>>;
}

function Switch({ disabled = false, toggle, label, setToggle }: SwitchProps) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={toggle}
        onChange={(e) => setToggle(!toggle)}
        disabled={disabled}
      />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
}

export default Switch;
