import { ChangeEvent, useState, useRef, useEffect } from 'react'

interface OtpProps {
    length: number;
    className?: string
    values: string[]
    changeValue: React.Dispatch<React.SetStateAction<string[]>>
}
const OtpInputs: React.FC<OtpProps> = ({ length, className = "", values, changeValue }) => {

    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))


    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])
    const handleChangeValue = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { target: { value } } = e
        if (!/\d+/.test(value)) {
            return
        }

        const oldValues = [...values]
        oldValues[index] = value
        changeValue(oldValues)
        if (index + 1 < length) {
            inputRefs.current[index + 1]?.focus();
            inputRefs.current[index + 1]?.select();

        }
    }

    const handleFocusInput = (e: React.FocusEvent<HTMLInputElement, Element>, index: number) => {
        inputRefs.current[index]?.select()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const { key } = e
        if (key === "Backspace" && values[index] !== "") {
            const oldValues = [...values]
            oldValues[index] = ""
            changeValue(oldValues)
        }

    }
    return (
        values.map((otp, index) => (
            <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                className={className}
                type='text'
                maxLength={1}
                value={otp}
                onChange={e => handleChangeValue(e, index)}
                onFocus={e => handleFocusInput(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
            />
        ))
    )
}

export default OtpInputs