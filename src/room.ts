import { DEATHS, Directions, ITEM, ROOM_NAME, isItem } from "./constants.ts";
import { show } from "./display.ts";
import { goBack, die, getDir, moveDir } from "./movement.ts";
import { player } from "./player.ts";

export type ActionKinds = "look" | "talk" | "press" | "take" | "use" | "enter" | "read" | "jump" | "open";
export type ActionFn = (args: Partial<{ what: string; tool: ITEM }>) => void;

type Actions = Partial<
  Record<
    ActionKinds,
    Array<{
      trigger: string[];
      action: ActionFn;
    }>
  >
>;

type CanMove = Partial<Record<Directions, () => boolean>>;

export type Flags<T extends string> = Record<T, boolean>;
export type ActionGenerator<T extends Flags<string>> = (flags: T) => Actions;

const helpMsg = `*Escape from RuptureFarms* is a text-based adventure game, similar in spirit to *Zork*.
You may move around with any of the following commands:
- *north* / *south* / *west* / *east*
- *n* / *s* / *w* / *e*
- *forward*(*s*) / *backward*(*s*) / *left* / *right*
- *f* / *b* / *l* / *r*
You can interact with the world using the following commands:
- *look around*
- *look at* <object>
- *use* <tool> *on* <subject> (<subject> may be *me* or *self* to use an item on yourself)
- *press* / *push* <object>
- *talk to* <someone>
- *take* / *pick up* <object>
- *go* / *enter* / *move to* <location> (use *go back* to enter the previous room)
- *read* <something>
- *jump* / *dive into* <somewhere>
- *open* <something>
- *inventory*
Some puzzles might be concealed or require special interaction before you can solve them, but no puzzle requires anything not mentioned here. Experiment!
If any problems come up, please complain to Nemin.`;

const invMap = new Map<ITEM, string>([
  [
    ITEM.BOSS,
    "Your knocked out boss. It's best not to disturb him any more than being carried on your boney back already does.",
  ],
  [ITEM.BREW, "A refreshing bottle of SoulStorm Brew. Extremely flammable, even more tasty."],
  [ITEM.GUN, "A gun with one bullet. A Slig's best friend... after a Slog, perhaps."],
  [ITEM.HAT, "A pilot's trustiest companion. Just having it on your head fills you with confidence."],
  [ITEM.KEY, "A small key with a tag on it that simply says 'FOR EMERGENCIES'."],
  [ITEM.KEYCARD, "A small gray keycard with the word 'SECURITY' stamped on it."],
  [ITEM.WRENCH, "A long, heavy-duty wrench, with a hexagonal slot."],
]);

const quipMap = new Map<string, string>([
  ["yeah you always say that", "No respect!"],
  ["yeah, you always say that", "No respect!"],
  ["this is rupturefarms", "Very astute, kid."],
  ["there's my buddy", "Buuurp."],
  ["theres my buddy", "Buuurp."],
  ["abe", "He won't get away with this."],
  ["new 'n' tasty", "Excessive consumption might lead to blindness."],
  ["new n tasty", "Excessive consumption might lead to blindness."],
  ["soulstorm", "Twice ze flavour."],
]);

const selfItems: Record<ITEM, () => void> = {
  [ITEM.BOSS]: () => show("You feel a gigantic wave of disgust wash over you."),
  [ITEM.BREW]: () => {
    if (!player.deaths.has(DEATHS.BREW)) {
      player.deaths.add(DEATHS.BREW);
      show(
        "You drink the Brew and pass out. Not even the approaching flames can disturb your slumber. You never wake up again.",
      );
      die();
    } else {
      show("Even though you're parched, drinking the Brew suddenly doesn't seem like that good of an idea.");
    }
  },
  [ITEM.GUN]: () => {
    if (!player.deaths.has(DEATHS.GUN)) {
      player.deaths.add(DEATHS.GUN);
      show(
        "You turn the gun towards your face and stare down the barrel. Neither dying under the rubble nor burning to death sound like very dignified deaths. Why not go out your own way? You slowly pull the trigger. Your ears barely register the bang as your body collapses on the ground and everything cuts to black.",
      );
      die();
    } else {
      show("No, that would not solve anything. You have to press on and see this to the end.");
    }
  },
  [ITEM.HAT]: () => show("You already have the hat on. Still, you give it an affectionate pat."),
  [ITEM.KEY]: () => show("Sadly there is no inner potential to unlock in you."),
  [ITEM.KEYCARD]: () => show("You use the keycard to clean some dirt from under your nails."),
  [ITEM.WRENCH]: () => show("Even if you do have a few screws loose, sadly a wrench won't let you tighten them."),
};

