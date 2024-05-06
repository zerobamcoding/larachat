import { IconX } from '@tabler/icons-react'
import React from 'react'
import { useActions } from '@/hooks/useActions'
import { User } from '@/redux/types/user'

interface PageProps {
    user: User
    group_id: number
    closeMenu: () => void
}
const GroupUserMenu: React.FC<PageProps> = ({ user, group_id, closeMenu }) => {
    const { removeGroupUserAction } = useActions()

    const removeUserHandler = () => {
        removeGroupUserAction(group_id, user.id)
        closeMenu()
    }
    return (
        <li className='w-full hover:bg-slate-600 p-2 px-3 flex items-center space-x-5 cursor-default' onClick={removeUserHandler}>
            <IconX className='h-4' />
            <p>Remove</p>
        </li>
    )
}

export default GroupUserMenu
