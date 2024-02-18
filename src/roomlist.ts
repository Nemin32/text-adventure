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

const _____ = null;

export const gameMap: (Room<string> | null)[][] = [
  [death, _____, finis, _____, strip, _____],
  [_____, _____, _____, _____, _____, _____],
  [_____, storg, gasre, _____, eleva, _____],
  [_____, _____, corrc, corrb, corra, gctrl],
  [secur, loung, boila, _____, spawn, _____],
];
