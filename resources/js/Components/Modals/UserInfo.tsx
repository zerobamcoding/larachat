import { ArrowLeftIcon, AtSymbolIcon, PhoneIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useTypedSelector } from '@/hooks/use-typed-selector';
import Avatar from '../Avatar';
import { useActions } from '@/hooks/useActions';

interface PageProps {
    close: (v: boolean) => void
    level: (v: "info" | "setting") => void
}

const UserInfo: React.FC<PageProps> = ({ close, level }) => {
    const { changeAvatar } = useActions();
    const { updateUser } = useActions();
    const [editMode, setEditMode] = useState<"name" | "mobile" | "">("")
    const { user, errors } = useTypedSelector(state => state.me)
    const [name, setName] = useState(user && user.name ? user.name : "")
    const [mobile, setMobile] = useState(user && user.mobile ? user.mobile : "")
    const [bio, setBio] = useState(user && user.description ? user.description : "")

    useEffect(() => {
        if (name && name !== user?.name && name?.length >= 3) {
            updateUser({ "name": name })
        }

        if (mobile && mobile !== user?.mobile && mobile.toString().length >= 3) {
            updateUser({ "mobile": mobile })
        }

        if (bio && bio !== user?.description && bio.length >= 3) {
            updateUser({ "description": bio })
        }

    }, [name, mobile, bio])

    const changeAvatarHandler = (files: File[]) => {
        if (files && files[0]) {
            const formData = new FormData();
            formData.append("file", files[0])
            changeAvatar(formData)
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <div className='flex space-x-3 items-center'>
                    <ArrowLeftIcon className='h-5 cursor-pointer' onClick={() => level('setting')} />
                    <h3 className='text-lg font-bold'>Info</h3>
                </div>
                <XMarkIcon className='h-5 cursor-pointer' onClick={() => close(false)} />
            </div>

            <div className='flex flex-col items-center justify-center'>
                {user && (
                    <Avatar h={16} w={16} editable user={user} changeFile={changeAvatarHandler} />
                )}
                <h2 className='font-black text-xl my-3'>{user && user.name ? user.name : user ? `${user.username}` : "Not set"}</h2>
            </div>
            <ul role='list'>
                <li>
                    <textarea placeholder='Bio' className='w-full border-0 focus:ring-0 resize-none' rows={1} onChange={(e) => setBio(e.target.value)}>{bio}</textarea>
                </li>
                <li className='bg-slate-400/20 p-5 text-sm font-extralight'>
                    <p>Anything that describe you like age and mood and ...</p>
                </li>
                <li className={`px-5 pb-2 pt-5 cursor-pointer hover:bg-slate-400/20 duration-300 ${errors && errors.name ? "border-[1px] border-red-400" : ""}`} onClick={() => setEditMode("name")} >
                    <div className='flex flex-col '>
                        <div className='flex justify-between '>
                            <div className='flex space-x-3'>
                                <UserCircleIcon className='h-5' />
                                <span>Name</span>
                            </div>
                            {editMode === "name" ? (
                                <input
                                    className='w-full bg-transparent border-0 focus:ring-0 text-end'
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onBlur={() => setEditMode("")} />
                            ) : (

                                <h3 className='text-blue-500'>{name}</h3>
                            )}
                        </div>
                        {errors && errors.name && errors.name.map((e, i) => <p key={i} className='text-xs font-extralight text-red-400 pt-2'>{e}</p>)}
                    </div>
                </li>
                <li className='flex justify-between px-5 py-2 cursor-pointer hover:bg-slate-400/20 duration-300' onClick={() => setEditMode("mobile")} >
                    <div className='flex space-x-3'>
                        <PhoneIcon className='h-5' />
                        <span>Phone Number</span>
                    </div>
                    {editMode === "mobile" ? (
                        <input
                            className='w-full bg-transparent border-0 focus:ring-0 text-end'
                            type="text"
                            value={mobile}
                            onChange={e => setMobile(+e.target.value)}
                            onBlur={() => setEditMode("")} />
                    ) : (

                        <h3 className='text-blue-500'>{mobile}</h3>
                    )}

                </li>
                <li className='flex justify-between px-5 py-2 cursor-pointer hover:bg-slate-400/20 duration-300'>
                    <div className='flex space-x-3'>
                        <AtSymbolIcon className='h-5' />
                        <span>Username</span>
                    </div>
                    <h3 className='text-blue-500'>{user ? `@${user.username}` : ""}</h3>
                </li>
            </ul>
        </div>
    )
}

export default UserInfo
