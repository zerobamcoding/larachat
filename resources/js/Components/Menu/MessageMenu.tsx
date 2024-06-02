import React from 'react'
import { IconCornerUpRight, IconClipboardCopy, IconX, IconPin, IconEdit, IconPinnedOff } from "@tabler/icons-react"
import { Direct, Message } from '@/redux/types/chat'
import { isChannel, isDirect, isGroup } from '@/utils/CheckType'
import { Group } from '@/redux/types/group'
import { User } from '@/redux/types/user'
import { useActions } from '@/hooks/useActions'
import { Channel } from '@/redux/types/channel'

interface PageProps {
    close: () => void
    message: Message
    reply: (v: Message) => void
    pin: (v: Message, p: boolean) => void
    thread: Group | User | Direct | Channel
    user: User
}

const MessageMenu: React.FC<PageProps> = ({ message, reply, pin, thread, close, user }) => {
    const { removeMessageAction } = useActions()

    const removeMessageHandler = () => {
        removeMessageAction(message.id)
        close();
    }
    return (
        <>
            <li
                onClick={() => { reply(message); close() }}
                className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'
            >
                <IconCornerUpRight className='h-4' />
                <p>Reply</p>
            </li>
            <li
                onClick={() => { navigator.clipboard.writeText(message.message); close() }}
                className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'
            >
                <IconClipboardCopy className='h-4' />
                <p>Copy Text</p>
            </li>
            <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'>
                <IconEdit className='h-4' />
                <p>Edit message</p>
            </li>
            {message.pinned ? (

                <li
                    onClick={() => { pin(message, false); close(); }}
                    className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'
                >
                    <IconPinnedOff className='h-4' />
                    <p>Unpin message</p>
                </li>
            ) : (
                <li
                    onClick={() => { pin(message, true); close(); }}
                    className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'
                >
                    <IconPin className='h-4' />
                    <p>Pin message</p>
                </li>
            )}
            {message.sender.id === user.id || ((isGroup(thread) || isChannel(thread)) && (thread.creator === thread.pivot.user_id || thread.pivot.is_admin)) ? (

                <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default' onClick={removeMessageHandler}>
                    <IconX className='h-4' />
                    <p>Unsend</p>
                </li>
            ) : null}
        </>
    )
}

export default MessageMenu
