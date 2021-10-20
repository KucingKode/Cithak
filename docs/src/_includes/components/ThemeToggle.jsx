import React, { useEffect, useState } from 'react'

function ThemeToggle() {
  const [themeIndex, setThemeIndex] = useState(2)
  const themes = [
    {
      // light

      action: () => {
        document.body.classList.remove('dark')
      },
      icon: 'brightness-high',
    },
    {
      // dark

      action: () => {
        document.body.classList.add('dark')
      },
      icon: 'moon-fill',
    },
    {
      // system

      action: () => {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        )
          document.body.classList.add('dark')
      },
      icon: 'circle-half',
    },
  ]

  function getNextIndex() {
    return (themeIndex + 1) % themes.length
  }

  function toggleTheme(e, i) {
    e && e.preventDefault()

    setThemeIndex(i)
    themes[i].action()
  }

  useEffect(() => {
    // toggleTheme(undefined, 2)
  }, [])

  return (
    <a
      href="."
      id="theme-toggle"
      onClick={(e) => toggleTheme(e, getNextIndex())}
    >
      <div>
        <i className={'bi bi-' + themes[getNextIndex()].icon}></i>
      </div>
    </a>
  )
}

export default ThemeToggle
