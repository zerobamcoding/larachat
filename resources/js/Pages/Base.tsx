import Messages from '@/Components/Messages'
import ThreadsList from '@/Components/ThreadsList'
import UserInfo from '@/Components/UserInfo'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { useActions } from '@/hooks/useActions'
import { User } from '@/redux/types/user'
import { Direct, Message } from '@/redux/types/chat'
import RightClickMenu from '@/Components/RightClickMenu'
import apiClient from '@/libs/apiClient'
import Modal from '@/utils/Modal'
import GroupName from '@/Components/Modals/GroupName'
import { Group } from '@/redux/types/group'
import { isDirect, isGroup } from '@/utils/CheckType'

interface TypingThreadTypes {
    thread: number
    typing: boolean
}
const Base = () => {
    const { getMeAction, getThreads, addMessage, pinMessage, addOnlineUsersAction, removeOfflineUsersAction, addedToGroupAction } = useActions();
    const [isDark, setIsDark] = useState<boolean>(localStorage.getItem("theme") && localStorage.getItem("theme") === 'dark' ? true : false);
    const { user, loading } = useTypedSelector(state => state.me)
    const { threads } = useTypedSelector(state => state.threads)
    const { users: onlines } = useTypedSelector(state => state.onlines)

    const [selectedThread, setSelectedThread] = useState<User | Direct | Group | null>(null)
    const [isShowCTXMenu, setIsShowCTXMenu] = useState(false)
    const [positionCTXMenu, setPositionCTXMenu] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [selectedMessageCTX, setSelectedMessageCTX] = useState<Message | null>(null)
    const [reply, setReply] = useState<Message | null>(null)
    const [isShowUserInfo, setIsShowUserInfo] = useState(false)
    const [isShowCreateGropModal, setIsShowCreateGropModal] = useState(false)
    const [contacts, setContacts] = useState<User[]>([])

    useEffect(() => {
        if (threads) {
            let ids: number[] = []
            let contactLists: User[] = []
            threads.map(th => {
                if (isDirect(th)) {
                    const contact = th.userone.id === user?.id ? th.usertwo : th.userone
                    if (contact.is_online) ids.push(contact.id)
                    if (contact.id !== user?.id) contactLists.push(contact)
                }
                if (isGroup(th)) {
                    window.Echo.private(`group.${th.id}`)
                        .listen('.add-message', (e: any) => addMessage(e.message, "other")
                        )
                }
            })
            addOnlineUsersAction(ids);
            setContacts(contactLists)
        }
        if (threads && selectedThread) {
            const updateSelectedThred = threads.filter(th => th.id === selectedThread.id)[0];
            setSelectedThread({ ...selectedThread, messages: updateSelectedThred.messages, has_more: updateSelectedThred.has_more, page: updateSelectedThred.page })
        }
    }, [threads])


    useEffect(() => {
        if (!user) getMeAction();
        if (!threads) getThreads()

        window.addEventListener("beforeunload", () => apiClient.post(route('user.ofline')))
    }, [])

    const addedToGroupHandler = ({ group }: { group: Group }) => {
        addedToGroupAction(group)
    }
    useEffect(() => {
        if (user) {
            apiClient.post(route('user.online'))
            window.Echo.private(`user.${user.id}`)
                .listen(".new-message", (e: any) => { addMessage(e.message, "other") })
                .listen(".online-users", changeOnlineUsersHandler)
                .listen(".add-to-group", addedToGroupHandler)
                .listenForWhisper("typing", (e: TypingThreadTypes) => { typingThreadHandler(e) })
        }

    }, [user])

    const changeOnlineUsersHandler = (e: { user: number, is_online: boolean }) => {
        if (e.is_online) {
            addOnlineUsersAction([e.user])
        } else {
            removeOfflineUsersAction([e.user])
        }
    }
    const [typingThreads, setTypingThreads] = useState<number[]>([])
    const typingThreadHandler = (e: TypingThreadTypes) => {
        if (e.typing) {
            setTypingThreads([...typingThreads, e.thread])
        } else {
            setTypingThreads(typingThreads.filter(th => th !== e.thread))
        }
    }

    useEffect(() => {
        const theme = isDark ? "dark" : "light"
        localStorage.setItem("theme", theme)
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

    }, [isDark])

    const pinMessageHandler = (message: Message, pin: boolean) => {
        pinMessage(message.id, pin);
    }

    return (
        <div className="relative flex w-full h-screen overflow-hidden antialiased bg-gray-200">
            <ThreadsList
                onlines={onlines}
                dark={isDark}
                changeTheme={setIsDark}
                selectThread={setSelectedThread}
                typingThreads={typingThreads}
                createGroup={() => setIsShowCreateGropModal(true)}
            />

            <Messages
                thread={selectedThread}
                showCTXMenu={setIsShowCTXMenu}
                changeMenuPosition={setPositionCTXMenu}
                selectedMessageCTX={setSelectedMessageCTX}
                reply={reply}
                removeReply={() => setReply(null)}
                showInfo={() => setIsShowUserInfo(!isShowUserInfo)}
                onlines={onlines}
            />

            {/* {isShowUserInfo && (
                <UserInfo
                    thread={selectedThread}
                    close={() => setIsShowUserInfo(false)}
                    onlines={onlines}
                />
            )}

            {isShowCTXMenu && selectedMessageCTX && (
                <RightClickMenu
                    position={positionCTXMenu}
                    close={() => setIsShowCTXMenu(false)}
                    message={selectedMessageCTX}
                    reply={setReply}
                    pin={pinMessageHandler}
                />
            )} */}
            <Modal show={isShowCreateGropModal} close={() => setIsShowCreateGropModal(false)} >
                <GroupName close={() => setIsShowCreateGropModal(false)} contacts={contacts} />
            </Modal>
        </div>
    )
}

export default () => {

    if (!localStorage.getItem("token")) {
        router.visit(route('register'))
        return
    }
    return (
        <Base />
    )
}
