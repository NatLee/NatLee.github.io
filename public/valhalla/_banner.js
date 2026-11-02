/* 英靈殿的小膠囊：每個主題的頁面都會注入（scripts/valhalla/build-theme.mjs），連回大廳與目前的主題 Persimmon。
   Valhalla pill injected into every theme page; links back to the hall and to the current theme.
   用 Shadow DOM 隔離樣式，不受主題 CSS 影響；載入完成後才掛上，避免干擾 React hydration。 */
(function () {
  var script = document.currentScript
  var id = (script && script.getAttribute('data-valhalla')) || ''
  var THEMES = {
    aerial: { label: 'Aerial', era: '2015' },
    bonfire: { label: 'Bonfire', era: '2018' },
    flat: { label: 'Flat', era: '2025' },
    terminal: { label: 'Terminal', era: '2026' },
    stonk: { label: 'Stonk', era: '2026' },
  }
  var info = THEMES[id] || { label: id, era: '' }
  var KEY = 'valhalla-pill-hidden'

  function hidden() {
    try {
      return sessionStorage.getItem(KEY) === '1'
    } catch (e) {
      return false
    }
  }

  function build() {
    var host = document.createElement('div')
    host.id = 'valhalla-pill'
    host.setAttribute('style', 'all:initial;position:fixed;left:12px;bottom:12px;z-index:2147483647')
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host
    root.innerHTML =
      '<style>' +
      '.p{display:flex;align-items:center;gap:10px;font:500 12px/1.3 ui-monospace,"JetBrains Mono",Consolas,monospace;' +
      'background:#1a1214;color:#efe5e1;border:1px solid #f28a38;border-radius:999px;padding:7px 8px 7px 14px;' +
      'box-shadow:0 6px 20px -8px rgba(0,0,0,.6)}' +
      'a{color:#8de6cf;text-decoration:none}a:hover{text-decoration:underline}' +
      '.v{color:#f28a38;font-weight:700}.e{color:#b9a8a6}' +
      'button{all:unset;cursor:pointer;color:#b9a8a6;width:20px;height:20px;display:grid;place-items:center;border-radius:50%}' +
      'button:hover{background:#32282b;color:#fff}button:focus-visible,a:focus-visible{outline:2px solid #f28a38;outline-offset:2px}' +
      '@media (max-width:480px){.e{display:none}}' +
      '</style>' +
      '<div class="p" role="note" aria-label="Valhalla theme">' +
      '<a href="/valhalla/">← Valhalla</a>' +
      '<span><span class="v">' + info.label + '</span> <span class="e">' + info.era + '</span></span>' +
      '<a href="/" title="Back to the current theme">Persimmon →</a>' +
      '<button type="button" aria-label="Hide">×</button>' +
      '</div>'
    root.querySelector('button').addEventListener('click', function () {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch (e) {}
      host.remove()
    })
    return host
  }

  function mount() {
    if (hidden() || document.getElementById('valhalla-pill') || !document.body) return
    document.body.appendChild(build())
  }

  function start() {
    // 等主題的 React 接手完畢再掛上；之後若被重繪拿掉，就補回來。
    setTimeout(mount, 600)
    setInterval(mount, 2000)
  }

  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start)
})()
