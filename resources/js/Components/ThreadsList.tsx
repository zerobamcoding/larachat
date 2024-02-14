import React, { useState, useRef, useEffect } from 'react'
import { Bars3Icon, BookmarkIcon, Cog6ToothIcon, MagnifyingGlassIcon, MegaphoneIcon, PhoneIcon, UsersIcon, MoonIcon, ArrowRightOnRectangleIcon, XMarkIcon, EllipsisVerticalIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { clickOutside } from '@/hooks/use-clickOutside'
import apiClient from '@/libs/apiClient';
import { AuthResponse } from '@/types';
import { router } from '@inertiajs/react';
import Modal from '@/utils/Modal';
import Setting from './Modals/Setting';
import UserInfo from './Modals/UserInfo';
import { useTypedSelector } from '@/hooks/use-typed-selector';
import { useActions } from '@/hooks/useActions';
interface PageProps {
    dark: boolean;
    changeTheme: React.Dispatch<React.SetStateAction<boolean>>
}
const ThreadsList: React.FC<PageProps> = ({ dark, changeTheme }) => {
    const { searchUser } = useActions();
    const { user } = useTypedSelector(state => state.me)
    const { users: searchedUsers } = useTypedSelector(state => state.search)
    const [modalLevel, setModalLevel] = useState<"setting" | "info">("setting")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const ref = clickOutside(() => setIsSidebarOpen(false))


    const [searchValue, setSearchValue] = useState("")
    const searchUserHandler = () => {
        searchUser(searchValue)
    }
    useEffect(() => {
        const timeOut = setTimeout(searchUserHandler, 500)
        return () => clearTimeout(timeOut)
    }, [searchValue])
    const changeThemeHandler = () => {
        changeTheme(!dark)
    }

    const logout = async () => {
        const { data }: { data: AuthResponse } = await apiClient.get(route("auth.logout"))
        if (data.success) {
            localStorage.removeItem("token");
            router.visit(route("register"))
            return
        }

    }
    return (
        <>
            <div
                ref={ref}
                className={`absolute z-[100] left-0 top-0 h-full w-80 bg-white dark:bg-slate-800 shadow-md transition-transform duration-300 dark:text-white ${isSidebarOpen ? "" : "-translate-x-full"}`}>
                <div className='flex flex-col'>
                    <div className='flex flex-col w-full space-y-2 p-5'>

                        <div className="w-12 h-12 my-2 bg-blue-500 bg-center bg-no-repeat bg-cover rounded-full cursor-pointer"
                        >

                            <img className="content-center object-cover w-full h-full border-2 border-gray-200 rounded-full" src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=50" alt="" />
                        </div>
                        <h3>{user && user.name ? user.name : user ? `${user.username}` : "Not set"}</h3>
                    </div>
                    <hr />
                    <ul role='list '>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer hover:bg-slate-400/20'>
                            <UsersIcon className='h-5' />
                            <span>New Group</span>
                        </li>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer hover:bg-slate-400/20'>
                            <MegaphoneIcon className='h-5' />
                            <span>New Channel</span>
                        </li>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer hover:bg-slate-400/20'>
                            <PhoneIcon className='h-5' />
                            <span>Calls</span>
                        </li>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer hover:bg-slate-400/20'>
                            <BookmarkIcon className='h-5' />
                            <span>Saved Messages</span>
                        </li>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer hover:bg-slate-400/20' onClick={() => {
                            setIsSidebarOpen(false);
                            setIsModalOpen(true)
                        }}>
                            <Cog6ToothIcon className='h-5' />
                            <span>Settings</span>
                        </li>
                        <li className='flex flex-row justify-between p-5 cursor-pointer hover:bg-slate-400/20'>
                            <div className='flex space-x-5'>

                                <MoonIcon className='h-5' />
                                <span>Night Mode</span>
                            </div>
                            <label className="relative inline-flex items-center  cursor-pointer">
                                <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only peer"
                                    checked={dark}
                                    onChange={changeThemeHandler}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </li>
                        <li className='flex flex-row space-x-5 p-5 cursor-pointer text-red-300 hover:bg-red-400/20' onClick={logout}>
                            <ArrowRightOnRectangleIcon className='h-5' />
                            <span>Logout</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="relative flex flex-col h-full bg-white dark:bg-slate-800/90 border-gray-300 shadow-xl md:block transform transition-all duration-500 ease-in-out" style={{ width: "24rem" }}>
                <div className="flex justify-between px-3 pt-1 ">
                    <div className="flex items-center w-full py-2">
                        <button aria-haspopup="true" className="p-2 dark:text-white text-gray-700 rounded-full focus:outline-none hover:text-gray-600 dark:hover:text-gray-600 hover:bg-gray-200" onClick={() => setIsSidebarOpen(true)}>
                            <Bars3Icon className='h-6' />
                        </button>
                        <div className="relative flex items-center w-full pl-2 overflow-hidden text-gray-600 focus-within:text-gray-400">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                <button type="submit" className="p-1 focus:outline-none focus:shadow-none">
                                    <MagnifyingGlassIcon className='h-6' />
                                </button>
                            </span>
                            <input type="search" name="q"
                                className="w-full py-2 pl-12 text-sm text-white bg-gray-200 border border-transparent appearance-none rounded-tg focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue" style={{ borderRadius: "25px" }}
                                placeholder="Search..." autoComplete="off"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative mt-2 mb-4 overflow-x-hidden overflow-y-auto scrolling-touch lg:max-h-sm scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray">
                    <ul className="flex flex-col w-full h-screen px-2 select-none text-black dark:text-white">
                        {searchedUsers ? searchedUsers.map(s => (

                            <li className="flex flex-no-wrap items-center pr-3 rounded-lg cursor-pointer mt-200 py-65 hover:bg-gray-200 dark:hover:text-black" style={{ paddingTop: "0.65rem", paddingBottom: "0.65rem" }}>
                                <div className="flex justify-between w-full focus:outline-none">
                                    <div className="flex justify-between w-full">
                                        <div className="relative flex items-center justify-center w-12 h-12 ml-2 mr-3 text-xl font-semibold text-white bg-blue-500 rounded-full flex-no-shrink">
                                            {s.avatar ? (
                                                <img className="object-cover w-12 h-12 rounded-full" src={`storage/${s.avatar}`} alt={s.username} />
                                            ) : (
                                                (<p>{user?.username.slice(0, 1).toUpperCase()}</p>)
                                            )}
                                            <div className="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full" style={{ width: "0.8rem", height: "0.8rem" }}>
                                                <div className="bg-green-500 rounded-full" style={{ width: "0.6rem", height: "0.6rem" }}></div>
                                            </div>
                                        </div>
                                        <div className="items-center flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <h2 className="text-sm font-semibold ">{s.username}</h2>
                                                <div className="flex">
                                                    <svg className="w-4 h-4 text-green-500 fill-current" xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14">
                                                        <path fillRule="nonzero" d="M4.96833846,10.0490996 L11.5108251,2.571972 C11.7472185,2.30180819 12.1578642,2.27443181 12.428028,2.51082515 C12.6711754,2.72357915 12.717665,3.07747757 12.5522007,3.34307913 L12.4891749,3.428028 L5.48917485,11.428028 C5.2663359,11.6827011 4.89144111,11.7199091 4.62486888,11.5309823 L4.54038059,11.4596194 L1.54038059,8.45961941 C1.2865398,8.20577862 1.2865398,7.79422138 1.54038059,7.54038059 C1.7688373,7.31192388 2.12504434,7.28907821 2.37905111,7.47184358 L2.45961941,7.54038059 L4.96833846,10.0490996 L11.5108251,2.571972 L4.96833846,10.0490996 Z M9.96833846,10.0490996 L16.5108251,2.571972 C16.7472185,2.30180819 17.1578642,2.27443181 17.428028,2.51082515 C17.6711754,2.72357915 17.717665,3.07747757 17.5522007,3.34307913 L17.4891749,3.428028 L10.4891749,11.428028 C10.2663359,11.6827011 9.89144111,11.7199091 9.62486888,11.5309823 L9.54038059,11.4596194 L8.54038059,10.4596194 C8.2865398,10.2057786 8.2865398,9.79422138 8.54038059,9.54038059 C8.7688373,9.31192388 9.12504434,9.28907821 9.37905111,9.47184358 L9.45961941,9.54038059 L9.96833846,10.0490996 L16.5108251,2.571972 L9.96833846,10.0490996 Z" />
                                                    </svg>
                                                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" style={{ color: "transparent" }}>
                                                        <path fillRule="nonzero" d="M7.96833846,10.0490996 L14.5108251,2.571972 C14.7472185,2.30180819 15.1578642,2.27443181 15.428028,2.51082515 C15.6711754,2.72357915 15.717665,3.07747757 15.5522007,3.34307913 L15.4891749,3.428028 L8.48917485,11.428028 C8.2663359,11.6827011 7.89144111,11.7199091 7.62486888,11.5309823 L7.54038059,11.4596194 L4.54038059,8.45961941 C4.2865398,8.20577862 4.2865398,7.79422138 4.54038059,7.54038059 C4.7688373,7.31192388 5.12504434,7.28907821 5.37905111,7.47184358 L5.45961941,7.54038059 L7.96833846,10.0490996 L14.5108251,2.571972 L7.96833846,10.0490996 Z" />
                                                    </svg>
                                                    <span className="ml-1 text-xs font-medium text-gray-600">12.52</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm leading-none truncate">
                                                <span>Writing...</span>
                                                {/* <span className="flex items-center justify-center w-5 h-5 text-xs text-right text-white bg-green-500 rounded-full">2</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )) : null}

                    </ul>
                </div>

            </div>
            <Modal show={isModalOpen} close={setIsModalOpen} animation='zoom'>
                {modalLevel === "setting" ? (
                    <Setting close={setIsModalOpen} level={setModalLevel} />
                ) : <UserInfo close={setIsModalOpen} level={setModalLevel} />}
            </Modal>
        </>
    )
}

export default ThreadsList
