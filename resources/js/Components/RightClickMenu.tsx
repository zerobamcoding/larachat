import React, { PropsWithChildren } from 'react'
import { clickOutside } from '@/hooks/use-clickOutside'
import { Message } from '@/redux/types/chat'
interface PageProps extends PropsWithChildren {
    close: () => void
    position: { x: number, y: number }
}
const RightClickMenu: React.FC<PageProps> = ({ close, position, children }) => {
    const ref = clickOutside(close)
    return (
        <ul
            //@ts-ignore
            ref={ref}
            style={{ position: "absolute", top: position.y, left: position.x }}
            className='w-[200px] bg-slate-700 flex flex-col rounded-b-lg rounded-r-lg text-white overflow-hidden z-[9999]'>
            {children}
        </ul>
    )
}

export default RightClickMenu
