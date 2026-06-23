// [fork] Ghost strengths & weaknesses (factual Phasmophobia journal data, in Spanish).
// Keyed by the ghost's English id (matches ghosts.json "ghost"). s = fuerza, w = debilidad.
// The 5 datamined / not-live ghosts are flagged with datamined:true (their behavior text
// comes from the maintained "Dichos" data instead of hard-coded intel here).
var GHOST_INTEL = {
    "Spirit":      { s: "Ninguna fortaleza especial.", w: "El incienso evita que cace por mucho más tiempo." },
    "Wraith":      { s: "Puede teletransportarse junto a un jugador.", w: "Nunca pisa la sal (no deja huellas UV en ella)." },
    "Phantom":     { s: "Mirarla reduce la cordura más rápido.", w: "Una foto la hace desaparecer temporalmente." },
    "Poltergeist": { s: "Puede lanzar varios objetos a la vez.", w: "Casi inútil en salas sin objetos." },
    "Banshee":     { s: "Elige a un solo objetivo y lo persigue.", w: "El crucifijo es más efectivo (mayor rango)." },
    "Jinn":        { s: "Más rápida si te ve de lejos (con energía).", w: "Apaga el fusible: no puede acelerar." },
    "Mare":        { s: "Caza antes en la oscuridad.", w: "No puede encender luces; la luz reduce su caza." },
    "Revenant":    { s: "Muy rápida (3 m/s) cuando te persigue.", w: "Muy lenta (1 m/s) si no te ve: escóndete." },
    "Shade":       { s: "Tímida: difícil de provocar, caza a baja cordura.", w: "No caza si hay varios jugadores cerca." },
    "Demon":       { s: "Caza muy seguido y a cualquier cordura.", w: "El incienso reduce más su tiempo de espera." },
    "Yurei":       { s: "Reduce la cordura más al manifestarse.", w: "El incienso la encierra en su sala un tiempo." },
    "Oni":         { s: "Más activa y con más sucesos.", w: "Su actividad la delata; no hace niebla fantasma." },
    "Yokai":       { s: "Hablar cerca aumenta su prob. de caza (80%).", w: "En caza solo detecta voces muy cercanas (2,5 m)." },
    "Hantu":       { s: "Más rápida en salas frías.", w: "Más lenta en calor; enciende el generador." },
    "Goryo":       { s: "DOTS solo visible por cámara (sin gente en la sala).", w: "Rara vez se aleja de su sala." },
    "Myling":      { s: "Más silenciosa durante la caza (12 m).", w: "Hace sonidos paranormales más frecuentes." },
    "Onryo":       { s: "Caza al apagarse una llama.", w: "Mantén llamas encendidas para frenar sus cazas." },
    "The Twins":   { s: "Cualquiera de los dos gemelos puede cazar.", w: "Interactúan a la vez desde lugares distintos." },
    "Raiju":       { s: "Más rápida cerca de electrónica activa.", w: "Apaga la electrónica para ralentizarla." },
    "Obake":       { s: "A veces no deja huellas UV.", w: "Puede dejar una huella de 6 dedos (la delata)." },
    "The Mimic":   { s: "Imita las habilidades de otros fantasmas.", w: "Siempre muestra Orbes como pista extra." },
    "Moroi":       { s: "Maldice a quien oye sus sonidos (drena cordura).", w: "Cordura alta la ralentiza; el incienso la frena más." },
    "Deogen":      { s: "Siempre te encuentra: no puedes esconderte.", w: "Lentísima de cerca (0,4 m/s): corre y rodéala." },
    "Thaye":       { s: "Rápida y agresiva al inicio.", w: "Se debilita y ralentiza a medida que envejece." },
    // Datamined / not confirmed live — intel comes from the maintained behavior data.
    "Aswang":      { datamined: true },
    "Dayan":       { datamined: true },
    "Gallu":       { datamined: true },
    "Kormos":      { datamined: true },
    "Obambo":      { datamined: true }
};
