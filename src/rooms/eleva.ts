import { setRoom } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { Directions, ITEM, STRIP_POS } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<"noticedBrew" | "madeCall" | "brewTaken">;

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
          "Unlike everything else in the room, the schedules are surprisingly fresh. They were probably only posted a few days ago at most.",
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
    {
      trigger: ["door"],
      action: () => show("Yup, that's a door. It leads back into the depths of the facility."),
    },
  ],
  read: [
    {
      trigger: ["schedule", "schedules"],
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
            ? "You can't read something you've wrecked."
            : "For emergencies dial number 666. The costs will be deducted from your next paycheck.",
        ),
    },
  ],
  use: [
    {
      trigger: ["phone", "telephone"],
      action: ({ tool }) => {
        if (flags.madeCall) {
          show("A bit too late for that.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.GUN:
          case ITEM.BREW:
          case ITEM.WRENCH:
            show("You'd rather not wreck your one chance at getting help.");
            break;

          case ITEM.KEY:
          case ITEM.KEYCARD:
            show("The phone isn't locked.");
            break;

          case ITEM.BOSS:
            show("If only he wasn't unconscious... Surely they'd listen more to him.");
            break;

          case ITEM.HAT:
            show("With this hat on your head, you're far more confident about making calls.");
        }
      },
    },
    {
      trigger: ["gate"],
      action: ({ tool }) => {
        if (gctrl.getFlag("gateOpen")) {
          show("The gate is open. What are you waiting for?");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.WRENCH:
            show("You smash your wrench against the gate, but it just bounces off.");
            break;

          case ITEM.KEYCARD:
            show("There is no card reader on the gate.");
            break;

          case ITEM.KEY:
            show("The gate isn't 'locked' in this sense.");
            break;

          case ITEM.BREW:
            show("The explosion would be too weak to break the gate open.");
            break;

          case ITEM.GUN:
            show("One bullet wouldn't even dent the gate.");
            break;

          case ITEM.HAT:
            show("Somehow the gate refuses to open to your boyish charm.");
            break;

          case ITEM.BOSS:
            show("He's out cold. Not like he could help you open the gate anyway.");
        }
      },
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

        if (!flags.brewTaken) {
          show("You carefully pocket the bottle.");
          player.addItem(ITEM.BREW);
          flags.brewTaken = true;
        } else {
          show("As nice as it'd be to find two bottles of brew, you're not that lucky.");
        }
      },
    },
    {
      trigger: ["schedule", "schedules"],
      action: () => show("You don't see much point in taking these papers."),
    },
    {
      trigger: ["phone", "telephone"],
      action: () =>
        show(
          "You pick up the receiver, then place it back. Wait, isn't there something else you had to do between these two actions?",
        ),
    },
    {
      trigger: ["gate"],
      action: () => show("Sure, let's just casually pick up and chuck the ten-ton gate into your pocket. Idiot."),
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
    {
      trigger: ["gate"],
      action: () => show("You sternly ask the gate to open. It doesn't."),
    },
  ],
  enter: [
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          setRoom(STRIP_POS);
        } else {
          show("The gate remains locked and sadly you cannot phase though metal.");
        }
      },
    },
  ],
  open: [
    {
      trigger: ["gate"],
      action: () => show("You grab the gate by two arms, flex and... Nothing happens. What did you expect?"),
    },
  ],
});

const description = (flags: flags) =>
  `One step from freedom. ${
    gctrl.getFlag("gateOpen")
      ? "The *gate* is wide open, you should hurry and get out already."
      : "Except for the ten-ton *gate* in front of you blocking the path."
  } Just a few hours ago this was an endlessly busy hub of wares coming and going from the Farms, using the freight elevator that connects the main corridor of the facility with the landing strip on the roof.\n*Schedules* are haphazardly stapled on the walls. There is a small, abandoned guard booth next to the gate, with a *telephone* inside. While the path between the two ends of the room is mostly clean, those stupid Mudokons never had too much finesse handling goods, so there is a lot of *junk* strewn around left and right.\nThe floor itself is covered in scratches from all the boxes being dragged around, with a visible path of rubbed-out metal connecting the elevator to the *door* behind you leading back into the factory.`;

export const eleva = new Room({ noticedBrew: false, madeCall: false, brewTaken: false }, actions, description, {
  door: Directions.Backward,
});
