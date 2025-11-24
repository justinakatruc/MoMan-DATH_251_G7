"use client";

import { ProfileCard } from "@/app/components/ProfileCard";
import { adminAPI } from "@/lib/api";
import { Search, Mail, EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type UserReturn = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  isActive: boolean;
  memberSince: string;
  transactions: number;
};

export default function UserPage() {
  const [usersList, setUsersList] = useState<UserReturn[]>([]);
  const [fullUserList, setFullUserList] = useState(usersList);
  const [filteredUsers, setFilteredUsers] = useState(usersList);
  const [displayUser, setDisplayUser] = useState<UserReturn | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [itemsList, setItemsList] = useState([
    {
      title: "Total Users",
      value: usersList.length.toString(),
    },
    {
      title: "Active Users",
      value: usersList
        .filter((user) => user.isActive === true)
        .length.toString(),
    },
    {
      title: "Inactive Users",
      value: usersList
        .filter((user) => user.isActive === false)
        .length.toString(),
    },
  ]);

  const [showOptions, setShowOptions] = useState<string | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [displayProfileModal, setDisplayProfileModal] =
    useState<boolean>(false);

  const fetchUsers = async () => {
    const result = await adminAPI.getAllUsers();

    if (result.success) {
      setUsersList(result.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [displayProfileModal]);

  const handleDeleteUser = async (userId: string) => {
    if (isLoading) return;

    setIsLoading(true);

    const result = await adminAPI.deleteUser(userId);

    if (result.success) {
      await fetchUsers();
      toast.success("User deleted successfully!");
    }

    setShowOptions(null);
    setIsLoading(false);
  };

  useEffect(() => {
    setFullUserList(usersList);
  }, [usersList]);

  useEffect(() => {
    setItemsList([
      {
        title: "Total Users",
        value: usersList.length.toString(),
      },
      {
        title: "Active Users",
        value: usersList
          .filter((user) => user.isActive === true)
          .length.toString(),
      },
      {
        title: "Inactive Users",
        value: usersList
          .filter((user) => user.isActive === false)
          .length.toString(),
      },
    ]);
  }, [usersList]);

  useEffect(() => {
    setFilteredUsers(
      fullUserList.filter(
        (user) =>
          (user.firstName + " " + user.lastName)
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, fullUserList]);

  useEffect(() => {
    setFilteredUsers(usersList);
  }, [usersList]);

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
    <div className="lg:px-6 mt-14">
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage and monitor all user accounts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsList.map((item, index) => (
            <div
              key={index}
              className="bg-white h-[188px] px-8 pt-6 rounded-[20px] flex flex-col gap-y-6"
            >
              <p className="font-medium text-[#000000] text-[16px] h-6">
                {item.title}
              </p>
              <p
                className={`font-bold text-[32px] ${
                  item.title === "Active Users" ? "text-[#07B681]" : ""
                } ${item.title === "Inactive Users" ? "text-[#FF5C5C]" : ""}`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="h-[567px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-[30px]">
          <div className="flex items-center border rounded-[10px] px-4 bg-[#F4F7FD]">
            <Search className="size-5 text-[rgba(0,0,0,0.5)]" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-12 py-0 px-3 border-none focus:outline-none"
            />
          </div>
          <div className="w-full">
            <div className="grid grid-cols-2 xl:grid-cols-6 gap-x-10 font-bold text-[16px]">
              <p className="">User</p>
              <p className="hidden xl:flex">Contact</p>
              <p className="hidden xl:flex xl:pl-4">Status</p>
              <p className="hidden xl:flex">Joined</p>
              <p className="hidden xl:flex">Transactions</p>
              <p className="text-left">Actions</p>
            </div>
            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 xl:grid-cols-6 gap-x-4 xl:gap-x-10 items-center py-3 border-t border-gray-200"
                >
                  <div className="flex items-center gap-x-2">
                    <div className="flex size-10 rounded-full bg-[#CFF0E7] items-center justify-center font-semibold text-[14px]">
                      {(user.firstName + " " + user.lastName)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-[16px]">
                        {user.firstName + " " + user.lastName}
                      </div>
                      <div className="text-[14px] text-[rgba(0,0,0,0.5)]">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                  <div className="hidden xl:flex items-center gap-x-2 flex-wrap">
                    <Mail className="size-4 text-[rgba(0,0,0,0.5)]" />
                    <div className="text-[14px] text-[#0A0A0A]">
                      {user.email}
                    </div>
                  </div>
                  <div
                    className={`hidden w-[100px] h-[35px] rounded-[15px] xl:flex items-center justify-center ${
                      user.isActive
                        ? "bg-[#CFF0E7] text-[#07B681]"
                        : "bg-[#FFE5E5] text-[#FF5C5C]"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="hidden xl:flex font-medium text-[14px] text-[#0A0A0A] pl-2">
                    {new Date(user.memberSince).toLocaleDateString()}
                  </div>
                  <div className="hidden xl:flex font-medium text-[16px] pl-12">
                    {user.transactions}
                  </div>
                  <div className="ml-5 lg:ml-0 w-20">
                    <div
                      className="flex items-center justify-center relative z-10"
                      onClick={() =>
                        setShowOptions(showOptions === user.id ? null : user.id)
                      }
                    >
                      <EllipsisVertical className="size-5 text-[rgba(0,0,0,0.5)] cursor-pointer" />
                      {showOptions === user.id && (
                        <div
                          ref={optionsRef}
                          className="absolute top-4 left-[50px] w-[120px] h-[100px] bg-[#ffffff] shadow-md rounded-[15px] px-1.5 py-4"
                        >
                          <ul className="flex flex-col gap-y-4 text-[15px]">
                            <li
                              className="hover:bg-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer px-1.5 py-1"
                              onClick={() => {
                                setDisplayUser({
                                  id: user.id,
                                  firstName: user.firstName,
                                  lastName: user.lastName,
                                  email: user.email,
                                  accountType: user.accountType,
                                  isActive: user.isActive,
                                  memberSince: user.memberSince,
                                  transactions: user.transactions,
                                });
                                setDisplayProfileModal(true);
                              }}
                            >
                              View Profile
                            </li>
                            <li
                              className="hover:bg-[rgba(0,0,0,0.1)] rounded-[5px] cursor-pointer px-1.5 py-1"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {displayUser && displayProfileModal && (
              <ProfileCard
                user={{
                  id: displayUser.id,
                  firstName: displayUser.firstName,
                  lastName: displayUser.lastName,
                  email: displayUser.email,
                  accountType: displayUser.accountType,
                  memberSince: displayUser.memberSince,
                }}
                setIsOpen={setDisplayProfileModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
