import { useEffect, useState } from "react"

export const useCountdown = (timestamp: number) => {
    const [countdown, setCountdown] = useState((timestamp * 1000) - Date.now())
    useEffect(() => {

        const timeout = setTimeout(() => {
            setCountdown((timestamp * 1000) - Date.now());

        }, 1000)
        return () => clearTimeout(timeout)
    }, [countdown])

    return makeHumanizeTs(countdown)
}

const makeHumanizeTs = (timeleft: number) => {
    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds]
}
