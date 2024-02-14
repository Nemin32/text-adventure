import { show } from "./util.ts";

export type ActionKinds = "look" | "talk" | "press" | "take" | "use" | "enter" | "read"
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
    press: ({what}) => show(`How would I even press the ${what}?`),
    take: ({what}) => show(`I couldn't possibly take the ${what}.`),
    talk: ({what}) => show(`Talk to ${what}? Are you stupid?`),
    read: ({what}) => show(`I might be illiterate, but I can't read ${what}.`),
    use: ({what, recv}) => show(`How would I even use ${what} on ${recv}?`)
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
    ]

    for (const [rx, action] of cases) {
      const res = input.match(rx)

      if (res !== null) {
        if (res.groups) {
          if (action === "look" && ["around", "the room", "room"].includes(res.groups.what)) {
            return show(this.description(this.flags))
          }

          return this.findAction(action, res.groups.what)(res.groups)
        }
      }
    }

    show("No idea what you just meant.")
  }

}