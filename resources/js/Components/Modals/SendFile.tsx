import React, { useEffect, useState } from 'react'
import { EllipsisVerticalIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PageProps {
    close: (v: boolean) => void
    files: File[]
    caption: string
    setCaption: (v: string) => void
    send: () => void
}
const SendFile: React.FC<PageProps> = ({ close, files, caption, setCaption, send }) => {
    const [blobs, setBlobs] = useState<string[]>([])
    useEffect(() => {
        if (files) {
            const urls = files.map(file => URL.createObjectURL(file))
            setBlobs(urls)
        }
    }, [files])
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between mb-6 p-5 pb-0'>
                <h3 className='text-lg font-bold'>Send File</h3>
                <div className='flex space-x-3'>
                    <XMarkIcon className='h-5 cursor-pointer' onClick={() => close(false)} />
                </div>
            </div>
            {blobs.map((file, i) => (
                <img key={i} src={file} alt={`Selected file ${i}`} />
            ))}
            <textarea
                className='border-0 focus:ring-0 resize-none'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='caption'
            ></textarea>
            <div className='flex self-end space-x-3 pr-5'>
                <span className='px-3 py-2 border-[1px] bg-green-400 rounded-md cursor-pointer' onClick={send}>Send</span>
                <span className='px-3 py-2 border-[1px] bg-orange-400 rounded-md cursor-pointer' onClick={() => close(false)}>Cancel</span>
            </div>
        </div>
    )
}

export default SendFile
