/* [fork/standalone] Local replacement for the external zero-network copyShare.js
   (which was a render-blocking <script> in <head>). Provides ZNCopyShare(text, msg):
   copy to clipboard + a small toast. No network, no blocking. */
function ZNCopyShare(text, message) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
        }
    } catch (e) {}

    try {
        var t = document.createElement('div');
        t.textContent = (message || 'Copiado') + '  ✓';
        t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
            'background:#1c1c24;color:#cdb8ff;padding:10px 18px;border-radius:999px;' +
            'border:1px solid rgba(173,140,231,.5);z-index:99999;font-family:sans-serif;' +
            'font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,.45);pointer-events:none;';
        document.body.appendChild(t);
        setTimeout(function () {
            t.style.transition = 'opacity .4s';
            t.style.opacity = '0';
            setTimeout(function () { t.remove(); }, 400);
        }, 1500);
    } catch (e) {}
}