const cases: Array<[RegExp, ActionKinds]> = [
  [/(?:(look( at)?)|inspect)(?: the)? (?<what>.*)/, "look"],
  [/use(?: the)? (?<tool>.*) on(?: the)? (?<what>.*)/, "use"],
  [/(?:press|push)(?: the)? (?<what>.*)/, "press"],
  [/(?:take|pick up|get)(?: the)? (?<what>.*)/, "take"],
  [/talk (?:with |to )?(?: the)?(?<what>.*)/, "talk"],
  [/(?:(enter( the)?)|(move( to)?)|(go( to)?)) (?<what>.*)/, "enter"],
  [/(?:read)(?: the)? (?<what>.*)/, "read"],
  [/(?:jump|dive|pounce)(?: into(?: the)?)? (?<what>.*)/, "jump"],
  [/open (?<what>.*)/, "open"],
];

const YOURSELF = ["me", "yourself", "self", "player", "character"];

export class Room<T extends string> {
  printDescription() {
    show(this.description(this.flags));
  }

  actions: Actions;
  moves: CanMove;

  fallbacks: Record<ActionKinds, ActionFn> = {
    look: ({ what }) => show(`I can't see any ${what} here.`),
    enter: ({ what }) => show(`No. I can't enter the ${what}.`),
    jump: ({ what }) => show(`Not gonna jump into the ${what}.`),
    press: ({ what }) => show(`How would I even press the ${what}?`),
    take: ({ what }) => show(`I couldn't possibly take the ${what}.`),
    talk: ({ what }) => show(`Talk to ${what}? Are you stupid?`),
    read: ({ what }) => show(`I might be illiterate, but I can't read the ${what}.`),
    open: ({ what }) => show(`I don't know how to open the ${what}.`),
    use: ({ tool }) =>
      player.hasItem(tool as ITEM) ? show("No, I don't think that'd work.") : show(`I don't have that tool.`),
  };

  constructor(
    private flags: Flags<T>,
    actionGenerator: (flags: Flags<T>) => Actions,
    private description: (flags: Flags<T>) => string,
    private dirAliases: Record<string, Directions> = {},
    moveGenerator: (flags: Flags<T>) => CanMove = () => ({}),
  ) {
    this.actions = actionGenerator(this.flags);
    this.moves = moveGenerator(this.flags);
  }

  canMove(dir: Directions) {
    const opt = this.moves[dir];
    if (!opt) return true;

    return opt();
  }

  setFlag(flag: T, value: boolean) {
    this.flags[flag] = value;
  }

  getFlag(flag: T): boolean {
    return this.flags[flag];
  }

  findAction(act: ActionKinds, name: string): ActionFn {
    if (this.actions[act] === undefined) {
      return this.fallbacks[act];
    }

    const fn = this.actions[act]?.find(({ trigger, action }) =>
      trigger.map((t) => t.toLowerCase()).includes(name),
    )?.action;

    if (fn === undefined) {
      return this.fallbacks[act];
    }

    return fn;
  }

  doAction(input: string) {
    const quip = quipMap.get(input);
    if (quip) {
      show(quip);
      return;
    }

    if (input === "help") {
      show(helpMsg);
      return;
    }

    if (input === "inventory") {
      if (player.items.size === 0) {
        show("You don't have any items on you.");
        return;
      }

      const items = [...player.items.values()].map((i) => `- ${i}: ${invMap.get(i)}`).join("\n");
      show(`Your current possessions:\n${items}`);

      return;
    }

    player.stepCounter++;

    // Movement.
    const dir = getDir(input);
    if (dir) {
      if (this.canMove(dir)) {
        moveDir(dir);
      }

      return;
    }

    for (const [rx, action] of cases) {
      const res = input.match(rx);

      if (res === null || res.groups === undefined) {
        continue;
      }

      // Use item on self.
      if (action === "use" && YOURSELF.includes(res.groups.what) && res.groups.tool !== undefined) {
        const fn = selfItems[res.groups.tool];

        if (fn) {
          if (player.hasItem(res.groups.tool as ITEM)) {
            fn();
          } else {
            show("I don't have that item on me.");
          }
          return;
        }
      }

      const looksAround = action === "look" && ["around", "the room", "room"].includes(res.groups.what);
      const goesBack = action === "enter" && res.groups.what === "back";

      switch (true) {
        // Look around.
        case looksAround:
          this.printDescription();
          return;

        // Go back.
        case goesBack:
          goBack();
          return;

        // Enter special location.
        case action === "enter" && res.groups.what !== undefined: {
          const dir = this.dirAliases[res.groups.what] ?? getDir(res.groups.what);

          // Not an alias, but there might still be a special location to enter.
          if (!dir) {
            this.findAction(action, res.groups.what)(res.groups);
            return;
          }

          if (this.canMove(dir)) {
            moveDir(dir);
          }

          return;
        }

        // Use item.
        case action === "use": {
          if (res.groups.tool === undefined) {
            show("You need to specify what tool to use.");
          }

          // Item doesn't exist or you don't have it.
          const tool = res.groups.tool;
          if (!isItem(tool) || !player.hasItem(tool)) {
            show("You don't have any such tool.");
            return;
          }

          this.findAction(action, res.groups.what)(res.groups);
          return;
        }

        default:
          this.findAction(action, res.groups.what)(res.groups);
      }

      return;
    }

    player.stepCounter--;
    show("No idea what you just meant.");
  }
}
