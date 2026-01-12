window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ======================================================
// PakePlus Android WebView Fix for x.com
// - Safe-area bottom navigation fix
// - Safe external link handling
// - Does NOT break SPA navigation
// ======================================================

(function () {
  /* ---------- utils ---------- */
  const isSameOrigin = (url) => {
    try {
      return new URL(url).origin === location.origin
    } catch {
      return false
    }
  }

  /* ---------- SAFE AREA FIX ---------- */
  const applySafeAreaFix = () => {
    const style = document.createElement('style')
    style.innerHTML = `
      html, body {
        height: 100%;
      }

      body {
        padding-bottom: env(safe-area-inset-bottom);
        box-sizing: border-box;
      }

      nav,
      footer,
      [role="navigation"],
      [data-testid="BottomBar"] {
        margin-bottom: env(safe-area-inset-bottom);
      }
    `
    document.head.appendChild(style)
  }

  /* ---------- LINK / POPUP FIX ---------- */
  const hookClick = (e) => {
    const a = e.target.closest('a')
    if (!a || !a.href) return

    // Do NOT touch internal SPA navigation
    if (isSameOrigin(a.href)) return

    const baseBlank = document.querySelector('head base[target="_blank"]')

    if (a.target === '_blank' || baseBlank) {
      e.preventDefault()
      location.href = a.href
    }
  }

  // Patch window.open safely
  const _open = window.open
  window.open = function (url, target, features) {
    if (url && !isSameOrigin(url)) {
      location.href = url
      return null
    }
    return _open.call(window, url, target, features)
  }

  /* ---------- INIT ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySafeAreaFix)
  } else {
    applySafeAreaFix()
  }

  document.addEventListener('click', hookClick, true)

  console.log('[PakePlus] Android WebView fix applied')
})()
