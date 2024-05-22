import { useEffect, FC } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { IconMicrophone, IconX, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'
interface PageProps {
    addToFile: React.Dispatch<React.SetStateAction<File[]>>
}
const VoiceRecorder: FC<PageProps> = ({ addToFile }) => {
    const recorderControls = useVoiceVisualizer();
    const {
        togglePauseResume,
        isPausedRecordedAudio,
        clearCanvas,
        isRecordingInProgress,
        startRecording,
        stopRecording,
        recordedBlob,
        error,
        audioRef,
    } = recorderControls;

    // Get the recorded audio blob
    useEffect(() => {
        if (!recordedBlob) return;

        const file = new File([recordedBlob], 'audio.webm', { type: 'audio/webm' })
        addToFile([file]);

    }, [recordedBlob, error]);

    // Get the error when it occurs
    useEffect(() => {
        if (!error) return;

        console.error(error);
    }, [error]);


    const startRecordingHandler = () => {
        startRecording()
    }
    const stopRecordingHandler = () => {
        stopRecording()
    }

    return (
        <>
            <div className="flex items-center">
                {recordedBlob ? (

                    <IconX height={24} className="text-rose-300 cursor-pointer" onClick={clearCanvas} />
                ) : null}
                <VoiceVisualizer
                    ref={audioRef}
                    controls={recorderControls}
                    width={100}
                    height={30}
                    barWidth={3}
                    mainBarColor="#38BDF8"
                    secondaryBarColor="#313C4C"
                    isProgressIndicatorShown={false}
                    isControlPanelShown={false}
                    isDefaultUIShown={false}
                    isProgressIndicatorTimeOnHoverShown={false}
                    isProgressIndicatorTimeShown={false} />
                {recordedBlob ?
                    isPausedRecordedAudio ? (
                        <IconPlayerPlay height={24} className="text-sky-400 cursor-pointer" onClick={togglePauseResume} />
                    ) : (
                        <IconPlayerPause height={24} className="text-sky-400 cursor-pointer" onClick={togglePauseResume} />
                    ) : null}
            </div>
            <div className={`rounded-full p-2 ${isRecordingInProgress ? 'bg-red-400 text-white animate-wiggle' : 'bg-white'} cursor-pointer`} onMouseDown={startRecordingHandler} onMouseUp={stopRecordingHandler}>
                <IconMicrophone width={24} height={24} />
            </div>
        </>
    );
}

export default VoiceRecorder
