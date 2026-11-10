'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LOGO_URL } from '@/lib/site'

/**
 * First-paint curtain: steel surface, logo, a flame bar filling, then the surface wipes upward.
 *
 * The whole sequence is CSS keyframes (900ms), so it finishes and gets out of the way even if
 * JavaScript is slow or never arrives. It never takes pointer events, and visitors who prefer
 * reduced motion do not get it at all. React only removes the finished node from the tree.
 */
const TOTAL_MS = 900

const css = `
.zl{position:fixed;inset:0;z-index:120;display:grid;place-items:center;pointer-events:none;background:var(--background);animation:zl-wipe ${TOTAL_MS}ms linear forwards}
.zl-inner{display:grid;justify-items:center;gap:1.5rem;animation:zl-rise 360ms var(--ease-out) both}
.zl-track{position:relative;width:8.5rem;height:3px;overflow:hidden;border-radius:999px;background:var(--secondary)}
.zl-bar{position:absolute;inset:0;transform-origin:left;animation:zl-fill 520ms var(--ease-out) 60ms both}
@keyframes zl-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes zl-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes zl-wipe{0%{clip-path:inset(0 0 0 0);visibility:visible}66%{clip-path:inset(0 0 0 0);animation-timing-function:var(--ease-in-out)}100%{clip-path:inset(0 0 100% 0);visibility:hidden}}
@media (prefers-reduced-motion: reduce){.zl{display:none}}
`

export function SiteLoader() {
  const [done, setDone] = useState(false)

  if (done) return null

  return (
    <div
      className="zl"
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.animationName === 'zl-wipe') setDone(true)
      }}
    >
      <style>{css}</style>
      <div className="zl-inner">
        <Image src={LOGO_URL} alt="" width={56} height={56} priority className="size-14 object-contain" />
        <div className="zl-track">
          <div className="zl-bar flame" />
        </div>
      </div>
    </div>
  )
}
