import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { EllipsisVerticalIcon, MagnifyingGlassIcon, BellIcon, BellSlashIcon, Bars3Icon, PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { User } from '@/redux/types/user'
import { useActions } from '@/hooks/useActions'
import { Direct, Message } from '@/redux/types/chat'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import Modal from '@/utils/Modal'
import SendFile from './Modals/SendFile'
import Avatar from './Avatar'
import { isAnUser, isDirect, isGroup } from '@/utils/CheckType'
import { Group } from '@/redux/types/group'
import apiClient from '@/libs/apiClient'
import VoiceRecorder from './VoiceRecorder'
import AudioVisualize from './AudioVisualize'
import { Channel } from '@/redux/types/channel'
interface PageProps {
    thread: User | Direct | Group | null | Channel
    showCTXMenu: (v: boolean) => void
    changeMenuPosition: (v: { x: number, y: number }) => void
    selectedMessageCTX: (v: Message) => void
    reply: Message | null
    removeReply: () => void
    showInfo: () => void
    onlines: number[]
    showGroupInfo: () => void
    selectThread: React.Dispatch<React.SetStateAction<User | Direct | Group | Channel | null>>
}
const Messages: React.FC<PageProps> = ({ thread, showCTXMenu, changeMenuPosition, selectedMessageCTX, reply, removeReply, showInfo, onlines, showGroupInfo, selectThread }) => {
    const ref = useRef<HTMLDivElement>(null)
    const { user: me } = useTypedSelector(state => state.me)
    const { sendMessage, seenMessage, loadMoreMessage, joinThreadAction } = useActions()
    const [messageValue, setMessageValue] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const fileRef = useRef<HTMLInputElement>(null)
    const [isOpenFileModal, setIsOpenFileModal] = useState(false)
    const [caption, setCaption] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [pinnedMessages, setPinnedMessages] = useState<Message[]>([])
    const [shownPinnedMessage, setShownPinnedMessage] = useState<Message | null>(null)
    const [mustSeenMessages, setMustSeenMessages] = useState<Message[]>([])
    const [isSeen, setIsSeen] = useState<number[]>([])
    const [contact, setContact] = useState<User | null>(null)
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



    const scrollToView = (ref: any) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }


    useEffect(() => {
        if (thread && !isAnUser(thread)) {
            const pinned: Message[] = []
            const unseen: Message[] = []
            thread.messages?.map(m => {
                m.sender.id !== me?.id && !m.is_seen ? unseen.push(m) : null
                m.pinned ? pinned.push(m) : null
            })
            setShownPinnedMessage(pinned[pinned.length - 1])
            setPinnedMessages(pinned)
            setMustSeenMessages(unseen)
            if (me && isDirect(thread)) {
                const contactObj = me.id === thread.userone.id ? thread.usertwo : thread.userone
                setContact(contactObj)
            }
        }
        scrollToView(ref)
    }, [thread])

    useEffect(() => {
        console.log(contact)
    }, [contact])

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
        } else if (isDirect(thread)) {

            if (thread && contact) {
                formData.append("to", contact.id.toString())
                formData.append("model", "direct")
            }
        } else if (isGroup(thread)) {
            formData.append("to", thread.id.toString())
            formData.append("model", "group")
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
            if (isTyping) {
                //@ts-ignore
                window.Echo.private(`user.${contact?.id}`).whisper('typing', { thread: thread.id, typing: true })
            }
        }
    }, [isTyping, me, thread])

    const stopWhispering = () => {
        if (me && thread) {
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
        const merged = pinnedMessages.concat(mustSeenMessages)
        merged.forEach(item => {
            refs[item.id] = React.createRef()
        })
        return refs
    }, [pinnedMessages, mustSeenMessages])

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

    const getFullDate = (v: Date) => {
        const date = new Date(v)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    const [scrollTop, setScrollTop] = useState(1)
    const checkInViewHandler = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);

        if (mustSeenMessages.length) {
            mustSeenMessages.map(message => {
                const ref: React.RefObject<HTMLDivElement> = refsById[message.id]
                if (ref && ref.current) {

                    const top = ref.current.getBoundingClientRect().top;
                    if (top >= 0 && top + ref.current.clientHeight <= window.innerHeight) {
                        if (!isSeen.includes(message.id)) {

                            setIsSeen([...isSeen, message.id])
                        }
                    }
                }

            })
        }

    }

    useEffect(() => {
        if (scrollTop === 0 && thread && !isAnUser(thread) && thread.has_more) {
            loadMoreMessage(thread.id, thread.type, thread.page)
        }

    }, [scrollTop])

    useEffect(() => {
        if (isSeen.length) {
            const newUnseen = mustSeenMessages.filter(m => !isSeen.includes(m.id))
            setMustSeenMessages(newUnseen)
            seenMessage(isSeen[isSeen.length - 1])
        }
    }, [isSeen])

    const searchThreadHandler = async (str: string) => {
        const regex = /^(@|larachat.me\/)/
        const username = str.replace(regex, "");
        const { data } = await apiClient.post(route("chat.search.thread"), { link: username })
        if (data.thread) {
            selectThread(data.thread);

        }

    }

    const joinToThreadHandler = (thread: Direct | Group | Channel) => {
        joinThreadAction(thread.type, thread.id)
    }

    return (
        <div className="relative flex flex-col flex-1 bg-white dark:bg-slate-800">
            {thread && (

                <div className="z-20 flex flex-grow-0 flex-shrink-0 w-full pr-3  text-gray-600 dark:text-white">
                    <div className='mx-4 my-2'>
                        {isGroup(thread) ? (
                            <div className='flex flex-row items-center space-x-3' onClick={() => showGroupInfo()}>

                                <div className={`group relative overflow-hidden flex items-center justify-center w-12 h-12 text-xl font-semibold text-white bg-blue-500 rounded-full `}>
                                    <p>{thread.name.slice(0, 1).toUpperCase()}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <h3>{thread.name}</h3>
                                    <span className='font-extralight text-xs'>{thread.members_count} members</span>
                                </div>
                            </div>
                        ) : null}
                        {isDirect(thread) && contact && (

                            <Avatar h={12} w={12} user={contact} />
                        )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
                        {isDirect(thread) ? (

                            <div className="overflow-hidden text-base font-medium leading-tight  whitespace-no-wrap first-letter:uppercase">{contact?.name ?? contact?.username}</div>
                        ) : null}
                        {isDirect(thread) && contact && onlines.includes(contact.id) && (

                            <div className="overflow-hidden text-sm font-medium leading-tight  whitespace-no-wrap">Online</div>
                        )}
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
            <div className="top-0 bottom-0 left-0 right-0 flex flex-col flex-1 overflow-y-scroll no-scrollbar dark:bg-slate-800 bg-bottom bg-cover" onScroll={checkInViewHandler}>
                {thread ? (<>

                    <div className="self-center flex-1 w-full max-w-xl">
                        <div className="relative flex flex-col px-3 py-1 m-auto">
                            {thread && !isAnUser(thread) && !thread.has_more ? (

                                <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">{thread.type} was created</div>
                            ) : null}
                            {isAnUser(thread) ? (<p>User not implemented</p>) : (
                                <>
                                    {thread && thread.messages && thread.messages.length ? (
                                        <div className="self-center px-2 py-1 mx-0 my-1 text-sm  text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">{monthName[new Date(thread.messages[0].created_at).getMonth()]} {new Date(thread.messages[0].created_at).getDate()}</div>

                                    ) : null}
                                    {thread.messages && thread.messages.length ?
                                        thread.messages.map((message, index, elements) => (
                                            <React.Fragment key={message.id}>
                                                {message.type === "text" ? (
                                                    <div className={`flex flex-row w-fit space-x-3 items-center ${message.sender.id === me?.id ? 'self-start' : 'self-end'}`}>
                                                        {message.messageable_type.includes("Group") ? message.sender.id === me?.id && (elements[index + 1] && elements[index].sender.id !== elements[index + 1].sender.id) || (index === elements.length - 1 && message.sender.id === me?.id) ? (
                                                            <Avatar h={12} w={12} user={message.sender} />

                                                        ) : <div className='w-12 h-12'></div> : null}
                                                        <div onContextMenu={e => showMenu(e, message)} className={`flex flex-col rounded-t-lg  ${message.sender.id === me?.id ? 'bg-white rounded-r-lg' : 'bg-lime-400 rounded-l-lg'} w-fit my-2 shadow`}>
                                                            {message.replied && (
                                                                <div className='bg-slate-100 p-2 mx-2 mt-1 border-l-2 border-sky-400 rounded-md cursor-pointer'>
                                                                    <p className='text-xs font-extralight'>{message.replied.message}</p>
                                                                </div>
                                                            )}
                                                            <div className='flex flex-row'>

                                                                <div className={`p-4 text-sm `}>
                                                                    {message.message.split(" ").map(str => (
                                                                        /^(@|larachat.me)\S+/gm.test(str) ? <span onClick={() => searchThreadHandler(str)} className='text-blue-400 cursor-pointer hover:underline'>{`${str} `}</span> : `${str} `
                                                                    ))}

                                                                </div>
                                                                <div className='flex items-end text-xs text-gray-800 font-extralight pr-2 pb-2'>
                                                                    <span>{new Date(message.created_at).getHours()}:{new Date(message.created_at).getMinutes()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {message.messageable_type.includes("Group") ? message.sender.id !== me?.id && (elements[index + 1] && elements[index].sender.id !== elements[index + 1].sender.id) || (index === elements.length - 1 && message.sender.id !== me?.id) ? (
                                                            <Avatar h={12} w={12} user={message.sender} />
                                                        ) : <div className='w-12 h-12'></div> : null}
                                                    </div>
                                                ) : message.files?.split('.').pop() === 'webm' ? (
                                                    <div className={`flex flex-row w-fit space-x-3 items-center ${message.sender.id === me?.id ? 'self-start' : 'self-end'}`}>
                                                        {message.messageable_type.includes("Group") ? message.sender.id === me?.id && (elements[index + 1] && elements[index].sender.id !== elements[index + 1].sender.id) || (index === elements.length - 1 && message.sender.id === me?.id) ? (
                                                            <Avatar h={12} w={12} user={message.sender} />

                                                        ) : <div className='w-12 h-12'></div> : null}
                                                        <div onContextMenu={e => showMenu(e, message)} className={`flex flex-col rounded-t-lg  ${message.sender.id === me?.id ? 'bg-white rounded-r-lg' : 'bg-lime-400 rounded-l-lg'} w-fit my-2 shadow`}>
                                                            {message.replied && (
                                                                <div className='bg-slate-100 p-2 mx-2 mt-1 border-l-2 border-sky-400 rounded-md cursor-pointer'>
                                                                    <p className='text-xs font-extralight'>{message.replied.message}</p>
                                                                </div>
                                                            )}
                                                            <div className='flex flex-row'>
                                                                <AudioVisualize source={`storage/${message.files}`} />
                                                                <div className='flex items-end text-xs text-gray-800 font-extralight pr-2 pb-2'>
                                                                    <span>{new Date(message.created_at).getHours()}:{new Date(message.created_at).getMinutes()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div onContextMenu={e => showMenu(e, message)} className={`flex flex-col overflow-hidden rounded-t-lg  ${message.sender.id === me?.id ? 'self-start bg-white rounded-r-lg' : 'self-end bg-lime-400 rounded-l-lg'} w-fit my-2 shadow`}>
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
                                                {message.pinned || (message.sender.id !== me?.id && !message.is_seen) ? (
                                                    <div ref={refsById[message.id]} />
                                                ) : null}
                                                {elements[index + 1] && (
                                                    getFullDate(elements[index].created_at) < getFullDate(elements[index + 1].created_at) ?
                                                        (
                                                            <div className="self-center px-2 py-1 mx-0 my-1 text-sm w-fit text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">{monthName[new Date(elements[index + 1].created_at).getMonth()]} {new Date(elements[index + 1].created_at).getDate()}</div>

                                                        ) : null
                                                )}
                                            </React.Fragment>
                                        ))
                                        : null}
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
            {thread && !isAnUser(thread) && thread.must_join ? (
                <div className='flex items-center self-center w-full max-w-xl bg-green-500 rounded-full m-3 select-none cursor-pointer hover:scale-105 duration-300'
                    onClick={() => joinToThreadHandler(thread)}>
                    <div className="relative flex w-full p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                        <div className='w-full text-center font-semibold text-lg uppercase'>join</div>
                    </div>
                </div>
            ) : thread && (
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
                        <VoiceRecorder addToFile={setFiles} />
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
