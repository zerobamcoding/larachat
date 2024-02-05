import { EllipsisVerticalIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTypedSelector } from '@/hooks/use-typed-selector';
import Avatar from '../Avatar';


interface PageProps {
    close: (v: boolean) => void
    level: (v: "info" | "setting") => void
}
const Setting: React.FC<PageProps> = ({ close, level }) => {
    const { user } = useTypedSelector(state => state.me)

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <h3 className='text-lg font-bold'>Setting</h3>
                <div className='flex space-x-3'>
                    <EllipsisVerticalIcon className='h-5' />
                    <XMarkIcon className='h-5 cursor-pointer' onClick={() => close(false)} />
                </div>
            </div>
            <div className='flex space-x-4 items-center p-5 pt-0'>
                <Avatar h={20} w={20} />
                <ul role='list'>
                    <li className='text-lg font-extrabold'>
                        <h2>{user && user.name ? user.name : user ? `${user.username}` : "Not set"}</h2>
                    </li>
                    <li className='text-sm font-extralight'>
                        <h2>{user ? user.mobile : "Undefined"}</h2>
                    </li>
                    <li className='text-sm font-extralight text-gray-500'>
                        <h2>@{user ? user.username : "Undefined"}</h2>
                    </li>
                </ul>
            </div>
            <hr />
            <ul role='list' className='py-3'>
                <li className='flex space-x-3 px-5 py-2 cursor-pointer hover:bg-slate-400/20' onClick={() => level('info')}>
                    <UserCircleIcon className='h-5' />
                    <span className=''>My Account</span>
                </li>

            </ul>
        </div>
    )
}

export default Setting
