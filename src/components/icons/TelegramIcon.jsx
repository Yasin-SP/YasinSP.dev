function TelegramIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.91 3.79 20.3 20.84c-.27 1.21-.98 1.51-1.99.94l-5.5-4.06-2.66 2.56c-.29.29-.54.54-1.1.54l.4-5.6L19.4 6.9c.42-.37-.09-.58-.66-.21L7.5 13.3l-5.44-1.7c-1.18-.37-1.2-1.18.26-1.75L22.4 2.1c.98-.36 1.85.22 1.51 1.69z" />
    </svg>
  );
}

export default TelegramIcon;
