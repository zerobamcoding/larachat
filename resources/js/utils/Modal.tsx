import React, { PropsWithChildren } from 'react'
import ReactDOM from "react-dom"
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';


type RodalAnimations = "zoom" |
    "fade" |
    "flip" |
    "door" |
    "rotate" |
    "slideUp" |
    "slideDown" |
    "slideLeft" |
    "slideRight"


interface PageProps {
    show: boolean
    close: (value: boolean) => void
    animation?: RodalAnimations
}


const customStyles = {
    minHeight: "700px",
    top: "20px",
    bottom: "auto",
    padding: "0px"
}
const Modal = ({ show, close, animation, children }: PropsWithChildren<PageProps>) => {
    const modalContent = (
        <Rodal visible={show} onClose={() => close(false)} animation={animation} showCloseButton={false} customStyles={customStyles}>
            {children}
        </Rodal>
    );

    return ReactDOM.createPortal(modalContent, document.querySelector("#modal-portal") as Element)
}

export default Modal
