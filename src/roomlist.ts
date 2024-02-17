import { ROOM_NAME } from "./constants.ts";
import { Room } from "./room.ts";
import { corra } from "./rooms/corra.ts";
import { spawn } from "./rooms/spawn.ts";
import { corrb } from "./rooms/corrb.ts";
import { gctrl } from "./rooms/gctrl.ts";
import { gasre } from "./rooms/gasre.ts";
import { eleva } from "./rooms/eleva.ts";
import { death } from "./rooms/death.ts";
import { storg } from "./rooms/storg.ts";
import { boila } from "./rooms/boila.ts";
import { secur } from "./rooms/secur.ts";
import { loung } from "./rooms/loung.ts";
import { strip } from "./rooms/strip.ts";
import { finis } from "./rooms/finis.ts";
import { corrc } from "./rooms/corrc.ts";

export const rooms: Map<ROOM_NAME, Room<string>> = new Map([
  [ROOM_NAME.BOILA, boila],
  [ROOM_NAME.CORRA, corra],
  [ROOM_NAME.CORRB, corrb],
  [ROOM_NAME.CORRC, corrc],
  [ROOM_NAME.ELEVA, eleva],
  [ROOM_NAME.GASRE, gasre],
  [ROOM_NAME.GCTRL, gctrl],
  [ROOM_NAME.LOUNG, loung],
  [ROOM_NAME.SECUR, secur],
  [ROOM_NAME.SPAWN, spawn],
  [ROOM_NAME.STRIP, strip],
  [ROOM_NAME.STORG, storg],
  [ROOM_NAME.FINIS, finis],
  [ROOM_NAME.DEATH, death as Room<string>],
]);

const _____ = null;

const { DEATH, FINIS, STORG, GASRE, ELEVA, CORRC, CORRA, CORRB, BOILA, GCTRL, LOUNG, SECUR, SPAWN, STRIP } = ROOM_NAME;
export const gameMap: (ROOM_NAME | null)[][] = [
  [DEATH, _____, FINIS, _____, STRIP, _____],
  [_____, _____, _____, _____, _____, _____],
  [_____, STORG, GASRE, _____, ELEVA, _____],
  [_____, _____, CORRC, CORRB, CORRA, GCTRL],
  [SECUR, LOUNG, BOILA, _____, SPAWN, _____],
];