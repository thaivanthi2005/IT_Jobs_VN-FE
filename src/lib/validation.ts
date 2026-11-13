export const passwordRules = [
  { id: "len", label: "Ít nhất 8 ký tự", test: (value: string) => value.length >= 8 },
  { id: "upper", label: "Một chữ in hoa", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lower", label: "Một chữ thường", test: (value: string) => /[a-z]/.test(value) },
  { id: "number", label: "Một chữ số", test: (value: string) => /\d/.test(value) },
  { id: "special", label: "Một ký tự đặc biệt", test: (value: string) => /[@$!%*?&]/.test(value) },
] as const;

export const isStrongPassword = (value: string) =>
  passwordRules.every((rule) => rule.test(value));

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
