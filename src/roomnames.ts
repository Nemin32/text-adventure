
export enum ROOM_NAME {
  BOILA = "BOILA ",
  CORRA = "CORRA ",
  CORRB = "CORRB ",
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
export  enum DEATH {
  BREW, // ANY
  GUN, // ANY
  BOILER, // BOILA
  ABYSS, // GASRE
  MEATSAW, // PRISN
  FUZZLE, // STORG
  GAS, // SECUR
  __LENGTH
}