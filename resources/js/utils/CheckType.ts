import { Channel } from "@/redux/types/channel";
import { Direct } from "@/redux/types/chat";
import { Group } from "@/redux/types/group";
import { User } from "@/redux/types/user";

export const isAnUser = (obj: any): obj is User => {
    return "username" in obj;
}

export const isDirect = (obj: any): obj is Direct => {
    return obj.type && obj.type === 'Direct'
}

export const isGroup = (obj: any): obj is Group => {
    return obj.type && obj.type === 'Group'
}


export const isChannel = (obj: any): obj is Channel => {
    return obj.type && obj.type === 'Channel'
}
