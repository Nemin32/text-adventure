import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM } from "../roomnames.ts";
import { GM, show } from "../util.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<"noticedBrew">

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: ["junk", "trash"],
      action: () => {
        if (!GM.hasItem(ITEM.BREW)) {
          show("Huh. As you take a better look at the trash, you notice an unopened bottle of *SoulStorm Brew*. Who in their right mind would leave that sorta stuff just lying around?")
          flags.noticedBrew = true;
        }
      }
    }
  ],
  take: [
    {
      trigger: ["brew", "soulstorm", "SoulStorm Brew", "Soulstorm Brew", "Soulstorm brew"],
      action: () => {
        if (!flags.noticedBrew) {
          show("Yeah, you could use a brew right now, but you don't see any.")
          return
        }

        if (!GM.hasItem(ITEM.BREW)) {
          show("You carefully pocket the bottle.")
          GM.addItem(ITEM.BREW)
        } else {
          show("As nice as it'd be to find two bottles of brew, you're not that lucky.")
        }
      }
    }
  ]
})

const description = (flags: flags) => `One step from freedom. ${gctrl.getFlag("gateOpen") ? "The gate is wide open, you should hurry." : "Except for the ten-ton gate in front of you blocking the path."} Just a few hours ago this was an endlessly busy hub of wares coming and going from the Farms. Of course, those stupid Mudokons never had too much finesse handling goods, so there is a lot of *junk* strewn around on the floor.`

export const eleva = new Room({noticedBrew: false}, actions, description)