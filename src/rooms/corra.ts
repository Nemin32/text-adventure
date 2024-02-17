import { ActionGenerator, Flags, Room } from "../room.ts"
import { move } from "../movement.ts"
import { show } from "../display.ts"
import { ROOM_NAME } from "../constants.ts"

type flags = Flags<never>

const actions: ActionGenerator<flags> = (_) => ({ 
  enter: [
    {
      trigger: ["chamber", "behind"], 
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
      trigger: ["right", "gate control", "control", "gate"],
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

const description = (flags: flags) => "You find yourself on a dull utility corridor. The whole facility is dead silent, except for the slight whirring coming from the door to the execution *chamber* behind you. You see a *sign* on the wall in front of you. Three other paths lead away in each cardinal direction."

export const corra = new Room({}, actions, description)
