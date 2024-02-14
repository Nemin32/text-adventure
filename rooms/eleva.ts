import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../roomnames.ts";
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
        } else {
          show("Even with the bottle now gone, there is still a lot of junk. Nothing useful though.")
        }
      }
    },
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          show("Despite all odds, the gate is open and nothing keeps you from leaving. You've never been happier to see the dingy cargo elevator in front of you leading to the landing strip above.")
        } else {
          show("You catch glimpses of the cargo elevator through the metal bars of the gate. If you were a Big Bro, maybe you could force the gate open long enough to crawl through. But with your wimpy arms and not even a gun at hand, the gate is as good as impenetrable. If you don't manage to open it somehow, you'll burn alive without anyone ever finding out.")
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
  ],
  enter: [
    {
      trigger: ["door"],
      action: () => move(ROOM_NAME.CORRA)
    }
  ]
})

const description = (flags: flags) => `One step from freedom. ${gctrl.getFlag("gateOpen") ? "The *gate* is wide open, you should hurry and get out already." : "Except for the ten-ton *gate* in front of you blocking the path."} Just a few hours ago this was an endlessly busy hub of wares coming and going from the Farms, using the freight elevator that connects the main corridor of the facility with the landing strip on the roof. *Schedules* are haphazardly stapled on the walls. There is a small, abandoned guard booth next to the gate, with a *telephone* inside. The floor is covered in scratches from all the boxes being dragged around, a visible path of rubbed out metal connecting the elevator to the *door* into the factory. While the path itself is empty, those stupid Mudokons never had too much finesse handling goods, so there is a lot of *junk* strewn around left and right.`

export const eleva = new Room({noticedBrew: false}, actions, description)