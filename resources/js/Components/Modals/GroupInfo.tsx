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
}
const GroupInfo: React.FC<PageProps> = ({ close, group, user }) => {
    const { getGroupMembersAction, updateGroupAdmins } = useActions()
    useEffect(() => {
        getGroupMembersAction(group.id)
    }, [])

    const changeGroupAdmins = (admin: number, is_admin: boolean) => {
        if (user.id === group.creator)
            updateGroupAdmins(group.id, admin, is_admin)
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
            <div className='h-full flex flex-col'>
                {group.members?.map(user => (
                    <div key={user.id} className='flex flex-row justify-between p-3 hover:bg-slate-50'>
                        <div className='flex space-x-3'>
                            <Avatar h={8} w={8} user={user} />
                            <span>{user.username}</span>
                        </div>
                        {group.creator !== user.id ? (

                            <IconStarFilled stroke={3} width={20} color={user.pivot.is_admin ? 'orange' : 'gray'} onClick={() => changeGroupAdmins(user.id, !user.pivot.is_admin)} />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroupInfo
