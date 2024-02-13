import { ActionGenerator, Flags, Room } from "../room.ts"
import { move } from "../adjacencies.ts"
import { show } from "../util.ts"
import { ROOM_NAME } from "../roomnames.ts"

type flags = Flags<never>

const actions: ActionGenerator<flags> = (_) => ({ 
  enter: [
    {
      trigger: ["chamber", "back"], 
      action: () => move(ROOM_NAME.SPAWN)
    },
    {
      trigger: ["left", "maintenance"],
      action: () => move(ROOM_NAME.CORRB)
    },
    {
      trigger: ["forward", "landing", "landing strip"],
      action: () => move(ROOM_NAME.ELEVA)
    },
    {
      trigger: ["right", "gate control", "control"],
      action: () => move(ROOM_NAME.GCTRL)
    }
  ],
  look: [
    {
      trigger: ["sign"],
      action: () => show("The sign is caked in rust and dirt. A challenge for a Mudokon, perhaps, but it's nothing your experienced eyes couldn't read.")
    }
  ],
  read: [
    {
      trigger: ["sign"],
      action: () => show("The sign reads:\n^  LANDING STRIP\n<- MAINTENANCE\n-> GATE CONTROL")
    }
  ],
})

const description = (flags: flags) => `You find yourself on a dull utility corridor. The door to the execution *chamber* looms behind you. You see a *sign* in front of you. Three other paths lead away in each cardinal direction.`

export const corra = new Room({}, actions, description)
