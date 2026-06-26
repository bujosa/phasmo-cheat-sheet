# Unofficial Phasmo Cheat Sheet

A client facing web-app guide for the horror video game Phasmophobia.

---

## 🛠️ Fork (standalone · español)

This is a personal, **fully self-contained** fork of
[tybayn/phasmo-cheat-sheet](https://github.com/tybayn/phasmo-cheat-sheet): it runs
from the repo with **no internet** and no Zero-Network account — all ghost data,
maps, images, fonts and sounds are bundled locally. UI defaults to **Spanish**
(English kept only as the translation fallback). Other languages, CJK fonts and the
desktop-launcher installers were removed to keep it lean.

- **Estado de los datos:** actualizados al **25 de junio de 2026** (parche de
  Phasmophobia vigente a esa fecha — 24 fantasmas estándar + Dayan).
- **¿Cómo actualizar?** Si Phasmophobia saca **fantasmas, reglas o mapas nuevos**,
  el dato vive en el repo del autor original. Pasos:
  1. Mira los cambios en el [repo original](https://github.com/tybayn/phasmo-cheat-sheet)
     (o su sitio en vivo) para ver qué cambió.
  2. Vuelve a bajar el snapshot de datos: `./scripts/update-data.sh`
     (refresca `data-local/`: fantasmas, mapas, retos, idiomas).
  3. Revisa que la lógica de filtros (`scripts-v10/filter-v15.js`), las pruebas
     activas (`scripts-v10/filter-v15.js` → `ACTIVE_TESTS`) y los comportamientos
     (`scripts-v10/ghost-behavior-v1.js` / `ghost-intel-v1.js`) cubran lo nuevo.
  4. Para mapas nuevos, baja sus imágenes a `imgs/maps/` (ver
     [`data-local/README.md`](data-local/README.md)).

Run it locally with any static server, e.g.: `python3 -m http.server 8123`

---

## Copyright Notice

This repository may contain some left over assets from Phasmophobia (used with permission) that are needed for this website to run. These assets are excluded from the license and may not be used without permission from Kinetic Games. 

`Phasmophobia, the Phasmophobia logo, and any game related info, images, or sounds (specifically footstep sounds, banshee scream, and deogen breathing) are either ® or TM, Kinetic Games Limited. Any assets used  within this site are used with direct permission from Kinetic Games.`

`The Zero-Network "Unofficial Phasmophobia Cheat Sheet" is not created by nor affiliated with Kinetic Games, its developers, or partners. This service is created by an independent third party.`

`This service is created as an educational tool for the Phasmophobia community, no copyright infringement intended.`

---
`Fair Use Disclaimer:`

`Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship and research. Fair use is a use permitted by copyright statute that might otherwise be infringing.`

---
`The website itself, its design, layout, and functionality are copyrighted by Ty Bayn (Zero-Network).`

## Derivative Works

It is understandable that one may want to fork this repository and modify it for a different game. We encourage this! Please be mindful of the permissions, conditions, and limitations of the GNU AGPLv3 license.

NOTE: By using this code, you agree to not use any included, external URLs present in the code in your derived works as they likely link to copyrighted material or non-privileged resources.

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)

With the exception of:  
JQuery - MIT License  
October Crow Font - Custom License  
Caveat Font - STL Open Font License  
Troubleside Font - SIL Open Font License (OFL)  
Zaychik Font - CC, Zaychik is developed by Maria Khmelevskaya at HSE ART AND DESIGN SCHOOL