// Reads the CURRENT episode's data (written by tools/use_episode.py into src/current/).
import linesData from "../current/lines.json";
import wordsData from "../current/words.json";
import mouthData from "../current/mouth.json";

export type Who = "noor" | "baba" | "narrator";
export type Fx = { on: string; who?: "noor" | "baba"; punch?: boolean; shake?: boolean; react?: "?!" | "!" | "stars" | "sweat" | "heart"; react_dur?: number; happy?: number; sound?: string };
export type Line = { i: number; who: Who; scene?: string | null; text: string; start: number; end: number; fx?: Fx[]; ambience?: string; sfx?: { on: string; sound: string }[] };
export type Word = { w: string; line: number; who: Who; s: number; e: number };
export type Meta = {
  id: string; book: string; author: string; part: string; question: string; duration: number;
  vote: { noor: string; baba: string }; next: string; book_open: { line: number; word: string };
  lines: Line[];
};

export const META = linesData as unknown as Meta;
export const L = META.lines;
export const WORDS = wordsData as Word[];
export const MOUTH = mouthData as unknown as Record<Who, number[]>;

const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
/** global start time (s) of `word` inside line `line` */
export const at = (word: string, line: number) => {
  const f = WORDS.find((x) => x.line === line && norm(x.w) === norm(word));
  if (!f) throw new Error(`cue word "${word}" not found in line ${line}`);
  return f.s;
};

/** props every story scene receives: t = global seconds, s0 = scene start (global), lt = t - s0 */
export type SceneProps = { t: number; lt: number; s0: number };
