import WavesurferPlayer from '@wavesurfer/react'
import React, { useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'

interface PageProps {
    source: string
}
const AudioVisualize: React.FC<PageProps> = ({ source }) => {
    const [wavesurfer, setWavesurfer] = useState({} as WaveSurfer)
    const [isPlaying, setIsPlaying] = useState(false)

    const onReady = (ws: any) => {
        setWavesurfer(ws)
        setIsPlaying(false)
    }

    const onPlayPause = () => {
        wavesurfer && wavesurfer.playPause()
    }

    return (
        <div className='flex items-center gap-2'>
            {wavesurfer ? (

                <div className='p-2 my-2 ml-2 cursor-pointer rounded-full bg-sky-400 ring-1 ring-sky-400 ring-offset-2 w-fit text-white'>
                    {isPlaying ? (
                        <IconPlayerPause width={24} onClick={onPlayPause} />
                    ) : (

                        <IconPlayerPlay width={24} onClick={onPlayPause} />
                    )}
                </div>
            ) : null}
            <div className='w-full'>

                <WavesurferPlayer
                    height={30}
                    waveColor="#38BDF8"
                    progressColor='#313C4C'
                    url={source}
                    onReady={onReady}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    barWidth={3}
                    cursorWidth={0}
                    fillParent={false}
                    minPxPerSec={10}
                />
            </div>


        </div>
    )
}

export default AudioVisualize;
