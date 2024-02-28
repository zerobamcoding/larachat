import React, { useState } from 'react'
import { EllipsisVerticalIcon, MagnifyingGlassIcon, BellIcon, BellSlashIcon, Bars3Icon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { User } from '@/redux/types/user'
import { useActions } from '@/hooks/useActions'
import { Direct } from '@/redux/types/chat'
import { useTypedSelector } from '@/hooks/use-typed-selector'
interface PageProps {
    thread: User | Direct | null
}
const Messages: React.FC<PageProps> = ({ thread }) => {
    const { user: me } = useTypedSelector(state => state.me)
    const { sendMessage } = useActions()
    const [messageValue, setMessageValue] = useState("")

    const isAnUser = (obj: any): obj is User => {
        return "username" in obj;
    }
    const sendMessageHandler = () => {
        if (isAnUser(thread)) {
            sendMessage({ to: thread.id, message: messageValue })
        } else {

            if (thread && me) {
                sendMessage({ to: me.id === thread.userone.id ? thread.usertwo.id : thread.userone.id, message: messageValue })
            }
        }
        setMessageValue("")
    }
    return (
        <div className="relative flex flex-col flex-1">
            {thread && (

                <div className="z-20 flex flex-grow-0 flex-shrink-0 w-full pr-3 bg-white dark:bg-slate-800/90 text-gray-600 dark:text-white">
                    <div className="w-12 h-12 mx-4 my-2 bg-blue-500 bg-center bg-no-repeat bg-cover rounded-full cursor-pointer"
                        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=50)" }}>
                    </div>
                    <div className="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
                        <div className="overflow-hidden text-base font-medium leading-tight  whitespace-no-wrap">Karen</div>
                        <div className="overflow-hidden text-sm font-medium leading-tight  whitespace-no-wrap">Online</div>
                    </div>
                    <div className="relative w-48 pl-2 my-3 border-l-2 border-blue-500 cursor-pointer lg:block">
                        <div className="text-base font-medium text-blue-500">Pinned message</div>
                        <div className="text-sm font-normal ">Today star contest</div>
                    </div>
                    <button className="flex self-center p-2 ml-2  rounded-full focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <BellSlashIcon className='h-6' />
                    </button>
                    <button className="flex self-center p-2 ml-2 rounded-full focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <MagnifyingGlassIcon className='h-6' />
                    </button>
                    <button type="button" className="flex self-center p-2 ml-2 rounded-full md:block focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <EllipsisVerticalIcon className='h-6' />
                    </button>
                    <button className="p-2 text-gray-700 flex self-center rounded-full md:hidden focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-200">
                        <Bars3Icon className='h-6' />
                    </button>
                </div>
            )}
            <div className="top-0 bottom-0 left-0 right-0 flex flex-col flex-1 overflow-hidden dark:bg-slate-800 bg-bottom bg-cover">
                {thread && (<>

                    <div className="self-center flex-1 w-full max-w-xl">
                        <div className="relative flex flex-col px-3 py-1 m-auto">
                            <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">Channel was created</div>
                            <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">May 6</div>
                            <div className="self-start w-3/4 my-2">
                                <div className="p-4 text-sm bg-white rounded-t-lg rounded-r-lg shadow">
                                    Don't forget to check on all responsive sizes.
                                </div>
                            </div>
                            <div className="self-end w-3/4 my-2">
                                <div className="p-4 text-sm bg-white rounded-t-lg rounded-l-lg shadow">
                                    Use the buttons above the editor to test on them
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                        <div className="w-full">

                            <span className="absolute inset-y-0 right-0 flex items-center pr-6" onClick={sendMessageHandler}>
                                <button type="submit" className="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
                                    <PaperAirplaneIcon className='h-6' />
                                </button>
                            </span>
                            <input
                                type="search"
                                className="w-full py-2 pl-10 text-sm bg-white border border-transparent appearance-none rounded-tg placeholder-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
                                style={{ borderRadius: "25px" }}
                                placeholder="Message..."
                                autoComplete="off"
                                value={messageValue}
                                onChange={(e) => setMessageValue(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") sendMessageHandler() }} />
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    )
}

export default Messages
