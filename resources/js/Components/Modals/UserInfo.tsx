import { ArrowLeftIcon, AtSymbolIcon, PhoneIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTypedSelector } from '@/hooks/use-typed-selector';
import Avatar from '../Avatar';


interface PageProps {
    close: (v: boolean) => void
    level: (v: "info" | "setting") => void
}

const UserInfo: React.FC<PageProps> = ({ close, level }) => {
    const { user } = useTypedSelector(state => state.me)
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
                <Avatar h={16} w={16} />
                <h2 className='font-black text-xl my-3'>{user && user.name ? user.name : user ? `${user.username}` : "Not set"}</h2>
            </div>
            <ul role='list'>
                <li>
                    <textarea placeholder='Bio' className='w-full border-0 focus:ring-0 resize-none' rows={1}>{user ? user.description : ""}</textarea>
                </li>
                <li className='bg-slate-400/20 p-5 text-sm font-extralight'>
                    <p>Anything that describe you like age and mood and ...</p>
                </li>
                <li className='flex justify-between px-5 pb-2 pt-5 cursor-pointer hover:bg-slate-400/20 duration-300'>
                    <div className='flex space-x-3'>
                        <UserCircleIcon className='h-5' />
                        <span>Name</span>
                    </div>
                    <h3 className='text-blue-500'>{user ? user.name : ""}</h3>
                </li>
                <li className='flex justify-between px-5 py-2 cursor-pointer hover:bg-slate-400/20 duration-300'>
                    <div className='flex space-x-3'>
                        <PhoneIcon className='h-5' />
                        <span>Phone Number</span>
                    </div>
                    <h3 className='text-blue-500'>{user ? user.mobile : ""}</h3>
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
