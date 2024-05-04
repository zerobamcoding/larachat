import React from 'react'
import { IconCornerUpRight, IconClipboardCopy, IconX, IconPin, IconEdit, IconPinnedOff } from "@tabler/icons-react"
import { Message } from '@/redux/types/chat'

interface PageProps {
    message: Message
    reply: (v: Message) => void
    pin: (v: Message, p: boolean) => void
}

const MessageMenu: React.FC<PageProps> = ({ message, reply, pin }) => {
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
            <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'>
                <IconX className='h-4' />
                <p>Unsend</p>
            </li>
        </>
    )
}

export default MessageMenu
