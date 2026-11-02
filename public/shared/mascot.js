/* 吉祥物（給純 HTML 的主題用）：從 /content/site.json 的 mascots 讀角色、表情與台詞。
   Shared mascot runtime for plain-HTML themes. React pages use components/mascot/ instead.

   用法 / Usage:
     <div data-mascot="chiyo" data-locale="zh"></div>
     <script src="/shared/mascot.js" defer></script>

   目前支援 kind = "images" 的角色（例如千代）：角色站在右下角，對話框依序輪播台詞，
   點角色或對話框換下一句，每句隨機換表情。台詞要改請改 content/mascots.json。
   window.siteBundle 是共用的 Promise，同一頁的其他程式可以直接拿來用，不會重抓。 */
(function () {
  var BUNDLE_URL = '/content/site.json'
  window.siteBundle =
    window.siteBundle ||
    fetch(BUNDLE_URL).then(function (res) {
      if (!res.ok) throw new Error('site.json ' + res.status)
      return res.json()
    })

  var TYPE_MS = 20
  var HOLD_MS = 3000
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var STYLE =
    ':host{all:initial}' +
    '.bubble{position:fixed;right:5px;bottom:250px;z-index:9999;max-width:200px;padding:10px;' +
    'background:rgba(0,115,230,.8);color:#fff;border:1px solid #707070;border-radius:3px;' +
    'box-shadow:1px 1px 4px rgba(0,0,0,.9);font:15px/1.4 "Open Sans","Microsoft JhengHei","PingFang TC",sans-serif;cursor:pointer}' +
    '.who{position:fixed;right:0;bottom:-20px;z-index:9998;max-height:270px;cursor:pointer}' +
    '.caret{display:inline-block;margin-left:1px;animation:blink .7s infinite}' +
    '@keyframes blink{50%{opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.caret{animation:none}}' +
    '@media (max-width:600px){.who{max-height:160px}.bubble{bottom:150px;max-width:160px;font-size:13px}}'

  function linesFor(mascot, locale) {
    var lines = mascot.lines || {}
    var preferred = lines[locale]
    if (preferred && preferred.length) return preferred
    return (lines.en && lines.en.length ? lines.en : lines.zh) || []
  }

  function mount(host, site) {
    var id = host.getAttribute('data-mascot')
    var locale = host.getAttribute('data-locale') || 'en'
    var mascot = site.mascots && site.mascots[id]
    if (!mascot || mascot.kind !== 'images') return
    var lines = linesFor(mascot, locale)
    var faces = mascot.images || []
    if (!lines.length || !faces.length) return

    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host
    var name = (mascot.name && (mascot.name[locale] || mascot.name.en)) || id
    root.innerHTML =
      '<style>' + STYLE + '</style>' +
      '<div class="bubble" role="status" aria-live="polite" title="Next line"><span class="text"></span><span class="caret">|</span></div>' +
      '<img class="who" alt="">'
    var bubble = root.querySelector('.bubble')
    var text = root.querySelector('.text')
    var img = root.querySelector('.who')
    img.alt = name
    img.title = name
    faces.forEach(function (src) {
      new Image().src = src
    })

    var index = Math.floor(Math.random() * lines.length)
    var holdTimer = null
    var typeTimer = null

    function stop() {
      clearTimeout(holdTimer)
      clearInterval(typeTimer)
    }
    function hold(line) {
      holdTimer = setTimeout(next, HOLD_MS + line.length * 40)
    }
    function show(line) {
      stop()
      img.src = faces[Math.floor(Math.random() * faces.length)]
      if (reduceMotion) {
        text.textContent = line
        hold(line)
        return
      }
      var i = 0
      text.textContent = ''
      typeTimer = setInterval(function () {
        i += 1
        text.textContent = line.slice(0, i)
        if (i >= line.length) {
          clearInterval(typeTimer)
          hold(line)
        }
      }, TYPE_MS)
    }
    function next() {
      index = (index + 1) % lines.length
      show(lines[index])
    }

    img.src = faces[0]
    img.addEventListener('click', next)
    bubble.addEventListener('click', next)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop()
      else next()
    })
    setTimeout(function () {
      show(lines[index])
    }, 1000)
  }

  function start() {
    var hosts = document.querySelectorAll('[data-mascot]')
    if (!hosts.length) return
    window.siteBundle
      .then(function (site) {
        Array.prototype.forEach.call(hosts, function (host) {
          mount(host, site)
        })
      })
      .catch(function () {
        /* 讀不到內容就不出場 */
      })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
})()
