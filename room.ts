import { move } from "./adjacencies.ts";
import { DEATH, ITEM, ROOM_NAME } from "./roomnames.ts";
import { GM, show } from "./util.ts";

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
      [/(?:enter(?: the)?|move|go) (?<what>.*)/, "enter"],
      [/(?:read)(?: the)? (?<what>.*)/, "read"],
      [/(?:jump|dive|pounce)(?: into(?: the)?)? (?<what>.*)/, "jump"],

    ]

    for (const [rx, action] of cases) {
      const res = input.match(rx)

      if (res !== null) {
        if (res.groups) {
          if (action === "look" && ["around", "the room", "room"].includes(res.groups.what)) {
            return show(this.description(this.flags))
          }

          const canDrink = action === "use" 
            && ["self", "me"].includes(res.groups.what)
            && res.groups.tool === ITEM.BREW 
            && GM.hasItem(ITEM.BREW)
            && !GM.brewUsed

          if (canDrink) {
            if (!GM.deaths.has(DEATH.BREW)) {
              GM.deaths.add(DEATH.BREW)
              show("You drink the Brew and pass out. Not even the approaching flames can disturb your slumber. You never wake up again.")
              move(ROOM_NAME.DEATH)
              return;
            } else {
              show("Even though you're parched, drinking the Brew suddenly doesn't seem like that good of an idea.")
              return;
            }
          }

          return this.findAction(action, res.groups.what)(res.groups)
        }
      }
    }

    show("No idea what you just meant.")
  }

}