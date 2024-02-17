import { move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<"noticedBrew" | "madeCall">;

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: ["junk", "trash"],
      action: () => {
        if (!player.hasItem(ITEM.BREW)) {
          show(
            "Huh. As you take a better look at the trash, you notice a perfectly preserved, unopened bottle of *SoulStorm Brew*. Who in their right mind would leave that sorta stuff just lying around?",
          );
          flags.noticedBrew = true;
        } else {
          show("Even with the bottle now gone, there is still a lot of junk. Nothing you'd consider useful though.");
        }
      },
    },
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          show(
            "Despite all odds, the gate is open and finally nothing keeps you from leaving. Never in your entire life have you been happier to see a dingy cargo elevator before.",
          );
        } else {
          show(
            "You catch glimpses of the cargo elevator through the metal bars of the gate. If only you were a Big Bro, maybe you could force the gate open long enough to crawl through, but with your wimpy arms the gate is as good as impenetrable. If you don't manage to open it somehow soon, you'll surely burn alive without anyone ever finding out.",
          );
        }
      },
    },
    {
      trigger: ["schedules", "schedule"],
      action: () =>
        show(
          "EXPORT:\nFeeCo Depot - Finished products (contact Sales about project New 'n' Tasty)\nBoneWerkz - Animal and otherwise byproducts\nSoulStorm Brewery - Disciplined personnel\n\nIMPORT:\nMeechtopia - Live Meeches (CANCELED)\nParamonia - Live Paramites (DELAYED)\nScrabania - Live Scrabs (DELAYED)",
        ),
    },
    {
      trigger: ["telephone", "phone"],
      action: () =>
        show(
          flags.madeCall
            ? "The ruins of a rotary phone."
            : "A simple rotary phone. As you inspect it from closer, the line appears unharmed. Perhaps there is still a chance to call for help?",
        ),
    },
  ],
  take: [
    {
      trigger: ["brew", "soulstorm", "SoulStorm Brew", "Soulstorm Brew", "Soulstorm brew"],
      action: () => {
        if (!flags.noticedBrew) {
          show("Yeah, you could use a brew right now, but you don't see any.");
          return;
        }

        if (!player.hasItem(ITEM.BREW)) {
          show("You carefully pocket the bottle.");
          player.addItem(ITEM.BREW);
        } else {
          show("As nice as it'd be to find two bottles of brew, you're not that lucky.");
        }
      },
    },
  ],
  talk: [
    {
      trigger: ["phone", "telephone"],
      action: () => {
        if (!flags.madeCall) {
          flags.madeCall = true;
          show(
            "You pick up the receiver and contact emergency services. They tell you they'll be available three to four weeks from now and thank you for your patience. Before you could say another word, the other end hangs up. Enraged, you pick up the machine and smash it against the floor. So much for the government.",
          );
        } else {
          show("No one will be making another call with this phone.");
        }
      },
    },
  ],
  enter: [
    {
      trigger: ["door"],
      action: () => move(ROOM_NAME.CORRA),
    },
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          move(ROOM_NAME.STRIP);
        } else {
          show("The gate remains locked and sadly you cannot phase though metal.");
        }
      },
    },
  ],
});

const description = (flags: flags) =>
  `One step from freedom. ${
    gctrl.getFlag("gateOpen")
      ? "The *gate* is wide open, you should hurry and get out already."
      : "Except for the ten-ton *gate* in front of you blocking the path."
  } Just a few hours ago this was an endlessly busy hub of wares coming and going from the Farms, using the freight elevator that connects the main corridor of the facility with the landing strip on the roof.\n*Schedules* are haphazardly stapled on the walls. There is a small, abandoned guard booth next to the gate, with a *telephone* inside. While the path between the two ends of the room is mostly clean, those stupid Mudokons never had too much finesse handling goods, so there is a lot of *junk* strewn around left and right.\nThe floor itself is covered in scratches from all the boxes being dragged around, with a visible path of rubbed-out metal connecting the elevator to the *door* into the factory.`;

export const eleva = new Room({ noticedBrew: false, madeCall: false }, actions, description);
