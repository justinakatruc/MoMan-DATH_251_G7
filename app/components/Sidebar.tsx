"use client"

import Image from 'next/image'
import { expenseCategories, incomeCategories } from '@/app/(main)/store/CategoryStore'
import { Category } from '@/app/model'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, BadgeDollarSign, LayoutDashboardIcon, ArrowRight, RefreshCcw, Menu } from 'lucide-react'
import Profile from './Profile'
import { useUserStore } from '../(main)/store/useUserStore'

export default function Sidebar() {
    const { user } = useUserStore()
    const expenses: Category[]  = expenseCategories
    const incomes: Category[] = incomeCategories
    const [showLabel, setShowLabel] = useState<number | null>(null)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const { clear } = useUserStore()


    const formatLink = (name: string) => {
        let lower = name.toLowerCase().trim();

        if (lower.includes('&')) {
            lower = lower.replace(/\s*&\s*/g, '&');
            return lower.replace(/\s+/g, '-');
        }

        return lower.replace(/\s+/g, '-');
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])


    return (
        <>
            <div className='lg:hidden w-full flex items-center justify-between flex-wrap py-2 px-1'>
                <Link
                    href={`/home`}
                    className='h-full flex items-center'
                >
                    <Image src="/logo.png" alt="Logo Icon" width={120} height={56} className='w-auto h-auto' />
                </Link>
                <ul className='flex gap-x-[10px] md:gap-x-[20px] items-center pr-4'>
                    {
                        pathname.includes('admin') ? <>
                            <Link
                                href={`/admin/dashboard`}
                                key={1} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(1), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <LayoutDashboardIcon className='size-[24px] md:size-[28px]' />
                                {showLabel === 1 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Dashboard
                                    </div>
                                )}
                            </Link>
                            <Link
                                href={`/admin/users`}
                                key={2} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(2), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <Users className='size-[24px] md:size-[28px]' />
                                {showLabel === 2 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Users
                                    </div>
                                )}
                            </Link>
                            <Link
                                href={`/admin/transactions`}
                                key={3} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(3), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <BadgeDollarSign className='size-[24px] md:size-[28px]' />
                                {showLabel === 3 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Transactions
                                    </div>
                                )}
                            </Link>
                            {
                                user ? 
                                    <div
                                        key={6} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                        onMouseEnter={() => {
                                            setTimeout(() => setShowLabel(6), 100)
                                        }}
                                        onMouseLeave={() => {
                                            setTimeout(() => setShowLabel(null), 100)
                                        }}
                                    >
                                        <Profile
                                            id={user!.id}
                                            firstName={user!.firstName}
                                            lastName={user!.lastName}
                                            email={user!.email}
                                            memberSince={user!.memberSince}
                                            accountType={user!.accountType}
                                        />
                                        {showLabel === 6 && (
                                            <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                                Profile
                                            </div>
                                        )}
                                    </div> 
                                : <></>
                            }
                        </> : <>
                            <Link
                                href={`/category`}
                                key={1} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(1), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <Image src="/category.png" alt="Category Icon" width={24} height={24} className='size-[24px] md:size-[28px]' />
                                {showLabel === 1 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Category
                                    </div>
                                )}
                            </Link>
                            <Link
                                href={`/scheduler`}
                                key={2} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(2), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <Image src="/calendar.png" alt="Scheduler Icon" width={24} height={24} className='size-[24px] md:size-[28px]' />
                                {showLabel === 2 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Scheduler
                                    </div>
                                )}
                            </Link>
                            <Link
                                href={`/report`}
                                key={3} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(3), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <Image src="/chart.png" alt="Report Icon" width={24} height={24} className='size-[24px] md:size-[28px]' />
                                {showLabel === 3 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Report
                                    </div>
                                )}
                            </Link>
                        </>
                    }
                    {
                        user?.accountType === "Admin" && (
                            <Link
                                href={pathname.includes("admin") ? "/home" : "/admin/dashboard"}
                                key={5} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative'
                                onMouseEnter={() => {
                                    setTimeout(() => setShowLabel(5), 100)
                                }}
                                onMouseLeave={() => {
                                    setTimeout(() => setShowLabel(null), 100)
                                }}
                            >
                                <RefreshCcw className='size-[24px] md:size-[28px]' />
                                {showLabel === 5 && (
                                    <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px]'>
                                        Change View
                                    </div>
                                )}
                            </Link>
                        )
                    }
                    <div ref={menuRef} className='relative'>
                        <li
                            key={4} className='size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] rounded-full border relative'
                            onMouseEnter={() => {
                                setTimeout(() => setShowLabel(4), 100)
                            }}
                            onMouseLeave={() => {
                                setTimeout(() => setShowLabel(null), 100)
                            }}
                            onClick={() => {
                                setTimeout(() => setShowLabel(null), 500)
                                setShowProfileMenu(!showProfileMenu)
                            }}
                        >
                            <Menu className='size-[24px] md:size-[28px]' />
                            {showLabel === 4 && (
                                <div className='absolute top-[65px] w-[80px] flex items-center justify-center text-[9px] font-semibold bg-[#080809] text-white py-1.5 px-2 rounded-[25px] z-[11]'>
                                    Menu
                                </div>
                            )}
                        </li>
                        {showProfileMenu && (
                            <div className='absolute top-[60px] right-0 w-[320px] md:w-[360px] h-[80px] bg-[#ffffff] shadow-md rounded-[15px] z-10'>
                                <div className='p-4 flex flex-col gap-y-3'>
    
                                    <div className='flex items-center cursor-pointer hover:bg-[rgba(226,229,233,0.3)] rounded-[10px] p-2' onClick={clear}>
                                        <div className='size-[36px] flex items-center justify-center bg-[#e2e5e9] rounded-full'>
                                            <Image src="/logout.png" alt="User Icon" width={20} height={20} className='size-[20px]' />
                                        </div>
                                        <div className='ml-4 text-[18px] font-semibold'>
                                            Log Out
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ul>
            </div>
            <div className="hidden lg:flex lg:w-[260px] h-screen md:bg-[#FBFDFF] flex-col items-center sticky left-0 top-0">
                <Link href={"/home"} className='w-full h-[70px] flex items-center'>
                    <Image src="/logo.png" alt="Menu Icon" width={155.7} height={70} className='w-[155.7px] h-full mx-auto' />
                </Link>
                {
                    !pathname.includes('admin') ? 
                        <div className='w-full flex flex-col overflow-y-auto'>
                            <ul className='flex flex-col gap-y-[8px] 2xl:gap-y-[20px] px-4 mb-3 2xl:mb-4 overflow-y-auto'>
                                <Link href={"/home"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/home" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <Image src="/home.png" alt="Home Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Home</div>
                                </Link>
                                <Link href={"/category"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/category" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <Image src="/category.png" alt="Category Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Category</div>
                                </Link>
                                <Link href={"/scheduler"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/scheduler" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <Image src="/calendar.png" alt="Scheduler Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Scheduler</div>
                                </Link>
                                <Link href={"/report"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/report" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <Image src="/chart.png" alt="Report Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Report</div>
                                </Link>
                            </ul>
                            <div className='max-h-[120px] xl:max-h-[155px] flex flex-col gap-y-1.5 2xl:gap-y-2.5 pl-4 mb-3 2xl:mb-4'>
                                <div className='text-[20px] xl:text-[22px] 2xl:text-[24px] font-bold pl-2 dark:text-[rgb(23,23,23)]'>Expense</div>
                                <ul className='flex flex-col gap-y-[8px] 2xl:gap-y-[20px] overflow-y-auto'>
                                    {expenses.map((category) => (
                                        <Link href={`/category/${formatLink(category.name)}`} key={category.id} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === `/${formatLink(category.name)}` ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                            <Image src={category.icon} alt="Money Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                            <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>{category.name}</div>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                            <div className='max-h-[120px] xl:max-h-[155px] flex flex-col gap-y-1.5 2xl:gap-y-2.5 pl-4 mb-3 2xl:mb-4'>
                                <div className='text-[20px] xl:text-[22px] 2xl:text-[24px] font-bold pl-2 dark:text-[rgb(23,23,23)]'>Income</div>
                                <ul className='flex flex-col gap-y-[8px] 2xl:gap-y-[20px] overflow-y-auto'>
                                    {incomes.map((category) => (
                                        <Link href={`/category/${formatLink(category.name)}`} key={category.id} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === `/${formatLink(category.name)}` ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                            <Image src={category.icon} alt="Money Icon" width={36} height={36} className='size-5 2xl:size-7 mr-2' />
                                            <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>{category.name}</div>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        </div> : 
                        <>
                            <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)] mb-4 2xl:mb-6'>Admin Dashboard</div>
                            <ul className='w-full flex flex-col gap-y-[10px] 2xl:gap-y-[20px] px-4 overflow-y-auto'>
                                <Link href={"/admin/dashboard"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/admin/dashboard" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <LayoutDashboardIcon className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Dashboard</div>
                                </Link>
                                <Link href={"/admin/users"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/admin/users" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <Users className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Users</div>
                                </Link>
                                <Link href={"/admin/transactions"} className={`w-full pl-[8px] pr-[4px] py-[4px] flex items-center cursor-pointer hover:bg-[#CFF0E7] hover:rounded-[10px] ${pathname === "/admin/transactions" ? "bg-[#CFF0E7] rounded-[10px]" : ""}`}>
                                    <BadgeDollarSign className='size-5 2xl:size-7 mr-2' />
                                    <div className='text-[15px] 2xl:text-[17px] font-bold dark:text-[rgb(23,23,23)]'>Transactions</div>
                                </Link>
                            </ul>
                        </>
                }
                <div className='w-full flex flex-1 px-4 items-end mb-4'>
                    <div className='w-full flex flex-col gap-y-4'>
                        {
                            user?.accountType === "Admin" && (
                                <>
                                    <div className='h-[40px] xl:h-[45px] 2xl:h-[60px] bg-[#F4F7FD] rounded-[20px] px-4 flex gap-x-3 items-center'>
                                        <Profile
                                            id={user!.id}
                                            firstName={user!.firstName}
                                            lastName={user!.lastName}
                                            email={user!.email}
                                            memberSince={user!.memberSince}
                                            accountType={user!.accountType}
                                        />
                                        <div>
                                            <div className='text-[14px] font-semibold'>{user!.firstName} {user!.lastName}</div>
                                            <div className='text-[12px] font-medium text-[rgba(0,0,0,0.6)]'>{user!.email}</div>
                                        </div>
                                    </div>
                                    <Link href={pathname.includes("admin") ? "/home" : "/admin/dashboard"} className='flex items-center justify-center h-[40px] xl:h-[45px] 2xl:h-[60px] bg-[#F4F7FD] hover:bg-[#E0E4EA] cursor-pointer rounded-[20px] font-semibold text-[15px] xl:text-[17px] 2xl:text-[19px]'>
                                        <div className='flex flex-row gap-x-2 items-center justify-center'>
                                            <ArrowRight className='rotate-180 size-5 2xl:size-6' />
                                            <div>Switch View</div>
                                        </div>
                                    </Link>
                                </>
                            )
                        }
                        <button 
                            className='h-[40px] xl:h-[45px] 2xl:h-[60px] bg-[rgba(235,106,99,0.91)] hover:bg-[rgba(235,106,99,1)] cursor-pointer rounded-[20px] text-white font-semibold text-[15px] xl:text-[17px] 2xl:text-[19px]'
                            onClick={clear}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
