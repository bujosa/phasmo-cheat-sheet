// [fork] Per-ghost survival/behavior categories for the evidence-first card + hunt mode.
// Compiled & verified via a multi-agent pass grounded in the local wiki data (2026-06).
// Fields are Spanish, short. 'Normal' = unremarkable for that category.
const GHOST_BEHAVIOR = {
  "Aswang": {
    "sight": "Normal, persigue por igual",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Velocidad de caza fija (1.53 m/s): nunca acelera ni frena",
    "hunt": "Caza desde 50%",
    "survivalTip": "Aprovecha que su caza dura el doble pero su velocidad es constante: rompe la línea de visión y rodea obstáculos."
  },
  "Banshee": {
    "sight": "Fija un objetivo: solo persigue a esa persona",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza desde 50%, pero según cordura del objetivo",
    "survivalTip": "Si no eres su objetivo, estás a salvo en la caza: deja que el blanco se esconda y aleja al fantasma."
  },
  "Dayan": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Rango amplio: lento (1.2) a muy rápido (2.25 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Puede ser muy veloz: no confíes en escapar corriendo, usa puertas y vueltas para perderlo."
  },
  "Demon": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza a cualquier cordura (incluso al 100%)",
    "survivalTip": "Puede cazar en cualquier momento: lleva crucifijo (rango +50% por nivel) y nunca te confíes con cordura alta."
  },
  "Deogen": {
    "sight": "Siempre te ve — no puedes esconderte",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Rapidísimo de lejos (3.0), lentísimo de cerca (0.4 m/s)",
    "hunt": "Caza desde 40%",
    "survivalTip": "Mantén la distancia y da vueltas: de cerca es lentísimo, así que rodéalo en círculos para sobrevivir."
  },
  "Gallu": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Velocidad moderada (1.36 a 1.955 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Velocidad cercana a la normal: esconderte y romper la línea de visión funciona bien."
  },
  "Goryo": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Casi no deambula y se queda en su sala: aléjate de su cuarto durante la caza y estarás más seguro."
  },
  "Hantu": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Más rápido en frío; lento con el breaker encendido",
    "movement": "Más veloz en salas frías (hasta 2.7), lento en calor (1.4 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Enciende el breaker y refúgiate en zonas cálidas: el calor lo frena y el frío lo acelera."
  },
  "Jinn": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Rápido con el breaker encendido; drena cordura cerca del breaker",
    "movement": "Veloz (2.5 m/s) si el breaker está encendido; normal si lo apagas",
    "hunt": "Caza al 50%",
    "survivalTip": "Apaga el breaker: pierde su velocidad y queda lento (1.7 m/s)."
  },
  "Kormos": {
    "sight": "Ciego sin LOS, pero detecta tu MOVIMIENTO (pseudo-LOS, acelera hacia tu última posición a 5m)",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Se acelera al ir hacia tu última ubicación detectada por movimiento",
    "hunt": "Caza al 50%; sprintar en su sala lo sube hasta ~70%",
    "survivalTip": "Camina, no corras: esprintar cerca dispara su caza. Quédate quieto para perderlo."
  },
  "Mare": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Prefiere oscuridad; apaga luces cercanas (4m) e incluso durante eventos. No puede encender luces",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 60% con luces apagadas, pero solo al 40% con luces encendidas",
    "survivalTip": "Mantén las luces encendidas en su sala: baja su umbral de caza al 40%."
  },
  "Moroi": {
    "sight": "Acelera en LOS continua hasta 3.71 m/s",
    "hearing": "Te maldice por sus susurros (escupitajos); reza para curarte. La maldición acelera tu drenaje de cordura",
    "light": "Normal",
    "movement": "Más rápido cuanto menor es tu cordura; alcanza 3.71 m/s en LOS continua",
    "hunt": "Caza al 50%",
    "survivalTip": "Mantén la cordura ALTA (pastillas) y rompe su LOS: es lentísimo con cordura alta."
  },
  "Myling": {
    "sight": "Normal",
    "hearing": "Más silencioso al cazar (pasos/gruñidos casi inaudibles a distancia), pero hace más sonidos paranormales en el parabólico",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 50%",
    "survivalTip": "No confíes en oírlo cazar: es muy silencioso. Vigila visualmente y escóndete pronto."
  },
  "Obake": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s); rara vez muda a forma 4 dedos durante la caza",
    "hunt": "Caza al 50%",
    "survivalTip": "Toma huellas rápido: las borra al doble de velocidad y a veces no deja ninguna."
  },
  "Obambo": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (~1.7 m/s)",
    "hunt": "Caza al 65% (umbral alto, caza temprano)",
    "survivalTip": "Caza pronto (65%): muévete con cuidado desde el inicio aunque tengas cordura alta."
  },
  "Oni": {
    "sight": "Normal (con LOS). Más visible: parpadea más en caza",
    "hearing": "Normal",
    "light": "Normal. No hace evento de niebla; drena 20% cordura en eventos",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 50%. Más activo con varios jugadores",
    "survivalTip": "Sepárate del grupo y vigila tu cordura: sus eventos drenan el doble."
  },
  "Onryo": {
    "sight": "Normal (con LOS)",
    "hearing": "Normal",
    "light": "Apaga llamas (actúan como crucifijo). No puede encender fuego",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 60%; a cualquier cordura tras apagar 3 llamas; bloqueado a 40% cerca de velas",
    "survivalTip": "Rodéate de velas encendidas para frenar cazas, pero no dejes que apague 3 seguidas."
  },
  "Phantom": {
    "sight": "Casi invisible durante la caza (difícil de ver)",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 50%",
    "survivalTip": "Hazle foto en evento/DOTS para hacerlo desaparecer; no confíes en verlo al esconderte."
  },
  "Poltergeist": {
    "sight": "Normal (con LOS)",
    "hearing": "Normal",
    "light": "Único que lanza objetos en sala iluminada",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza al 50%",
    "survivalTip": "Aléjate de salas con objetos sueltos: lanza uno cada 0.5s y drena cordura al impactar."
  },
  "Raiju": {
    "sight": "Normal (con LOS). Pierde el LOS-speed cuando está en rango de electrónica",
    "hearing": "Normal",
    "light": "Atraído a electrónica activa: muy rápido y caza antes cerca de ella",
    "movement": "Rápido (2.5 m/s) cerca de electrónica activa, 1.7 m/s lejos",
    "hunt": "Caza al 50%; hasta 65% cerca de equipo electrónico activo",
    "survivalTip": "Apaga y suelta toda electrónica lejos de ti: cerca de aparatos es imparable."
  },
  "Revenant": {
    "sight": "Sin LOS-speed. Te detecta por voz, electrónica o vista",
    "hearing": "Hablar lo activa: pasa a 3 m/s al detectarte",
    "light": "Normal (la electrónica activa también lo detecta)",
    "movement": "Lentísimo (1.0 m/s) sin detectarte, 3 m/s al detectarte",
    "hunt": "Caza al 50%",
    "survivalTip": "Cállate y quédate quieto escondido: sin detectarte va a 1 m/s y lo pierdes fácil."
  },
  "Shade": {
    "sight": "Normal (con LOS). No caza ni hace eventos en tu misma sala",
    "hearing": "Normal",
    "light": "Normal. No apaga llamas si estás en su sala",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza solo desde 35%; nunca si estás en su sala",
    "survivalTip": "Quédate en su misma sala: el tímido Shade no inicia caza contigo dentro."
  },
  "Spirit": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Esconderte y romper LoS funciona normal; tras incienso tarda 180s en cazar, aprovecha esa ventana extra."
  },
  "Thaye": {
    "sight": "Sin LoS: no te ve mejor por verte",
    "hearing": "Normal",
    "light": "Más activo y rápido cuando es joven",
    "movement": "Hasta 2.75 m/s joven, baja a 1.0 m/s al envejecer; NO acelera en LoS",
    "hunt": "Caza a 75% joven, hasta 15% viejo",
    "survivalTip": "Si ya envejeció es lentísimo: gana distancia caminando; al principio (joven y rápido) evita provocarlo."
  },
  "The Mimic": {
    "sight": "Copia al fantasma imitado",
    "hearing": "Copia al fantasma imitado",
    "light": "Copia al fantasma imitado",
    "movement": "Copia la velocidad del fantasma imitado (cambia cada 30-120s)",
    "hunt": "Copia el umbral del fantasma imitado (base 50%)",
    "survivalTip": "Imita a otro fantasma cada 30-120s: comportamiento impredecible, trátalo como el más peligroso posible y mantén distancia."
  },
  "The Twins": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "1.5 m/s desde rango normal, 1.9 m/s desde rango extendido (alterna)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Puede cazar más rápido (1.9 m/s) según qué gemelo inicie; rompe LoS y escóndete sin asumir velocidad lenta."
  },
  "Wraith": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s); puede teletransportarse a un jugador (EMF 2/5)",
    "hunt": "Caza desde 50%",
    "survivalTip": "La sal NO lo frena ni lo detecta: no confíes en ella; esconderte y romper LoS sigue funcionando."
  },
  "Yokai": {
    "sight": "Detección reducida a 2.5m durante la caza",
    "hearing": "Hablar cerca lo hace cazar hasta 80% de cordura",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza a 50%, hasta 80% si hablas en su sala",
    "survivalTip": "No hables cerca de él (caza hasta 80%); en caza guarda silencio y aléjate más de 2.5m, no te oye de lejos."
  },
  "Yurei": {
    "sight": "Normal",
    "hearing": "Normal",
    "light": "Normal",
    "movement": "Normal (1.7 m/s)",
    "hunt": "Caza desde 50%",
    "survivalTip": "Baja tu cordura 15% al cerrar puertas; inciénsalo para atraparlo 90s en su sala y darte tiempo de huir."
  }
};
