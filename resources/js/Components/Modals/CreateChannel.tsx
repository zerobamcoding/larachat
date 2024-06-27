import React, { useEffect, useState } from 'react'
import { IconX } from "@tabler/icons-react"
import UserSelection from '../UserSelection';
import { User } from '@/redux/types/user';
import { useActions } from '@/hooks/useActions';
import Avatar from '../Avatar';
import apiClient from '@/libs/apiClient';
interface PageProps {
    close: () => void
    contacts: User[]
}

const CreateChannel: React.FC<PageProps> = ({ close, contacts }) => {
    const linkRegex = /^[a-zA-Z][a-zA-Z0-9_#]{4,15}$/
    const { makeNewChannelAction } = useActions()
    const [level, setLevel] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [link, setLink] = useState("")
    const [isUniqueLink, setIsUniqueLink] = useState(true)
    const [isUniqueLinkError, setIsUniqueLinkError] = useState('')
    const [avatar, setAvatar] = useState<File[] | null>(null)
    const [selectedContacts, setSelectedContacts] = useState<User[]>([])

    const newChannelHandler = () => {
        const formData = new FormData();
        formData.append("name", name)
        if (description) {
            formData.append("description", description)
        }
        if (link) {
            formData.append("link", link)
        }
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
        setLink("")
        setIsUniqueLink(true)
        setIsUniqueLinkError("")
        setLevel(0)
        setAvatar(null)
        setSelectedContacts([])
        close()
    }

    const checkUniqueLinkHandler = async () => {
        setIsUniqueLink(true)
        setIsUniqueLinkError("")
        const { data: { success } }: { data: { success: boolean } } = await apiClient.post(route('channel.unique.link'), { link })
        setIsUniqueLink(success);
        if (!success) {
            setIsUniqueLinkError("Sorrry, this link has been used")
        }

    }
    useEffect(() => {
        if (link) {
            if (!linkRegex.test(link)) {
                setIsUniqueLink(false)
                setIsUniqueLinkError("Link is too short")
            } else {
                const timer = setTimeout(checkUniqueLinkHandler, 500)
                return () => {
                    clearTimeout(timer)
                }
            }
        } else {
            setIsUniqueLink(true)
            setIsUniqueLinkError("")
        }
    }, [link])
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
                    <div className='flex flex-col w-full space-y-1 px-3'>
                        <div className='flex justify-between items-center'>
                            <span className='font-extrabold text-lg'>Link</span>
                            {!isUniqueLink && (
                                <span className='text-red-500'>{isUniqueLinkError}</span>
                            )}
                        </div>
                        <div className='flex items-center'>
                            <div className='bg-sky-400/50 p-2 rounded-md'>
                                <span className='text-white text-sm'>larachat.me</span>
                            </div>
                            <input
                                type='text'
                                className='w-full bg-transparent border-0 focus:ring-0 text-start'
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <textarea placeholder='Bio' className='w-full border-0 focus:ring-0 resize-none bg-blue-50' rows={2} onChange={(e) => setDescription(e.target.value)}>{description}</textarea>
                </div>
            )}
            <div className='flex justify-end space-x-3 p-5'>
                <button type="button" className='border-[1px] border-red-400 p-2 rounded-lg hover:bg-red-400 duration-300' onClick={closeModalHandler}>Cancel</button>
                {level === 0 ? (
                    <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300' onClick={() => setLevel(1)}>Next</button>
                ) : (
                    <button type="button" className='border-[1px] border-green-400 p-2 rounded-lg hover:bg-green-400 duration-300 disabled:opacity-50 disabled:cursor-not-allowed' disabled={!isUniqueLink} onClick={newChannelHandler}>Create</button>

                )}
            </div>
        </div>
    )
}

export default CreateChannel
