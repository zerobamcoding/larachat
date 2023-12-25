import { useCountdown } from '@/hooks/use-countdownTimer'
import React from 'react'

interface PageProps {
    timeleft: number
    resend: () => void
}
const CountdownTimer: React.FC<PageProps> = ({ timeleft, resend }) => {
    const [days, hours, minutes, seconds] = useCountdown(timeleft)

    return (
        <div className='dark:text-white'>{minutes + seconds > 0 ? <span>{`${minutes}:${seconds}`}</span> : <button type='button' onClick={resend} className='p-3 rounded-md border-[1px] '>Resend Code</button>}</div>
    )
}

export default CountdownTimer