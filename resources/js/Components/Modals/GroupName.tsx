import React, { useEffect, useState } from 'react'
import { IconX, IconSearch } from "@tabler/icons-react"
import { useTypedSelector } from '@/hooks/use-typed-selector';
import UserSelection from '../UserSelection';
import { User } from '@/redux/types/user';
import Avatar from '../Avatar';
interface PageProps {
    close: () => void
    contacts: User[]
}

const GroupName: React.FC<PageProps> = ({ close, contacts }) => {

    const [groupName, setGroupName] = useState("")
    const [selectedContacts, setSelectedContacts] = useState<User[]>([])


    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <div className='flex space-x-3 items-center'>
                    <h3 className='text-lg font-bold'>Make New Group</h3>
                </div>
                <IconX className='h-5 cursor-pointer' onClick={() => close()} />
            </div>
            <div className='flex flex-col p-3'>
                <div className='flex space-x-3'>
                    <span>Name</span>
                </div>
                <input
                    className='w-full bg-transparent rounded-full'
                    type="text"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                />
            </div>
            <UserSelection lists={contacts} selected={selectedContacts} addToSelected={setSelectedContacts} />
            <div className='flex justify-end space-x-3 p-5'>
                <button type="button" className='border-[1px] border-red-400 p-2 rounded-lg hover:bg-red-400 duration-300'>Cancel</button>
                <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300'>Create</button>
            </div>
        </div>
    )
}

export default GroupName
