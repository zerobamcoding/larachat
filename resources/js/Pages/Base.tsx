import Messages from '@/Components/Messages'
import ThreadsList from '@/Components/ThreadsList'
import ThreadInfo from '@/Components/ThreadInfo'
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
import GroupInfo from '@/Components/Modals/GroupInfo'
import MessageMenu from '@/Components/Menu/MessageMenu'
import GroupUserMenu from '@/Components/Menu/GroupUserMenu'
import { Channel } from '@/redux/types/channel'
import CreateChannel from '@/Components/Modals/CreateChannel'

interface TypingThreadTypes {
    thread: number
    typing: boolean
}
const Base = () => {
    const { getMeAction, getThreads, addMessage, pinMessage, addOnlineUsersAction, removeOfflineUsersAction, addedToGroupAction, addedToChannelAction } = useActions();
    const [isDark, setIsDark] = useState<boolean>(localStorage.getItem("theme") && localStorage.getItem("theme") === 'dark' ? true : false);
    const { user, loading } = useTypedSelector(state => state.me)
    const { threads } = useTypedSelector(state => state.threads)
    const { users: onlines } = useTypedSelector(state => state.onlines)

    const [selectedThread, setSelectedThread] = useState<User | Direct | Group | Channel | null>(null)
    const [isShowCTXMenu, setIsShowCTXMenu] = useState(false)
    const [isShowGroupUserCTXMenu, setIsShowGroupUserCTXMenu] = useState(false)
    const [positionCTXMenu, setPositionCTXMenu] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [selectedMessageCTX, setSelectedMessageCTX] = useState<Message | null>(null)
    const [selectedUserGroupCTX, setSelectedUserGroupCTX] = useState<User | null>(null)
    const [reply, setReply] = useState<Message | null>(null)
    const [isShowUserInfo, setIsShowUserInfo] = useState(false)
    const [isShowCreateGropModal, setIsShowCreateGropModal] = useState(false)
    const [isShowCreateChannelModal, setIsShowCreateChannelModal] = useState(false)
    const [isShowGroupInfoModal, setIsShowGroupInfoModal] = useState(false)
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
            //@ts-ignore
            let newData = { ...selectedThread, messages: updateSelectedThred.messages, has_more: updateSelectedThred.has_more, page: updateSelectedThred.page }
            if (isGroup(updateSelectedThred) && updateSelectedThred.members) {
                //@ts-ignore
                newData = { ...newData, members: [...updateSelectedThred.members], must_join: false }
            }
            setSelectedThread(newData)
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

    const addedToChannelHandler = ({ channel }: { channel: Channel }) => {
        addedToChannelAction(channel)
    }
    useEffect(() => {
        if (user) {
            apiClient.post(route('user.online'))
            window.Echo.private(`user.${user.id}`)
                .listen(".new-message", (e: any) => { addMessage(e.message, "other") })
                .listen(".online-users", changeOnlineUsersHandler)
                .listen(".add-to-group", addedToGroupHandler)
                .listen(".add-to-channel", addedToChannelHandler)
                .listenForWhisper("typing", typingThreadHandler)
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
                createChannel={() => setIsShowCreateChannelModal(true)}
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
                showGroupInfo={() => setIsShowGroupInfoModal(true)}
                selectThread={setSelectedThread}
            />

            {isShowUserInfo && (
                <ThreadInfo
                    thread={selectedThread}
                    close={() => setIsShowUserInfo(false)}
                    onlines={onlines}
                />
            )}

            {isShowCTXMenu && selectedMessageCTX && selectedThread && user && (
                <RightClickMenu
                    position={positionCTXMenu}
                    close={() => setIsShowCTXMenu(false)}
                >
                    <MessageMenu
                        close={() => setIsShowCTXMenu(false)}
                        message={selectedMessageCTX}
                        reply={setReply}
                        pin={pinMessageHandler}
                        thread={selectedThread}
                        user={user}
                    />
                </RightClickMenu>
            )}

            {isShowGroupUserCTXMenu && (
                <RightClickMenu
                    position={positionCTXMenu}
                    close={() => setIsShowGroupUserCTXMenu(false)}
                >
                    {selectedUserGroupCTX && selectedThread ? (

                        <GroupUserMenu user={selectedUserGroupCTX} group_id={selectedThread?.id} closeMenu={() => setIsShowGroupUserCTXMenu(false)} />
                    ) : null}
                </RightClickMenu>
            )}
            <Modal show={isShowCreateGropModal} close={() => setIsShowCreateGropModal(false)} >
                <GroupName close={() => setIsShowCreateGropModal(false)} contacts={contacts} />
            </Modal>
            <Modal show={isShowCreateChannelModal} close={() => setIsShowCreateChannelModal(false)} >
                <CreateChannel close={() => setIsShowCreateChannelModal(false)} contacts={contacts} />
            </Modal>
            <Modal show={isShowGroupInfoModal} close={() => setIsShowGroupInfoModal(false)} >
                {selectedThread && isGroup(selectedThread) && user ? (

                    <GroupInfo
                        close={() => setIsShowGroupInfoModal(false)}
                        group={selectedThread}
                        user={user}
                        showCTXMenu={setIsShowGroupUserCTXMenu}
                        changeMenuPosition={setPositionCTXMenu}
                        selectUser={setSelectedUserGroupCTX} />
                ) : null}
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
