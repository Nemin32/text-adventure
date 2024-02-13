import { ActionGenerator, Flags, Room } from "../room.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (_) => ({

})

const description = (_: flags) => ``

export const room = new Room({}, actions, description)