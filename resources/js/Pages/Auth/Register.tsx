import { useEffect, FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import OtpInputs from '@/Components/OtpInputs';
import axios from 'axios';
import CountdownTimer from '@/utils/CountdownTimer';
import { AuthResponse, ValidationErrors } from '@/types';



type AuthLevel = "mobile" | "otp" | "user"

const Register = () => {
    const otpLength = 5
    const [level, setLevel] = useState<AuthLevel>("mobile")
    const [otps, setOtps] = useState<string[]>(Array(otpLength).fill(""))
    const [expireAt, setExpireAt] = useState(0)

    const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null)

    const [username, setUsername] = useState("")
    const { data, setData, post, processing, errors, reset } = useForm({
        mobile: '',
    });

    const sendMobile = async () => {
        const { data: otpData }: { data: AuthResponse } = await axios.post(route('auth.otp'), data);
        if (otpData.success && otpData.expire) {
            setExpireAt(otpData.expire);
            setLevel("otp")
        } else if (!otpData.success && otpData.errors) setValidationErrors(otpData.errors)
    }


    const changeLevel = (level: AuthLevel) => {
        if (level === "otp") {

            if (data.mobile !== "") {
                sendMobile();
                // setLevel(level)
            }
        } else if (level === "user") {
            sendOtp()
            // setLevel(level)
        }
    }

    const sendOtp = async () => {
        let flag = true
        otps.map(otp => {
            otp === "" ? flag = false : ""
        })

        if (flag) {

            const { data: otpRes }: { data: AuthResponse } = await axios.post(route('auth.check.otp'), { "mobile": data.mobile, "code": otps.join("") });
            if (!otpRes.success && otpRes.errors) {
                setValidationErrors(otpRes.errors)
                return
            }

            else if (otpRes.token) {
                localStorage.setItem("token", otpRes.token);
                router.visit(route("index"))
                return
            }
            setValidationErrors(null)
            setLevel("user")
        }


    }

    const checkUsernameReq = async () => {
        const { data: usernameRes }: { data: AuthResponse } = await axios.post(route('auth.check.username'), { "username": username });
        if (!usernameRes.success && usernameRes.errors) {
            setValidationErrors(usernameRes.errors)
            return
        }
        setValidationErrors(null)
    }

    useEffect(() => {
        if (username.length >= 3) {
            const debounce = setTimeout(() => {
                checkUsernameReq()
            }, 500)
            return () => clearTimeout(debounce)
        }
    }, [username])

    const doRegister = async () => {
        if (!validationErrors) {
            const { data: registerResponse }: { data: AuthResponse } = await axios.post(route('auth.register'), { "username": username, "mobile": data.mobile });

            if (registerResponse.success && registerResponse.token) {
                localStorage.setItem("token", registerResponse.token);
                router.visit(route("index"))
            }
        }
    }

    useEffect(() => {
        console.log(validationErrors);
    }, [validationErrors])
    return (
        <GuestLayout>
            <Head title="Register" />
            {/*
            <form onSubmit={submit}>

            </form> */}
            <form className='flex justify-center space-x-2 '>
                <div className='flex flex-col'>
                    {level === "mobile" ? (
                        <>
                            <div className='w-full mb-8'>
                                <label className="block dark:text-white text-sm font-bold mb-2">
                                    Mobile
                                </label>
                                <input className='input-theme' type='text' value={data.mobile} onChange={(e) => setData("mobile", e.target.value)} placeholder='09**********' />
                            </div>
                            {validationErrors && validationErrors.mobile && validationErrors.mobile.map((v, i) => <p key={i} className='font-thin text-xs text-red-400 mb-2'>{v}</p>)}
                            <button type="button"
                                className='p-3 border-[1px] hover:border-none border-slate-700 dark:text-white rounded-md hover:bg-green-400 hover:text-white duration-300'
                                onClick={() => changeLevel("otp")}>Next</button>
                        </>
                    ) : level === "otp" ? (
                        <>
                            <div className='flex space-x-2 items-center mb-8'>
                                <OtpInputs length={otpLength} values={otps} changeValue={setOtps} className="h-14 w-14 input-theme" />

                                <CountdownTimer timeleft={expireAt} resend={sendMobile
                                } />

                            </div>
                            {validationErrors && validationErrors.otp && validationErrors.otp.map((v, i) => <p key={i} className='font-thin text-xs text-red-400 mb-2'>{v}</p>)}
                            <button type="button"
                                className={`p-3 border-[1px] hover:border-none ${validationErrors && validationErrors.otp ? "border-red-700 hover:bg-red-400" : "border-slate-700 hover:bg-green-400"} dark:text-white rounded-md  hover:text-white duration-300`}
                                onClick={() => changeLevel("user")}>Next</button>
                        </>

                    ) : (<>
                        <div className='w-full mb-8'>
                            <label className="block dark:text-white text-sm font-bold mb-2">
                                Username
                            </label>
                            <input className={`input-theme`} type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        {validationErrors && validationErrors.username && validationErrors.username.map((v, i) => <p key={i} className='font-thin text-xs text-red-400 mb-2'>{v}</p>)}

                        <button type="button"
                            className='p-3 border-[1px] hover:border-none border-slate-700 dark:text-white rounded-md hover:bg-green-400 hover:text-white duration-300'
                            onClick={doRegister}>Register</button>
                    </>)}
                </div>
            </form>
        </GuestLayout >
    );
}

export default () => {
    if (localStorage.getItem("token")) {
        router.visit(route('index'))
        return
    }
    return <Register />
}
