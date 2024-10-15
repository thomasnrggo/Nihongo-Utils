import * as wanakana from 'wanakana';

export type VerbGroup = 1 | 2 | 3;

export interface VerbConjugation {
  dictionary: string;
  masu: string;
  te: string;
  nai: string;
  ta: string;
}

const verbosExcepcionesGrupo1 = [
  "走る", "切る", "入る", "知る", "要る", "帰る", "限る", "蹴る", "滑る", "喋る"
];

export function getVerbGroup(verb: string): VerbGroup {
  if (verb === "する" || verb === "来る") {
    return 3; // Grupo 3 (irregular)
  } else if (verbosExcepcionesGrupo1.includes(verb)) {
    return 1; // Grupo 1 (excepción)
  } else if (wanakana.isHiragana(verb) || wanakana.isKanji(verb)) {
    if (verb.endsWith("いる") || verb.endsWith("える")) {
      return 2; // Grupo 2 (Ichidan)
    }
    return 1; // Grupo 1 (Godan)
  } else if (wanakana.isKatakana(verb) || verb.endsWith("ます")) {
    const verbStem = verb.slice(0, -2);
    if (verbStem.endsWith("し")) {
      return 3; // Grupo 3 (irregular)
    } else if (verbosExcepcionesGrupo1.some(v => v.startsWith(verbStem))) {
      return 1; // Grupo 1 (excepción)
    } else if (verbStem.endsWith("い") || verbStem.endsWith("え")) {
      return 2; // Grupo 2 (Ichidan)
    }
    return 1; // Grupo 1 (Godan)
  }
  return 1; // Asumir Grupo 1 si no se cumplen otras condiciones
}

export function conjugateVerb(verb: string, group: VerbGroup): VerbConjugation {
  let stem = verb.slice(0, -1);
  switch (group) {
    case 1:
      return {
        dictionary: verb,
        masu: stem + "ります",
        te: stem + "って",
        nai: stem + "らない",
        ta: stem + "った",
      };
    case 2:
      return {
        dictionary: verb,
        masu: stem + "ます",
        te: stem + "て",
        nai: stem + "ない",
        ta: stem + "た",
      };
    case 3:
      if (verb === "する") {
        return {
          dictionary: "する",
          masu: "します",
          te: "して",
          nai: "しない",
          ta: "した",
        };
      } else if (verb === "来る") {
        return {
          dictionary: "来る",
          masu: "来ます",
          te: "来て",
          nai: "来ない",
          ta: "来た",
        };
      }
      break;
  }
  throw new Error("Verbo no reconocido para la conjugación");
}

export function identifyAndConjugate(verbInput: string): VerbConjugation {
  // Convertir rōmaji a hiragana si es necesario
  const verb = wanakana.toHiragana(verbInput);
  const group = getVerbGroup(verb);
  return conjugateVerb(verb, group);
}
