import React, { useRef } from 'react'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { CameraIcon } from '@heroicons/react/24/outline';

interface AvatarProps {
    h: number;
    w: number;
}
const Avatar: React.FC<AvatarProps> = ({ h, w }) => {
    const imageRef = useRef<HTMLInputElement>(null)
    const { user } = useTypedSelector(state => state.me)
    return (
        <div className={`group relative overflow-hidden flex items-center justify-center w-${w} h-${h} text-xl font-semibold text-white bg-blue-500 rounded-full flex-no-shrink`}>
            {user && user.avatar ? (

                <img className="object-cover w-full h-full rounded-full" src="https://images.unsplash.com/photo-1589127097756-b2750896a728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100" alt="" />
            ) : (<p>{user?.username.slice(0, 1).toUpperCase()}</p>)}
            <div
                onClick={() => imageRef.current?.click()}
                className='absolute bottom-0 left-0 bg-black w-full p-1 flex items-center justify-center opacity-75 translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer'>
                <CameraIcon className='h-5' />
            </div>
            <input type="file" className='hidden' ref={imageRef} />
        </div>
    )
}

export default Avatar
