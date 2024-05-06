import { Group } from '@/redux/types/group'
import { IconX, IconStarFilled } from '@tabler/icons-react'
import React, { useEffect } from 'react'
import { useActions } from '@/hooks/useActions'
import Avatar from '../Avatar'
import { User } from '@/redux/types/user'
interface PageProps {
    close: () => void
    group: Group
    user: User
    showCTXMenu: (v: boolean) => void
    changeMenuPosition: (v: { x: number, y: number }) => void
    selectUser: React.Dispatch<React.SetStateAction<User | null>>
}
const GroupInfo: React.FC<PageProps> = ({ close, group, user, showCTXMenu, changeMenuPosition, selectUser }) => {
    const { getGroupMembersAction, updateGroupAdmins } = useActions()
    useEffect(() => {
        getGroupMembersAction(group.id)
    }, [])

    const changeGroupAdmins = (admin: number, is_admin: boolean) => {
        if (user.id === group.creator)
            updateGroupAdmins(group.id, admin, is_admin)
    }

    const showMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, user: User) => {
        e.preventDefault()
        changeMenuPosition({ x: e.pageX, y: e.pageY });
        selectUser(user)
        showCTXMenu(true)
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0 h-fit'>
                <div className='flex space-x-3 items-center'>
                    <div className={`group relative overflow-hidden flex items-center justify-center w-12 h-12 text-xl font-semibold text-white bg-blue-500 rounded-full `}>
                        <p>{group.name.slice(0, 1).toUpperCase()}</p>
                    </div>
                    <h3 className='text-lg font-bold'>{group.name}</h3>
                </div>
                <IconX className='h-5 cursor-pointer' onClick={() => close()} />
            </div>
            <div className='h-full flex flex-col' >
                {group.members?.map(member => (
                    <div key={member.id}
                        className='flex flex-row justify-between p-3 hover:bg-slate-50'
                        onContextMenu={e => showMenu(e, member)}>
                        <div className='flex space-x-3'>
                            <Avatar h={8} w={8} user={member} />
                            <span>{member.username}</span>
                        </div>
                        {group.creator !== member.id ? (

                            <IconStarFilled
                                className='cursor-pointer'
                                stroke={3}
                                width={20}
                                color={member.pivot.is_admin ? 'orange' : 'gray'}
                                onClick={() => changeGroupAdmins(member.id, !member.pivot.is_admin)}
                            />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroupInfo
