
export enum ROOM_NAME {
  BOILA,
  CORRA,
  CORRB,
  ELEVA,
  GASTO,
  GCTRL,
  MAINT,
  SECUR,
  SPAWN,
  STRIP,
  STORG,
  DEATH
}

export const enum ITEM {
  WRENCH = "wrench",
  KEYCARD = "keycard",
  KEY = "key",
  BREW = "brew",
  BOSS = "boss",
  GUN = "gun",
}

export enum DEATH {
  BREW, // ANY
  BOILER, // BOILA
  ABYSS, // GASTO
  MEATSAW, // PRISN
  FUZZLE, // STORG
  __LENGTH
}