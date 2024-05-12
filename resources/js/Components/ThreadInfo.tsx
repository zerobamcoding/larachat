import React, { useEffect, useState } from 'react'
import { XMarkIcon, PencilIcon, EllipsisVerticalIcon, Bars3Icon, InformationCircleIcon, AtSymbolIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { User } from '@/redux/types/user'
import { Direct } from '@/redux/types/chat'
import Avatar from './Avatar'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { Group } from '@/redux/types/group'
import { isDirect, isGroup } from '@/utils/CheckType'
import apiClient from '@/libs/apiClient'
interface PageProps {
    thread: User | Direct | null | Group
    close: () => void
    onlines: number[]
}
const ThreadInfo: React.FC<PageProps> = ({ thread, close, onlines }) => {
    const [userObject, setUserObject] = useState<User | null>(null)
    const { user: me } = useTypedSelector(state => state.me)

    useEffect(() => {
        if (thread && isDirect(thread) && me) {
            me.id === thread.userone.id ? setUserObject(thread.usertwo) : setUserObject(thread.userone)
        }
    }, [thread])

    const getGroupLinkHandler = async () => {
        if (thread) {

            const { data } = await apiClient.post(route('group.link'), { id: thread.id })
            navigator.clipboard.writeText(`larachat.me/${data.link}`)
        }
    }
    return (
        <nav className="right-0 flex flex-col pb-2 bg-white dark:bg-slate-800/90  text-black dark:text-white" style={{ width: "24rem" }}>
            <div className="flex items-center justify-between w-full p-3">
                <button
                    onClick={close}
                    className="p-2 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-200"
                >
                    <XMarkIcon className='h-6' />
                </button>
                <div className="ml-4 mr-auto text-lg font-medium">Info</div>
                <button type="button" className="p-2 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-200">
                    <PencilIcon className='h-6' />
                </button>
                <button type="button" className="p-2 ml-1 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-200">
                    <EllipsisVerticalIcon className='h-6' />
                </button>
            </div>
            <div>
                <div className="flex justify-center mb-4">

                    {userObject ? <Avatar h={12} w={12} user={userObject} /> : isGroup(thread) ? (
                        <div className={`group relative overflow-hidden flex items-center justify-center w-12 h-12 text-xl font-semibold text-white bg-blue-500 rounded-full `}>
                            <p>{thread.name.slice(0, 1).toUpperCase()}</p>
                        </div>
                    ) : null}

                </div>
                {isDirect(thread) ? (
                    <>
                        <p className="text-lg font-semibold text-center first-letter:uppercase">{userObject?.name ?? userObject?.username}</p>
                        <p className="text-sm font-medium text-center text-blue-500">{userObject && onlines.includes(userObject.id) ? "Online" : "Offline"}</p>
                    </>
                ) : isGroup(thread) ? (
                    <p className="text-lg font-semibold text-center first-letter:uppercase">{thread.name}</p>
                ) : null}
            </div>
            {isDirect(thread) ? (
                <>

                    <div className="flex items-center w-full px-3 mt-6">
                        <div className="px-2 rounded-full hover:text-gray-600">
                            <InformationCircleIcon className='h-6' />
                        </div>
                        <div className="ml-4">
                            <div className="mr-auto text-sm font-semibold ">{userObject?.description ?? "Not Set"}</div>
                            <div className="mt-1 mr-auto text-sm font-semibold leading-none ">Bio</div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center w-full px-3 mt-4">
                            <div className="px-2 rounded-full hover:text-gray-600">
                                <AtSymbolIcon className='h-6' />
                            </div>
                            <div>
                                <div className="ml-4 mr-auto text-sm font-semibold ">@{userObject?.username}</div>
                                <div className="mt-1 ml-4 mr-auto text-sm font-semibold leading-none ">Username</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center w-full px-3 mt-4">
                            <div className="px-2 rounded-full hover:">
                                <PhoneIcon className='h-6' />
                            </div>
                            <div className="ml-4">
                                <div className="mr-auto text-sm font-semibold ">{userObject?.mobile}</div>
                                <div className="mt-1 mr-auto text-sm font-semibold leading-none ">Phone</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center w-full px-3 mt-4 mb-2">
                            <div className="px-2 cursor-pointer">
                                <svg className="w-6 h-6 text-blue-500 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fillRule="nonzero" d="M18,3 C19.6568542,3 21,4.34314575 21,6 L21,18 C21,19.6568542 19.6568542,21 18,21 L6,21 C4.34314575,21 3,19.6568542 3,18 L3,6 C3,4.34314575 4.34314575,3 6,3 L18,3 Z M17.2928932,7.29289322 L10,14.5857864 L6.70710678,11.2928932 C6.31658249,10.9023689 5.68341751,10.9023689 5.29289322,11.2928932 C4.90236893,11.6834175 4.90236893,12.3165825 5.29289322,12.7071068 L9.29289322,16.7071068 C9.68341751,17.0976311 10.3165825,17.0976311 10.7071068,16.7071068 L18.7071068,8.70710678 C19.0976311,8.31658249 19.0976311,7.68341751 18.7071068,7.29289322 C18.3165825,6.90236893 17.6834175,6.90236893 17.2928932,7.29289322 Z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <div className="mr-auto text-sm font-semibold ">Notification</div>
                                <div className="mt-1 mr-auto text-sm font-semibold leading-none ">Enabled</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : isGroup(thread) ? (
                <div className='mb-10'>
                    <div className="flex items-center w-full px-3 mt-4 cursor-pointer" onClick={getGroupLinkHandler}>
                        <div className="px-2 rounded-full hover:text-gray-600">
                            <AtSymbolIcon className='h-6' />
                        </div>
                        <div>
                            <div className="ml-4 mr-auto text-sm font-semibold ">Copy Link</div>
                        </div>
                    </div>
                </div>
            ) : null}
            <ul className="flex flex-row items-center justify-around px-3 mb-1 list-none border-b select-none">
                <li className="flex-auto px-4 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                    <a className="block py-3 text-xs font-bold leading-normal text-blue-500 uppercase border-b-4 border-blue-500">
                        Media
                    </a>
                </li>
                <li className="flex-auto px-4 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                    <a className="block py-3 text-xs font-bold leading-normal uppercase border-b-4 border-transparent">
                        Docs
                    </a>
                </li>
                <li className="flex-auto px-4 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                    <a className="block py-3 text-xs font-bold leading-normal uppercase border-b-4 border-transparent">
                        Links
                    </a>
                </li>
                <li className="flex-auto px-4 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                    <a className="block py-3 text-xs font-bold leading-normal uppercase border-b-4 border-transparent">
                        Audio
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default ThreadInfo
