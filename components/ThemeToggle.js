import { useState, useEffect } from 'react'
import { Sun } from '@geist-ui/react-icons'
import { Button } from '@geist-ui/react'

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // This app uses one dark visual system. Normalize legacy light preferences.
    setIsDarkMode(true)
    document.body.classList.add('dark-mode')
    document.body.classList.remove('light-mode')
    localStorage.setItem('theme', 'dark')
  }, [])

  const keepDarkMode = () => {
    setIsDarkMode(true)
    document.body.classList.add('dark-mode')
    document.body.classList.remove('light-mode')
    localStorage.setItem('theme', 'dark')
  }

  return (
    <Button
      onClick={keepDarkMode}
      iconRight={<Sun />}
      auto
      type="secondary"
      aria-label="Dark mode aktif"
    />
  )
}
