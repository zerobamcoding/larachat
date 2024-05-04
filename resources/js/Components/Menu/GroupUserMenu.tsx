import { IconX } from '@tabler/icons-react'
import React from 'react'

const GroupUserMenu = () => {
    return (
        <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default'>
            <IconX className='h-4' />
            <p>Remove</p>
        </li>
    )
}

export default GroupUserMenu
