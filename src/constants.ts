
export enum ROOM_NAME {
  BOILA = "BOILA ",
  CORRA = "CORRA ",
  CORRB = "CORRB ",
  CORRC = "CORRC",
  ELEVA = "ELEVA ",
  GASRE = "GASRE ",
  GCTRL = "GCTRL ",
  LOUNG = "LOUNG ",
  SECUR = "SECUR ",
  SPAWN = "SPAWN ",
  STRIP = "STRIP ",
  STORG = "STORG ",

  DEATH = "DEATH",
  FINIS = "FINIS"
}

// biome-ignore lint/suspicious/noConstEnum: <explanation>
export  const enum ITEM {
  WRENCH = "wrench",
  KEYCARD = "keycard",
  KEY = "key",
  BREW = "brew",
  BOSS = "boss",
  GUN = "gun",
  HAT = "pilot cap"
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
  __LENGTH
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
  Right = "E"
}

const empty = null;
const {DEATH, FINIS, CORRA, CORRB, CORRC, GCTRL, STORG, ELEVA, LOUNG, SECUR, SPAWN, BOILA, GASRE} = ROOM_NAME

export const gameMap: (ROOM_NAME | null)[][] = [
  [DEATH, empty, FINIS, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty],
  [empty, STORG, GASRE, empty, ELEVA, empty],
  [empty, empty, CORRC, CORRB, CORRA, GCTRL],
  [SECUR, LOUNG, BOILA, empty, SPAWN, empty]
]

export const DEATH_POS: [number, number] = [0,0]
export const FINIS_POS: [number, number] = [0,2]
export const SPAWN_POS: [number, number] = [4,4]
