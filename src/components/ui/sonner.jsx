import { Toaster as Sonner } from "sonner"
import { useTheme } from "../providers/ExperienceProvider"

const Toaster = ({ ...props }) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-left"
      toastOptions={{
        style: {
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border-2)',
          borderRadius: '6px',
          boxShadow: 'var(--shadow-lg)',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
        },
      }}
      {...props} />
  );
}

export { Toaster }
