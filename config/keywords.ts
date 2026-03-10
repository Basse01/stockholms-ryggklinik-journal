// Deepgram keyword boosting för Stockholms Ryggklinik
// Format: "term:booster" — booster 1.0-2.0 (högre = starkare boost)
// Fokus: termer som är svåra för generisk svenska STT att känna igen

export const deepgramKeywords: string[] = [
  // Anatomi — kotpelare
  "cervikala:2",
  "thorakala:2",
  "lumbala:2",
  "sacrum:2",
  "sacroiliaka:2",
  "coccyx:1.5",
  "atlas:1.5",
  "axis:1.5",
  "skapula:2",
  "glenohumeralled:2",

  // Muskler
  "trapezius:2",
  "piriformis:2",
  "iliopsoas:2",
  "rhomboideus:2",
  "quadratus:2",
  "gluteus:1.5",
  "levator scapulae:2",
  "erector spinae:2",
  "hamstrings:1.5",

  // Diagnoser
  "lumbalgi:2",
  "cervikalgi:2",
  "thorakalgi:2",
  "ischialgi:2",
  "diskbråck:1.5",
  "subluxation:2",
  "spondylolistes:2",
  "anterolisthesis:2",
  "retrolisthesis:2",
  "whiplash:1.5",
  "impingement:1.5",
  "tendinit:1.5",
  "bursit:1.5",
  "spinal stenos:2",

  // Kliniska fynd
  "triggerpunkt:2",
  "hypertonus:2",
  "parestesier:2",
  "krepitation:2",
  "hypomobilitet:2",
  "hypermobilitet:2",
  "myofasciell:2",
  "fasciell:1.5",
  "vävnadsrestriktion:2",
  "adhesioner:1.5",
  "morgonstelhet:1.5",

  // Ortopediska test
  "Lasègue:2",
  "FABER:2",
  "FADIR:2",
  "Spurlings:2",
  "Trendelenburg:2",
  "Hawkins:1.5",
  "SLR:1.5",
  "ULTT:2",
  "Kemps:1.5",

  // Behandling
  "HVLA:2",
  "manipulation:1.5",
  "mobilisering:1.5",
  "traktionsbehandling:2",
  "tejpning:1.5",
  "Gonstead:2",
  "Activator:2",
  "CTM:2",
  "PNF:2",
  "MET:2",
  "PIR:2",
  "dry needling:2",
];

export function buildKeywordsParam(): string {
  return deepgramKeywords
    .map((kw) => `keywords=${encodeURIComponent(kw)}`)
    .join("&");
}
