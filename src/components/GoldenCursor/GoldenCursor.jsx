import React, { useEffect, useRef } from 'react'
import './GoldenCursor.css'

export default function GoldenCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const rafRef = useRef(null)

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const dotPos = useRef({ ...mouse.current })
  const ringPos = useRef({ ...mouse.current })

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onDown = () => {
      ring.classList.add('gc-ring--active')
      dot.classList.add('gc-dot--active')
    }

    const onUp = () => {
      ring.classList.remove('gc-ring--active')
      dot.classList.remove('gc-dot--active')
    }

    // Detect hoverable elements for a subtle "target" state
    const onOverCheck = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-hover');
      ring.classList.toggle('gc-ring--hover', Boolean(isInteractive))
    }

    const lerp = (a, b, n) => (1 - n) * a + n * b

    const animate = () => {
      // Dot moves fast and precise
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.35)
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.35)
      dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`

      // Ring trails slightly behind, for a smooth premium feel
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.14)
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.14)
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`

      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousemove', onOverCheck)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousemove', onOverCheck)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div className="golden-cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="golden-cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}