import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { EllipsisVerticalIcon, MagnifyingGlassIcon, BellIcon, BellSlashIcon, Bars3Icon, PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { User } from '@/redux/types/user'
import { useActions } from '@/hooks/useActions'
import { Direct, Message } from '@/redux/types/chat'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import Modal from '@/utils/Modal'
import SendFile from './Modals/SendFile'
import Avatar from './Avatar'
interface PageProps {
    thread: User | Direct | null
    showCTXMenu: (v: boolean) => void
    changeMenuPosition: (v: { x: number, y: number }) => void
    selectedMessageCTX: (v: Message) => void
    reply: Message | null
    removeReply: () => void
    showInfo: () => void
}
const Messages: React.FC<PageProps> = ({ thread, showCTXMenu, changeMenuPosition, selectedMessageCTX, reply, removeReply, showInfo }) => {
    const ref = useRef<HTMLDivElement>(null)
    const { user: me } = useTypedSelector(state => state.me)
    const { sendMessage } = useActions()
    const [messageValue, setMessageValue] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const fileRef = useRef<HTMLInputElement>(null)
    const [isOpenFileModal, setIsOpenFileModal] = useState(false)
    const [caption, setCaption] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [pinnedMessages, setPinnedMessages] = useState<Message[]>([])
    const [shownPinnedMessage, setShownPinnedMessage] = useState<Message | null>(null)
    const [contact, setContact] = useState<User | null>(null)
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    const isAnUser = (obj: any): obj is User => {
        return "username" in obj;
    }

    const scrollToView = (ref: any) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }

    useEffect(() => {
        scrollToView(ref)
    }, [])

    useEffect(() => {
        if (thread && !isAnUser(thread)) {
            const pinned: Message[] = []
            thread.messages?.map(m => {
                m.pinned ? pinned.push(m) : null
            })
            setShownPinnedMessage(pinned[pinned.length - 1])
            setPinnedMessages(pinned)
            if (me) {
                const contactObj = me.id === thread.userone.id ? thread.usertwo : thread.userone
                setContact(contactObj)
            }
        }
        scrollToView(ref)
    }, [thread])

    const sendMessageHandler = () => {
        const formData = new FormData();

        if (files.length) {
            files.map((file: File) => {
                formData.append("files[]", file, file.name)
            })
            formData.append("type", "file")
        }

        if (isAnUser(thread)) {
            formData.append("to", thread.id.toString())
        } else {

            if (thread && contact) {
                formData.append("to", contact.id.toString())
            }
        }
        formData.append("message", caption.length ? caption : messageValue)
        reply ? formData.append("reply", reply.id.toString()) : null
        sendMessage(formData)
        setMessageValue("")
        closeModal()
        removeReply();
    }
    useEffect(() => {
        if (messageValue) {
            let timeout = null
            setIsTyping(true)

            const later = () => {
                setIsTyping(false)
                timeout = null
                stopWhispering()
            }
            if (!timeout) {
                timeout = setTimeout(later, 5000)
            }
        }
    }, [messageValue])

    useEffect(() => {
        if (me && thread) {
            //@ts-ignore

            if (isTyping) {
                //@ts-ignore
                window.Echo.private(`user.${contact?.id}`).whisper('typing', { thread: thread.id, typing: true })
            }
        }
    }, [isTyping, me, thread])

    const stopWhispering = () => {
        if (me && thread) {
            //@ts-ignore

            if (isTyping) {
                //@ts-ignore
                window.Echo.private(`user.${contact?.id}`).whisper('typing', { thread: thread.id, typing: false })
            }
        }
    }

    const changeFilesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files[0]) {
            setFiles([...files])
            setIsOpenFileModal(true)
        }
    }

    const closeModal = () => {
        setCaption("")
        setIsOpenFileModal(false)
        setFiles([])
    }

    const showMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, message: Message) => {
        e.preventDefault()
        changeMenuPosition({ x: e.pageX, y: e.pageY });
        selectedMessageCTX(message)
        showCTXMenu(true)
    }

    const refsById = useMemo(() => {
        const refs: any = {}
        pinnedMessages.forEach(item => {
            refs[item.id] = React.createRef()
        })
        return refs
    }, [pinnedMessages])
    const showPinnedMessageHandler = () => {
        if (shownPinnedMessage) {
            scrollToView(refsById[shownPinnedMessage.id])
            const pIndex = pinnedMessages.findIndex(p => p.id === shownPinnedMessage.id)
            if (pIndex > 0) {
                setShownPinnedMessage(pinnedMessages[pIndex - 1])
            } else if (pIndex === 0) {
                setShownPinnedMessage(pinnedMessages[pinnedMessages.length - 1])
            }
        }
    }
    return (
        <div className="relative flex flex-col flex-1 bg-white dark:bg-slate-800">
            {thread && (

                <div className="z-20 flex flex-grow-0 flex-shrink-0 w-full pr-3  text-gray-600 dark:text-white">
                    {/* <div className="w-12 h-12  bg-blue-500 bg-center bg-no-repeat bg-cover rounded-full cursor-pointer"
                        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=50)" }}>
                    </div> */}
                    {contact && (
                        <div className='mx-4 my-2'>

                            <Avatar h={12} w={12} user={contact} />
                        </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
                        <div className="overflow-hidden text-base font-medium leading-tight  whitespace-no-wrap first-letter:uppercase">{contact?.name ?? contact?.username}</div>
                        <div className="overflow-hidden text-sm font-medium leading-tight  whitespace-no-wrap">Online</div>
                    </div>
                    {shownPinnedMessage ? (

                        <div className="relative w-48 pl-2 my-3 border-l-2 border-blue-500 cursor-pointer lg:block" onClick={showPinnedMessageHandler}>
                            <div className="text-base font-medium text-blue-500">Pinned message</div>
                            <div className="text-sm font-normal ">{shownPinnedMessage.message}</div>
                        </div>
                    ) : null}
                    <button className="flex self-center p-2 ml-2  rounded-full focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <BellSlashIcon className='h-6' />
                    </button>
                    <button className="flex self-center p-2 ml-2 rounded-full focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <MagnifyingGlassIcon className='h-6' />
                    </button>
                    <button
                        onClick={showInfo}
                        type="button"
                        className="flex self-center p-2 ml-2 rounded-full md:block focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-300">
                        <EllipsisVerticalIcon className='h-6' />
                    </button>
                    <button className="p-2 text-gray-700 flex self-center rounded-full md:hidden focus:outline-none hover:text-gray-600 dark:hover:text-black hover:bg-gray-200">
                        <Bars3Icon className='h-6' />
                    </button>
                </div>
            )}
            <div className="top-0 bottom-0 left-0 right-0 flex flex-col flex-1 overflow-y-scroll no-scrollbar dark:bg-slate-800 bg-bottom bg-cover">
                {thread ? (<>

                    <div className="self-center flex-1 w-full max-w-xl">
                        <div className="relative flex flex-col px-3 py-1 m-auto">
                            <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">Channel was created</div>
                            {isAnUser(thread) ? (<p>User not implemented</p>) : (
                                <>
                                    {thread && thread.messages && (
                                        <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">{monthName[new Date(thread.messages[0].created_at).getMonth()]} {new Date(thread.messages[0].created_at).getDate()}</div>

                                    )}
                                    {thread.messages?.map((message, index, elements) => (
                                        <React.Fragment key={message.id}>
                                            {message.type === "text" ? (

                                                <div onContextMenu={e => showMenu(e, message)} className={`flex flex-col rounded-t-lg  ${message.sender === me?.id ? 'self-start bg-white rounded-r-lg' : 'self-end bg-lime-400 rounded-l-lg'} w-fit my-2 shadow`}>
                                                    {message.replied && (
                                                        <div className='bg-slate-100 p-2 mx-2 mt-1 border-l-2 border-sky-400 rounded-md cursor-pointer'>
                                                            <p className='text-xs font-extralight'>{message.replied.message}</p>
                                                        </div>
                                                    )}
                                                    <div className='flex flex-row'>

                                                        <div className={`p-4 text-sm `}>
                                                            {message.message}
                                                        </div>
                                                        <div className='flex items-end text-xs text-gray-800 font-extralight pr-2 pb-2'>
                                                            <span>{new Date(message.created_at).getHours()}:{new Date(message.created_at).getMinutes()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onContextMenu={e => showMenu(e, message)} className={`flex flex-col overflow-hidden rounded-t-lg  ${message.sender === me?.id ? 'self-start bg-white rounded-r-lg' : 'self-end bg-lime-400 rounded-l-lg'} w-fit my-2 shadow`}>
                                                    {message.files?.split(",").map((img, i) => (

                                                        <img key={i} className='p-2' src={`storage/${img}`} alt={'message file Type'} />
                                                    ))}
                                                    <div className='flex flex-row w-full'>

                                                        <div className={`p-4 text-sm w-full`}>
                                                            {message.message}
                                                        </div>
                                                        <div className='flex items-end text-xs text-gray-800 font-extralight pr-2 pb-2'>
                                                            <span>{new Date(message.created_at).getHours()}:{new Date(message.created_at).getMinutes()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {message.pinned ? (
                                                <div ref={refsById[message.id]} />
                                            ) : null}
                                            {elements[index + 1] && (
                                                new Date(elements[index].created_at).getDate() < new Date(elements[index + 1].created_at).getDate() ?
                                                    (
                                                        <div className="self-center px-2 py-1 mx-0 my-1 text-sm w-fit text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">{monthName[new Date(elements[index + 1].created_at).getMonth()]} {new Date(elements[index + 1].created_at).getDate()}</div>

                                                    ) : null
                                            )}
                                        </React.Fragment>
                                    ))}
                                </>
                            )}
                            <div ref={ref} />
                            {/* <div className="self-end w-3/4 my-2">
                                <div className="p-4 text-sm bg-white rounded-t-lg rounded-l-lg shadow">
                                    Use the buttons above the editor to test on them
                                </div>
                            </div> */}
                        </div>
                    </div>
                </>) : (
                    <div className='flex w-full h-full items-center justify-center dark:text-white select-none cursor-default'>
                        <p>Select a Chat to start messaging</p>
                    </div>
                )}
            </div>
            {thread && (
                <>
                    {reply && (
                        <div className='w-full max-w-xl flex flex-row self-center bg-slate-50 p-4 rounded-xl'>
                            <div className='w-full'>
                                <span className='text-gray-400'>Replying | </span>
                                <span>{reply.message}</span>
                            </div>
                            <div
                                className='cursor-pointer hover:text-red-600 duration-300'
                                onClick={() => removeReply()}>
                                <XMarkIcon className='h-5' />
                            </div>
                        </div>
                    )}
                    <div className='flex items-center self-center w-full max-w-xl'>
                        <div className="relative flex w-full p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
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
                        <div className='rounded-full p-3 cursor-pointer bg-sky-400 text-white'
                            onClick={() => fileRef.current?.click()}
                        >
                            <PaperClipIcon className='h-5' />
                        </div>
                        <input
                            type="file"
                            className='hidden'
                            ref={fileRef}
                            onChange={changeFilesHandler}
                            onClick={(e) => (e.target as HTMLInputElement).value = ""}
                            multiple />
                    </div>
                </>
            )
            }
            <Modal show={isOpenFileModal} close={closeModal}>
                <SendFile close={closeModal} files={files} caption={caption} setCaption={setCaption} send={sendMessageHandler} />
            </Modal>
        </div >
    )
}

export default Messages
