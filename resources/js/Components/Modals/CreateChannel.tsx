import React, { useEffect, useState } from 'react'
import { IconX } from "@tabler/icons-react"
import UserSelection from '../UserSelection';
import { User } from '@/redux/types/user';
import { useActions } from '@/hooks/useActions';
import Avatar from '../Avatar';
interface PageProps {
    close: () => void
    contacts: User[]
}

const CreateChannel: React.FC<PageProps> = ({ close, contacts }) => {
    const { makeNewChannelAction } = useActions()
    const [level, setLevel] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [avatar, setAvatar] = useState<File[] | null>(null)
    const [selectedContacts, setSelectedContacts] = useState<User[]>([])

    const newChannelHandler = () => {
        const formData = new FormData();
        formData.append("name", name)
        formData.append("description", description)
        if (avatar && avatar[0]) {
            formData.append("avatar", avatar[0])
        }
        selectedContacts.map(c => {
            formData.append("users[]", c.id.toString())
        })
        makeNewChannelAction(formData)
        closeModalHandler();
    }

    const closeModalHandler = () => {
        setName("")
        setDescription("")
        setLevel(0)
        setAvatar(null)
        setSelectedContacts([])
        close()
    }
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <div className='flex space-x-3 items-center'>
                    <h3 className='text-lg font-bold'>Make New Channel</h3>
                </div>
                <IconX className='h-5 cursor-pointer' onClick={() => close()} />
            </div>
            {level === 0 ? (
                <>
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
                </>
            ) : (
                <div className='flex flex-col items-center justify-center space-y-3'>
                    <Avatar w={16} h={16} editable source={avatar ? URL.createObjectURL(avatar[0]) : undefined} changeFile={setAvatar} />
                    <textarea placeholder='Bio' className='w-full border-0 focus:ring-0 resize-none bg-blue-50' rows={2} onChange={(e) => setDescription(e.target.value)}>{description}</textarea>
                </div>
            )}
            <div className='flex justify-end space-x-3 p-5'>
                <button type="button" className='border-[1px] border-red-400 p-2 rounded-lg hover:bg-red-400 duration-300' onClick={closeModalHandler}>Cancel</button>
                {level === 0 ? (
                    <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300' onClick={() => setLevel(1)}>Next</button>
                ) : (
                    <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300' onClick={newChannelHandler}>Create</button>

                )}
            </div>
        </div>
    )
}

export default CreateChannel
