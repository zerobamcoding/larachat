import Messages from '@/Components/Messages'
import ThreadsList from '@/Components/ThreadsList'
import UserInfo from '@/Components/UserInfo'
import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import Modal from '@/utils/Modal'


const Base = () => {
    const [isDark, setIsDark] = useState<boolean>(localStorage.getItem("theme") && localStorage.getItem("theme") === 'dark' ? true : false);


    useEffect(() => {
        const theme = isDark ? "dark" : "light"
        localStorage.setItem("theme", theme)
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

    }, [isDark])

    // useEffect(() => {
    //     if (!localStorage.getItem("token")) {
    //         router.visit(route('register'))
    //     }

    // }, [])

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
