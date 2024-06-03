import React, { useEffect, useState } from 'react'
import { IconX } from "@tabler/icons-react"
import UserSelection from '../UserSelection';
import { User } from '@/redux/types/user';
import { useActions } from '@/hooks/useActions';
interface PageProps {
    close: () => void
    contacts: User[]
}

const CreateChannel: React.FC<PageProps> = ({ close, contacts }) => {
    const { makeNewChannelAction } = useActions()
    const [name, setName] = useState("")
    const [selectedContacts, setSelectedContacts] = useState<User[]>([])

    const newChannelHandler = () => {
        makeNewChannelAction(name, selectedContacts.map(c => c.id))
        close();
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <div className='flex space-x-3 items-center'>
                    <h3 className='text-lg font-bold'>Make New Channel</h3>
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
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <UserSelection lists={contacts} selected={selectedContacts} addToSelected={setSelectedContacts} />
            <div className='flex justify-end space-x-3 p-5'>
                <button type="button" className='border-[1px] border-red-400 p-2 rounded-lg hover:bg-red-400 duration-300' onClick={() => close()}>Cancel</button>
                <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300' onClick={newChannelHandler}>Create</button>
            </div>
        </div>
    )
}

export default CreateChannel
