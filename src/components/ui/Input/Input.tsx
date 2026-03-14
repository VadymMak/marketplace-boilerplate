import styles from "./Input.module.css";

type InputProps = {
  label?: string;
  error?: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
};

export function Input({
  label,
  error,
  id,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  disabled,
  autoComplete,
}: InputProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
