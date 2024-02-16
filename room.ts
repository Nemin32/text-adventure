import { die, goBack, move } from "./adjacencies.ts";
import { DEATH, ITEM, ROOM_NAME } from "./roomnames.ts";
import { show } from "./util.ts";
import { GM } from "./gm.ts";

export type ActionKinds = "look" | "talk" | "press" | "take" | "use" | "enter" | "read" | "jump" | "open"
export type ActionFn = (args: Record<string, string>) => void

type Actions = Partial<Record<ActionKinds,
  Array<{
    trigger: string[], 
    action: ActionFn
  }>
>>;

export type Flags<T extends string> = Record<T, boolean>
export type ActionGenerator<T extends Flags<string>> = (flags: T) => Actions

export class Room<T extends string> {
  printDescription() {
    show(this.description(this.flags))
  }

  actions: Actions;

  fallbacks: Record<ActionKinds, ActionFn> = {
    look: ({what}) => show(`I can't see any ${what} here.`),
    enter: ({what}) => show(`No. I can't enter the ${what}.`),
    jump: ({what}) => show(`Not gonna jump into the ${what}.`),
    press: ({what}) => show(`How would I even press the ${what}?`),
    take: ({what}) => show(`I couldn't possibly take the ${what}.`),
    talk: ({what}) => show(`Talk to ${what}? Are you stupid?`),
    read: ({what}) => show(`I might be illiterate, but I can't read the ${what}.`),
    open: ({what}) => show(`I can't exactly open the ${what}.`),
    use: ({what, tool}) => (GM.hasItem(tool as ITEM) ? show(`How would I even use ${tool} on ${what}?`) : show(`I don't have that tool.`))
  }

  constructor(private flags: Flags<T>, actionGenerator: (flags: Flags<T>) => Actions, private description: (flags: Flags<T>) => string) {
    this.actions = actionGenerator(this.flags)
  }

  setFlag(flag: T, value: boolean) {
    this.flags[flag] = value;
  }

  getFlag(flag: T): boolean {
    return this.flags[flag];
  }

  findAction(act: ActionKinds, name: string): ActionFn {
    if (this.actions[act] === undefined) {
      return this.fallbacks[act]
    }

    const fn = this.actions[act]?.find(({trigger, action}) => trigger.includes(name))?.action

    if (fn === undefined) {
      return this.fallbacks[act]
    }

    return fn
  }

  doAction(input: string) {
    const cases: Array<[RegExp, ActionKinds]>  = [
      [/(?:(look( at)?)|inspect)(?: the)? (?<what>.*)/, "look"],
      [/use(?: the)? (?<tool>.*) on(?: the)? (?<what>.*)/, "use"],
      [/(?:press|push)(?: the)? (?<what>.*)/, "press"],
      [/(?:take|pick up)(?: the)? (?<what>.*)/, "take"],
      [/talk (?:with |to )?(?: the)?(?<what>.*)/, "talk"],
      [/(?:enter(?: the)?|(?:move(?: to)?)|go) (?<what>.*)/, "enter"],
      [/(?:read)(?: the)? (?<what>.*)/, "read"],
      [/(?:jump|dive|pounce)(?: into(?: the)?)? (?<what>.*)/, "jump"],
      [/open (?<what>.*)/, "open"]
    ]

    const YOURSELF = ["me", "yourself", "self", "player", "character"]

    if (input === "help") {
      const helpMsg = `Escape from RuptureFarms is a text-based adventure game, similar in spirit to Zork.
You interact with the world using the following text commands:

- look around
- look at <object>
- use <tool> on <subject> (<subject> may be "me" or "self" to use an item on yourself)
- press / push <object>
- talk to <someone>
- go / enter / move to <location> (use "go back" to enter the previous room)
- read <something>
- jump / dive into <somewhere>
- open <something>
- inventory

Some puzzles might be concealed or require special interaction before you can solve them, but no puzzle requires anything not mentioned here. Experiment!
If any problems come up, please complain to Nemin.`

      show(helpMsg)
      return
    }

    if (input === "inventory") {
      if (GM.items.size === 0) {
        show("You don't have any items on you.")
        return;
      }

      const invMap = new Map<ITEM, string>([
        [ITEM.BOSS, "Your knocked out boss. It's best not to disturb him any more than being carried on your boney back already does."],
        [ITEM.BREW, "A refreshing bottle of SoulStorm Brew. Extremely flammable, even more tasty."],
        [ITEM.GUN, "A gun with one bullet. A Slig's best friend... after a Slog, perhaps."],
        [ITEM.HAT, "A pilot's trustiest companion. Just having it on your head fills you with confidence."],
        [ITEM.KEY, "A small key with a tag on it that simply says 'FOR EMERGENCIES'."],
        [ITEM.KEYCARD, "A small gray keycard with the word 'SECURITY' stamped on it."],
        [ITEM.WRENCH, "A long, heavy-duty wrench, with a hexagonal slot."]
      ])

      const items = [...GM.items.values()].map(i => `- ${i}: ${invMap.get(i)}`).join("\n")
      show(`Your current possessions:\n${items}`)

      return;
    }

    for (const [rx, action] of cases) {
      const res = input.match(rx)

      if (res !== null) {
        if (res.groups) {
          if (action === "enter" && res.groups.what === "back") {
            goBack()
            return;
          }

          const canShoot = action === "use" 
            && YOURSELF.includes(res.groups.what) 
            && res.groups.tool === ITEM.GUN 
            && GM.hasItem(ITEM.GUN)

          if (canShoot) {
            if (!GM.deaths.has(DEATH.GUN)) {
              GM.deaths.add(DEATH.GUN)
              show("You turn the gun towards your face and stare down the barrel. Neither dying under the rubble nor burning to death sound like very dignified deaths. Why not go out your own way? You slowly pull the trigger. Your ears barely register the bang as your body collapses on the ground and everything cuts to black.")
              die()
            } else {
              show("No, that would not solve anything. You have to press on and see this to the end.")
            }

            return;
          } 

          if (action === "look" && ["around", "the room", "room"].includes(res.groups.what)) {
            return show(this.description(this.flags))
          }

          const canDrink = action === "use" 
            && YOURSELF.includes(res.groups.what)
            && res.groups.tool === ITEM.BREW 
            && GM.hasItem(ITEM.BREW)
            && !GM.brewUsed

          if (canDrink) {
            if (!GM.deaths.has(DEATH.BREW)) {
              GM.deaths.add(DEATH.BREW)
              show("You drink the Brew and pass out. Not even the approaching flames can disturb your slumber. You never wake up again.")
              die()
            } else {
              show("Even though you're parched, drinking the Brew suddenly doesn't seem like that good of an idea.")
            }

            return;
          }

          return this.findAction(action, res.groups.what)(res.groups)
        }
      }
    }

    show("No idea what you just meant.")
  }

}