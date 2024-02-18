// biome-ignore lint/suspicious/noConstEnum: <explanation>
export const enum ITEM {
  WRENCH = "wrench",
  KEYCARD = "keycard",
  KEY = "key",
  BREW = "brew",
  BOSS = "boss",
  GUN = "gun",
  HAT = "pilot cap",
}

export function isItem(str: string): str is ITEM {
  return [ITEM.BOSS, ITEM.BREW, ITEM.GUN, ITEM.HAT, ITEM.KEY, ITEM.KEYCARD, ITEM.WRENCH].includes(str as ITEM);
}

// biome-ignore lint/style/useEnumInitializers: <explanation>
export enum DEATHS {
  BREW, // ANY
  GUN, // ANY
  BOILER, // BOILA
  ABYSS, // GASRE
  MEATSAW, // PRISN
  FUZZLE, // STORG
  GAS, // SECUR
  __LENGTH,
}

/*
 N
W+E
 S
*/

export enum Directions {
  Forward = "N",
  Backward = "S",
  Left = "W",
  Right = "E",
}

export const DEATH_POS: [number, number] = [0, 0];
export const FINIS_POS: [number, number] = [0, 2];
export const STRIP_POS: [number, number] = [0, 4];
export const SPAWN_POS: [number, number] = [4, 4];
export const ELEVA_POS: [number, number] = [2, 4];
