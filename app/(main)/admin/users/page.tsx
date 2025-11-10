"use client"

import { ProfileCard } from '@/app/components/ProfileCard';
import { User } from '@/app/model';
import { Search, Mail, EllipsisVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '../../store/useUserStore';
import { redirect } from 'next/navigation';

export default function UserPage() {
  const { user } = useUserStore();
  if (!user) redirect("/login");

  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      transactions: '45',
      balance: '1,200',
      joined: '2022-01-15',
      accountType: 'Student',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      transactions: '30',
      balance: '800',
      joined: '2022-02-10',
      accountType: 'Student',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'Active',
      transactions: '25',
      balance: '600',
      joined: '2022-03-05',   
      accountType: 'Student',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      status: 'Active',
      transactions: '50',
      balance: '1,000',
      joined: '2022-04-20',
      accountType: 'Worker',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      status: 'Inactive',
      transactions: '15',
      balance: '300',
      joined: '2022-05-18',
      accountType: 'Worker',
    },
    {
        id: 6,
        name: 'Emily Davis',
        email: 'emily@example.com',
        status: 'Suspended',
        transactions: '40',
        balance: '900',
        joined: '2022-06-22',
        accountType: 'Worker',
    },
    {
        id: 7,
        name: 'David Wilson',
        email: 'david@example.com',
        status: 'Inactive',
        transactions: '10',
        balance: '200',
        joined: '2022-07-30',
        accountType: 'Student',
    }
  ]);
  const [fullUserList] = useState(usersList);
  const [filteredUsers, setFilteredUsers] = useState(usersList);
  const [displayUser, setDisplayUser] = useState<User | null>(null);

  const [itemsList, setItemsList] = useState([
    {
      title: 'Total Users',
      value: usersList.length.toString(),
    },
    {
      title: 'Active Users',
      value: usersList.filter(user => user.status === 'Active').length.toString(),
    },
    {
      title: 'Inactive Users',
      value: usersList.filter(user => user.status === 'Inactive').length.toString(),
    },
    {
      title: 'Suspended',
      value: usersList.filter(user => user.status === 'Suspended').length.toString(),
    }
  ]);

  const [showOptions, setShowOptions] = useState<number | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [displayProfileModal, setDisplayProfileModal] = useState<boolean>(false);

  const handleDeleteUser = (userId: number) => {
    setUsersList(usersList.filter(user => user.id !== userId));
    setShowOptions(null);
  }

  const handleSuspendUser = (userId: number) => {
    setUsersList(usersList.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Suspended' ? 'Active' : 'Suspended'
        }
      }
      return user;
    }));
  }

  useEffect(() => {
    setItemsList([
      {
        title: 'Total Users',
        value: usersList.length.toString(),
      },
      {
        title: 'Active Users',
        value: usersList.filter(user => user.status === 'Active').length.toString(),
      },
      {
        title: 'Inactive Users',
        value: usersList.filter(user => user.status === 'Inactive').length.toString(),
      },
      {
        title: 'Suspended',
        value: usersList.filter(user => user.status === 'Suspended').length.toString(),
      }
    ]);
  }, [usersList]);

  useEffect(() => {
    setFilteredUsers(
      fullUserList.filter(user =>
        user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        user.email.toLowerCase().includes(inputValue.toLowerCase())
      )
    )
  }, [inputValue, fullUserList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='lg:px-6 mt-14'>
      <div className='flex flex-col gap-y-12'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-gray-600'>Manage and monitor all user accounts</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {itemsList.map((item, index) => (
            <div key={index} className='bg-white h-[188px] px-8 pt-6 rounded-[20px] flex flex-col gap-y-6'>
              <p className='font-medium text-[#000000] text-[16px] h-6'>{item.title}</p>
              <p className={`font-bold text-[32px] ${item.title === "Active Users" ? 'text-[#07B681]' : ''} ${item.title === "Inactive Users" ? 'text-[rgba(0,0,0,0.4)]' : ''} ${item.title === "Suspended" ? 'text-[#ED7771]' : ''}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className='h-[567px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-[30px]'>
            <div className='flex items-center border rounded-[10px] px-4 bg-[#F4F7FD]'>
                <Search className='size-5 text-[rgba(0,0,0,0.5)]' />
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Search by name or email...' className='w-full h-12 py-0 px-3 border-none focus:outline-none' />
            </div>
            <div className='w-full'>
              <div className='grid grid-cols-3 xl:grid-cols-7 gap-x-10 font-bold text-[16px]'>
                <p className=''>User</p>
                <p className='hidden xl:flex'>Contact</p>
                <p className='pl-2 xl:pl-4'>Status</p>
                <p className='hidden xl:flex'>Joined</p>
                <p className='hidden xl:flex'>Transactions</p>
                <p className='hidden xl:flex'>Balance</p>
                <p className=''>Actions</p>
              </div>
              <div className='mt-4 max-h-[400px] overflow-y-auto'>
                {filteredUsers.map((user, index) => (
                    <div key={index} className='grid grid-cols-3 xl:grid-cols-7 gap-x-4 xl:gap-x-10 items-center py-3 border-t border-gray-200'>
                      <div className='flex items-center gap-x-2'>
                          <div className='flex size-10 rounded-full bg-[#CFF0E7] items-center justify-center font-semibold text-[14px]'>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                              <div className='font-medium text-[16px]'>
                                {user.name}
                              </div>
                              <div className='text-[14px] text-[rgba(0,0,0,0.5)]'>
                                ID: {user.id}
                              </div>
                          </div>
                      </div>
                      <div className='hidden xl:flex items-center gap-x-2 flex-wrap'>
                          <Mail className='size-4 text-[rgba(0,0,0,0.5)]' />
                          <div className='text-[14px] text-[#0A0A0A]'>
                            {user.email}
                          </div>
                      </div>
                      <div className={`w-[100px] h-[35px] rounded-[15px] flex items-center justify-center ${user.status === 'Active' ? 'bg-[#CFF0E7]' : user.status === 'Suspended' ? 'bg-[#FFCCCB] text-[#ED7771]' : 'bg-[#F0F0F0] text-[rgba(0,0,0,0.5)]'}`}>
                        {user.status}
                      </div>
                      <div className='hidden xl:flex font-medium text-[14px] text-[#0A0A0A] pl-2'>{user.joined}</div>
                      <div className='hidden xl:flex font-medium text-[16px] pl-4'>{user.transactions}</div>
                      <div className='hidden xl:flex font-semibold text-[16px] pl-4'>${user.balance}</div>
                      <div className='flex pl-8 relative'
                        onClick={() => setShowOptions(showOptions === user.id ? null : user.id)}
                      >
                        <EllipsisVertical className='size-5 text-[rgba(0,0,0,0.5)] cursor-pointer' />
                        {showOptions === user.id && (
                          <div ref={optionsRef} className='absolute top-[20px] left-[-85px] w-[120px] h-[150px] bg-[#ffffff] shadow-md rounded-[15px] px-1.5 py-4'>
                            <ul className='flex flex-col gap-y-4 text-[15px]'>
                              <li 
                                className='hover:bg-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer px-1.5 py-1'
                                onClick={() => {
                                  setDisplayUser({
                                    id: user.id,
                                    firstName: user.name.split(' ')[0],
                                    lastName: user.name.split(' ')[1],
                                    email: user.email,
                                    memberSince: user.joined,
                                    accountType: user.accountType,
                                  });
                                  setDisplayProfileModal(true);
                                }}
                              >
                                View Profile
                              </li>
                              <li 
                                className='hover:bg-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer px-1.5 py-1'
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </li>
                              <li 
                                className='hover:bg-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer px-1.5 py-1'
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                {
                                  user.status === "Suspended" ? "Unsuspend" : "Suspend"
                                }
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
              {
                displayUser && displayProfileModal && (
                  <ProfileCard 
                    user={displayUser}
                    setIsOpen={setDisplayProfileModal}
                  />
                )
              }
            </div>
        </div>
      </div>
    </div>
  )
}
