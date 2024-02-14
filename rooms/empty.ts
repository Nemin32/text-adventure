import { ActionGenerator, Flags, Room } from "../room.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({

})

const description = (flags: flags) => ``

export const room = new Room({}, actions, description)