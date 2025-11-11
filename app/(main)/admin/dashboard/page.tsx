"use client"

import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const itemsList = [
    {
      title: 'Total Users',
      value: '1,234',
      percent: '+12.5%',
      icon: 'users',
    },
    {
      title: 'Total Transactions',
      value: '$56,789',
      percent: '+8.3%',
      icon: 'transactions',
    },
    {
      title: 'Revenue',
      value: '$123,456',
      percent: '+15.2%',
      icon: 'revenue',
    },
    {
      title: 'Active Users',
      value: '567',
      percent: '+5.6%',
      icon: 'activeUsers',
    }
  ]

  const recentUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      transactions: '45',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      transactions: '30',
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'Active',
      transactions: '25',
    },
    {
      name: 'Alice Williams',
      email: 'alice@example.com',
      status: 'Active',
      transactions: '50',
    },
    {
      name: 'Michael Brown',
      email: 'michael@example.com',
      status: 'Inactive',
      transactions: '15',
    }
  ]

  const recentTransactions = [
    {
      user: 'John Doe',
      date: '2024-06-01',
      type: 'expense',
      category: 'Food & Drink',
      amount: '$45.67',
    },
    {
      user: 'Jane Smith',
      date: '2024-06-02',
      type: 'expense',
      category: 'Shopping',
      amount: '$89.23',
    },
    {
      user: 'Bob Johnson',
      date: '2024-06-03',
      type: 'income',
      category: 'Salary',
      amount: '$120.00',
    },
    {
      user: 'Alice Williams',
      date: '2024-06-04',
      type: 'expense',
      category: 'Entertainment',
      amount: '$60.50',
    },
    {
      user: 'Michael Brown',
      date: '2024-06-05',
      type: 'expense',
      category: 'Transportation',
      amount: '$30.75',
    }
  ]

  return (
    <div className='px-6 mt-14'>
      <div className='flex flex-col gap-y-12'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
          <p className='text-gray-600'>Overview of system performance and user activity</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {itemsList.map((item, index) => (
            <div key={index} className='bg-white h-[200px] px-8 pt-6 rounded-[20px] flex flex-col gap-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-center size-12 bg-[rgba(7,182,129,0.125)] rounded-[10px]'>
                  {
                    item.icon === 'users' ? <Users className='size-[24px] text-[#07B681]' /> :
                    item.icon === 'transactions' ? <Activity className='size-[24px] text-[#07B681]' /> :
                    item.icon === 'revenue' ? <DollarSign className='size-[24px] text-[#07B681]' /> :
                    <TrendingUp className='size-[24px] text-[#07B681]' />
                  }
                </div>
                <div>
                  <p className='text-lg text-[#07B681]'>{item.percent}</p>
                </div>
              </div>
              <p className='font-medium text-[#000000] text-[16px] h-6'>{item.title}</p>
              <p className='font-bold text-[24px] 2xl:text-[32px] text-[#000000]'>{item.value}</p>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-[450.68px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-[36px]'>
            <h2 className='font-medium text-[24px] 2xl:text-[32px]'>
              Recent Users
            </h2>
            <div className='w-full'>
              <div className='grid grid-cols-3 gap-x-2 font-bold text-[16px]'>
                <p>Name</p>
                <p>Status</p>
                <p>Transactions</p>
              </div>
              <div className='mt-4 max-h-[300px] overflow-y-auto'>
                {recentUsers.map((user, index) => (
                  <div key={index} className='grid grid-cols-3 gap-x-2 items-center py-3 border-t border-gray-200'>
                    <div>
                      <div className='font-medium text-[16px]'>
                        {user.name}
                      </div>
                      <div className='text-[14px] text-[rgba(0,0,0,0.5)]'>
                        {user.email}
                      </div>
                    </div>
                    <div className={`w-[80px] h-[35px] rounded-[15px] flex items-center justify-center ${user.status === 'Active' ? 'bg-[#CFF0E7]' : 'bg-[#F0F0F0] text-[rgba(0,0,0,0.5)]'}`}>
                      {user.status}
                    </div>
                    <div className='font-medium text-[16px] pl-4'>{user.transactions}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='h-[450.68px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-[36px]'>
            <h2 className='font-medium text-[24px] 2xl:text-[32px]'>
              Recent Transactions
            </h2>
            <div className='w-full'>
              <div className='grid grid-cols-3 gap-x-2 font-bold text-[16px]'>
                <p>User</p>
                <p>Category</p>
                <p>Amount</p>
              </div>
              <div className='mt-4 max-h-[300px] overflow-y-auto'>
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className='grid grid-cols-3 gap-x-2 items-center py-3 border-t border-gray-200'>
                    <div>
                      <div className='font-medium text-[16px]'>
                        {transaction.user}
                      </div>
                      <div className='text-[14px] text-[rgba(0,0,0,0.5)]'>
                        {transaction.date}
                      </div>
                    </div>
                    <div className='pl-2 font-medium text-[16px]'>
                      {transaction.category}
                    </div>
                    <div className={`font-medium text-[16px] pl-4 ${transaction.type === 'income' ? 'text-[#37C39A]' : 'text-[#ED7771]'}`}>
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
