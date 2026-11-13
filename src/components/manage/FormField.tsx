export const FormField = ({
  id,
  label,
  defaultValue,
  error,
  required,
  placeholder,
  type = "text",
  children,
}: {
  id: string;
  label: string;
  defaultValue?: string | number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  children?: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="field-label">
      {label} {required && <span className="text-danger-500">*</span>}
    </label>
    {children ?? (
      <input
        type={type}
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field h-11 ${error ? "border-danger-500" : ""}`}
      />
    )}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-danger-600">
        {error}
      </p>
    )}
  </div>
);
