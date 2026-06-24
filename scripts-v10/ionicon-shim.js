/* [fork/standalone] Tiny local replacement for the ionicons web component.
   The app only ever uses <ion-icon name="play"> / name="pause" (timer buttons),
   so this ~20-line custom element renders just those — no unpkg CDN, no 6 files. */
(function () {
    var SVGS = {
        play: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>'
    };
    if (window.customElements && !customElements.get('ion-icon')) {
        class IonIcon extends HTMLElement {
            static get observedAttributes() { return ['name']; }
            connectedCallback() { this.render(); }
            attributeChangedCallback() { this.render(); }
            render() {
                var n = this.getAttribute('name') || 'play';
                this.innerHTML = SVGS[n] || SVGS.play;
            }
        }
        customElements.define('ion-icon', IonIcon);
    }
})();
