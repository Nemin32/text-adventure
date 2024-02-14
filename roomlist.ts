import { ROOM_NAME } from "./roomnames.ts"
import { Room } from "./room.ts"
import { corra } from "./rooms/corra.ts"
import { spawn } from "./rooms/spawn.ts"
import { corrb } from "./rooms/corrb.ts"
import { gctrl } from "./rooms/gctrl.ts"
import { gasre } from "./rooms/gasre.ts"
import { eleva } from "./rooms/eleva.ts"
import { death } from "./rooms/death.ts"
import { storg } from "./rooms/storg.ts"

export const rooms: Map<ROOM_NAME, Room<string>> = new Map([
  //["BOILA"]
  [ROOM_NAME.CORRA, corra],
  [ROOM_NAME.CORRB, corrb],
  [ROOM_NAME.ELEVA, eleva],
  [ROOM_NAME.GASRE, gasre],
  [ROOM_NAME.GCTRL, gctrl],
  //["MAINT"],
  //["SECUR"],
  [ROOM_NAME.SPAWN, spawn as Room<string>],
  //["STRIP"]
  [ROOM_NAME.STORG, storg],
  [ROOM_NAME.DEATH, death]
])