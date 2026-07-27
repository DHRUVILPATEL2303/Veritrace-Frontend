import { useTheme } from './providers/ExperienceProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme === 'dark' ? 'dark' : ''}`}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-clouds"></div>
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
      </div>
      <div className="theme-toggle-thumb">
        <div className="thumb-shape"></div>
        <div className="sun-rays">
          <div className="ray"></div><div className="ray"></div><div className="ray"></div>
          <div className="ray"></div><div className="ray"></div><div className="ray"></div>
          <div className="ray"></div><div className="ray"></div>
        </div>
      </div>
    </button>
  )
}
