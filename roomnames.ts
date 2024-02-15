
export enum ROOM_NAME {
  BOILA,
  CORRA,
  CORRB,
  ELEVA,
  GASRE,
  GCTRL,
  LOUNG,
  SECUR,
  SPAWN,
  STRIP,
  STORG,

  DEATH,
  WIN
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

export enum DEATH {
  BREW, // ANY
  BOILER, // BOILA
  ABYSS, // GASRE
  MEATSAW, // PRISN
  FUZZLE, // STORG
  GAS, // SECUR
  __LENGTH
}