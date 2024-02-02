import { EllipsisVerticalIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface PageProps {
    close: (v: boolean) => void
    level: (v: "info" | "setting") => void
}
const Setting: React.FC<PageProps> = ({ close, level }) => {
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
                <div className="relative flex items-center justify-center w-20 h-20 text-xl font-semibold text-white bg-blue-500 rounded-full flex-no-shrink">
                    <img className="object-cover w-20 h-20 rounded-full" src="https://images.unsplash.com/photo-1589127097756-b2750896a728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100" alt="" />

                </div>
                <ul role='list'>
                    <li className='text-lg font-extrabold'>
                        <h2>Mahdi Partovi</h2>
                    </li>
                    <li className='text-sm font-extralight'>
                        <h2>123</h2>
                    </li>
                    <li className='text-sm font-extralight text-gray-500'>
                        <h2>@Zerobam</h2>
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
