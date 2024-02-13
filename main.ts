"use strict"

import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { GM } from "./util.ts"

GM.currentRoom = rooms.get(ROOM_NAME.SPAWN)!
