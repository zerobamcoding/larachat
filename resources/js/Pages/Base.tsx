import Messages from '@/Components/Messages'
import ThreadsList from '@/Components/ThreadsList'
import UserInfo from '@/Components/UserInfo'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { useActions } from '@/hooks/useActions'
import { User } from '@/redux/types/user'
import { Direct } from '@/redux/types/chat'

const Base = () => {
    const { getMeAction, getThreads, addMessage } = useActions();
    const [isDark, setIsDark] = useState<boolean>(localStorage.getItem("theme") && localStorage.getItem("theme") === 'dark' ? true : false);
    const { user, loading } = useTypedSelector(state => state.me)
    const { threads } = useTypedSelector(state => state.threads)

    const [selectedThread, setSelectedThread] = useState<User | Direct | null>(null)

    useEffect(() => {
        if (threads && selectedThread) {
            const updateSelectedThred = threads.filter(th => th.id === selectedThread.id)[0];
            setSelectedThread(updateSelectedThred)
        }
    }, [threads])

    useEffect(() => {
        if (!user) getMeAction();
        if (!threads) getThreads()
    }, [])

    useEffect(() => {
        if (user) {

            window.Echo.private(`user.${user.id}`).listen(".new-message", (e: any) => {
                addMessage(e.message)
            })
        }

    }, [user])

    useEffect(() => {
        const theme = isDark ? "dark" : "light"
        localStorage.setItem("theme", theme)
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

    }, [isDark])


    return (
        <div className="relative flex w-full h-screen overflow-hidden antialiased bg-gray-200">
            <ThreadsList dark={isDark} changeTheme={setIsDark} selectThread={setSelectedThread} />

            <Messages thread={selectedThread} />

            <UserInfo />
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
