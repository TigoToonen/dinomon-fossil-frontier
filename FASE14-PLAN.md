# FASE 14 — Mobile-proof ✅ (gebouwd via feedbackloop, 4 testrondes)

## Gevonden & gefixt
- [x] **Touch-knoppen waren nooit aangesloten**: `setupTouchControls` werd niet
      aangeroepen vanuit init() én zocht op niet-bestaande class-selectors
      (`.btn-a` i.p.v. `#btn-a`) — gerepareerd op ID's, incl. SELECT-knop
- [x] **Audio-unlock**: mobiele browsers starten audio pas na een touch-gebaar —
      eerste tik initialiseert de AudioContext (+ bevestigings-blipje)
- [x] **Naam-invoer op mobiel**: verborgen invoerveld — tik op het scherm tijdens
      een invoerscherm opent het virtuele toetsenbord; waarde sync't live naar de
      buffer, Enter bevestigt (getest: focus ✓ → "Mobi" in buffer ✓ → bevestigd ✓)
- [x] **CSS**: knoppen ook op brede touch-apparaten (`pointer: coarse`, landscape),
      safe-area-insets, geen scroll/zoom/tekstselectie (`touch-action: none`),
      canvas full-width + game bovenaan in portret, web-app meta-tags
- [x] Cache-busting (style.css ?v=3, input ?v=81, main ?v=85)

## Testrondes (gesimuleerde touch-events)
- [x] R1: A-knop → save geladen; d-pad vasthouden → speler liep 2 tegels; START → menu
- [x] R2: mobiel viewport (375×812) → knoppen `flex`, invoerveld-flow end-to-end
- [x] R3: viewport-eenheden-artefact in de preview gediagnosticeerd (matchMedia wél,
      vw/vh niet geëmuleerd) — media-regel bewezen werkend; portret-layout gehard
- [x] R4: desktop-regressie — toetsenbord werkt, knoppen verborgen, save intact, 0 errors

## Spelen op je telefoon
1. Zelfde wifi als de pc; start de server (Start DinoMon.bat)
2. Op de pc: `ipconfig` in een terminal → noteer het IPv4-adres
3. Op je telefoon: `http://<dat-adres>:8080` — firewall-prompt op de pc: toestaan
4. Permanent & overal: fase 5a (GitHub Pages)
