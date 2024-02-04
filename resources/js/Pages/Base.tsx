import Messages from '@/Components/Messages'
import ThreadsList from '@/Components/ThreadsList'
import UserInfo from '@/Components/UserInfo'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { useActions } from '@/hooks/useActions'
const Base = () => {
    const { getMeAction } = useActions();
    const [isDark, setIsDark] = useState<boolean>(localStorage.getItem("theme") && localStorage.getItem("theme") === 'dark' ? true : false);
    const { user } = useTypedSelector(state => state.me)

    useEffect(() => {
        if (!user) getMeAction();
    }, [])

    useEffect(() => {
        console.log(user);

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
            <ThreadsList dark={isDark} changeTheme={setIsDark} />

            <Messages />

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
