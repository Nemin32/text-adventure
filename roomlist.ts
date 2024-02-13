import { ROOM_NAME } from "./roomnames.ts"
import { Room } from "./room.ts"
import { corra } from "./rooms/corra.ts"
import { spawn } from "./rooms/spawn.ts"
import { corrb } from "./rooms/corrb.ts"

export const rooms: Map<ROOM_NAME, Room<string>> = new Map([
  //["BOILA"]
  [ROOM_NAME.CORRA, corra],
  [ROOM_NAME.CORRB, corrb],
  //["ELEVA"]
  //["GASPI"]
  //["GCTRL"],
  //["MAINT"],
  //["SECUR"],
  [ROOM_NAME.SPAWN, spawn as Room<string>],
  //["STRIP"]
  //["WRBOX"],
])