import React, { ChangeEvent, useRef } from 'react'
import { useTypedSelector } from '@/hooks/use-typed-selector'
import { CameraIcon } from '@heroicons/react/24/outline';
import { useActions } from '@/hooks/useActions';
interface AvatarProps {
    h: number;
    w: number;
}
const Avatar: React.FC<AvatarProps> = ({ h, w }) => {
    const { changeAvatar } = useActions();
    const changeAvatarHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files[0]) {

            const formData = new FormData();
            formData.append("file", files[0])
            changeAvatar(formData)
        }
    }
    const imageRef = useRef<HTMLInputElement>(null)
    const { user } = useTypedSelector(state => state.me)
    return (
        <div className={`group relative overflow-hidden flex items-center justify-center w-${w} h-${h} text-xl font-semibold text-white bg-blue-500 rounded-full`}>
            {user && user.avatar ? (

                <img className="object-cover w-full h-full rounded-full" src={`storage/${user.avatar}`} alt={`${user.username} avatar`} />
            ) : (<p>{user?.username.slice(0, 1).toUpperCase()}</p>)}
            <div
                onClick={() => imageRef.current?.click()}
                className='absolute bottom-0 left-0 bg-black w-full p-1 flex items-center justify-center opacity-75 translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer'>
                <CameraIcon className='h-5' />
            </div>
            <input type="file" className='hidden' ref={imageRef} onChange={changeAvatarHandler} />
        </div>
    )
}

export default Avatar
