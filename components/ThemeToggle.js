import { useState, useEffect } from 'react'
import { Moon, Sun } from '@geist-ui/react-icons'
import { Button } from '@geist-ui/react'

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.body.classList.toggle('dark-mode', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.body.classList.toggle('dark-mode', newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  return (
    <Button 
      onClick={toggleTheme} 
      iconRight={isDarkMode ? <Sun /> : <Moon />} 
      auto 
      type="secondary"
    />
  )
}
