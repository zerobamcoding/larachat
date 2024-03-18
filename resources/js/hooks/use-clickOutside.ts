import { useEffect, useRef } from "react"

export const clickOutside = (callback: () => void) => {
    const ref = useRef<HTMLDivElement | HTMLUListElement>(null)

    useEffect(() => {
        const clickedOutsideHandler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback()
            }
        }
        document.addEventListener("mousedown", clickedOutsideHandler)
        return () => {
            document.removeEventListener("mousedown", clickedOutsideHandler)
        }
    }, [ref])
    return ref;
}
