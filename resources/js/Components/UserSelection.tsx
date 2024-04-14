import { User } from '@/redux/types/user'
import React from 'react'
import Avatar from './Avatar'
import { IconCheck, IconX, IconSearch } from "@tabler/icons-react"
interface PageProps {
    lists: User[]
    selected: User[]
    addToSelected: (v: User[]) => void
}
const UserSelection: React.FC<PageProps> = ({ lists, selected, addToSelected }) => {
    const selectToContactsHandler = (user: User) => {
        if (selected.includes(user)) {
            const newSelected = selected.filter(s => s.id !== user.id)
            addToSelected(newSelected)
        } else {
            addToSelected([...selected, user])
        }
    }

    return (
        <div className='p-5 pt-2 flex flex-col'>
            <div className='flex flex-row flex-wrap'>

                {selected.length ? (
                    selected.map(selected => (
                        <div key={selected.id} className='flex items-center border-[1px] rounded-full space-x-1 p-1'>
                            <Avatar user={selected} w={8} h={8} />
                            <span className='first-letter:uppercase text-xs font-extralight'>{selected.username}</span>
                            <IconX className='h-3 cursor-pointer' onClick={() => selectToContactsHandler(selected)} />
                        </div>
                    ))
                ) : (
                    <div className="relative flex items-center w-full overflow-hidden text-gray-600 focus-within:text-gray-400">

                        <IconSearch className='h-6' />
                        <input type="search" name="q"
                            className="w-full py-2 text-sm text-white  border-0 focus:ring-0 text-left border-transparent appearance-none rounded-tg " style={{ borderRadius: "25px" }}
                            placeholder="Search..." autoComplete="off"

                        />
                    </div>
                )}
            </div>
            <div className='flex flex-row flex-wrap justify-start items-start cursor-pointer h-[380px] overflow-y-auto no-scrollbar  p-4'>
                {lists && lists.map(list => (
                    <div key={list.id} className='relative flex basis-1/4 mb-4'>

                        <div className='flex flex-col justify-center items-center w-full space-y-2' onClick={() => selectToContactsHandler(list)}>
                            <div className='relative w-fit h-fit'>
                                <Avatar h={16} w={16} user={list} selected={selected.includes(list)} />

                                {selected.includes(list) && (

                                    <div className='absolute bottom-0 right-0 -m-1 flex items-center ring-[3px] ring-white rounded-full'>
                                        <div className='bg-sky-600 rounded-full'>
                                            <IconCheck className='h-5 w-5 text-white p-1' stroke={3} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span>{list.username}</span>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserSelection
