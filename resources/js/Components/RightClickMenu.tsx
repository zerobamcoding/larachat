import React from 'react'
import { IconCornerUpRight, IconClipboardCopy, IconX, IconPin, IconEdit } from "@tabler/icons-react"
import { clickOutside } from '@/hooks/use-clickOutside'
import { Message } from '@/redux/types/chat'
interface PageProps {
    close: () => void
    position: { x: number, y: number }
    message: Message
    reply: (v: Message) => void
}
const RightClickMenu: React.FC<PageProps> = ({ close, position, message, reply }) => {
    const ref = clickOutside(close)
    return (
        <ul
            //@ts-ignore
            ref={ref}
            style={{ position: "absolute", top: position.y, left: position.x }}
            className='w-[200px] bg-slate-700 flex flex-col rounded-b-lg rounded-r-lg text-white overflow-hidden'>
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
            <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'>
                <IconPin className='h-4' />
                <p>Pin message</p>
            </li>
            <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'>
                <IconX className='h-4' />
                <p>Unsend</p>
            </li>
        </ul>
    )
}

export default RightClickMenu
