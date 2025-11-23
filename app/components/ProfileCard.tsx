"use client";

import { Calendar, CircleUser, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { User } from "../model";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { useUserStore } from "../store/useUserStore";

interface ProfileCardProps {
  user: User;
  setIsOpen: (isOpen: boolean) => void;
}

type FormErrors = {
  [key: string]: string;
};

export function ProfileCard({ user, setIsOpen }: ProfileCardProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user: currentUser, setUser } = useUserStore();

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName) {
      newErrors.firstName = "First name is required";
    } else if (!validateName(firstName)) {
      newErrors.firstName = "First name can only contain letters";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    } else if (!validateName(lastName)) {
      newErrors.lastName = "Last name can only contain letters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (user.id === currentUser?.id) {
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleSaveChanges() {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await userAPI.updateUserProfile({
      firstName,
      lastName,
      email,
      password: newPassword.length > 0 ? newPassword : undefined,
    });

    if (result.success) {
      toast.success("Profile updated successfully");
      setUser(result.user);
      setIsOpen(false);
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    setIsLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-[20px] max-w-[800px] w-full mx-4 grid grid-cols-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="col-span-2 flex flex-col gap-y-3 items-center border-r py-6">
          <div className="size-20 lg:size-24 xl:size-32 rounded-full bg-[#CFF0E7] flex items-center justify-center font-bold text-[20px] xl:text-[34px]">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className="text-center font-bold text-[18px] lg:text-[20px] xl:text-[24px]">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-[12px] md:text-[14px] lg:text-[16px] text-[rgba(0,0,0,0.5)]">
            {user.email}
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="flex gap-x-3 items-center">
              <div className="size-9 bg-[#CFFDE7] flex items-center justify-center rounded-[10px]">
                <Calendar className="size-5 text-[#07B681]" />
              </div>
              <div>
                <p className="text-[12px] lg:text-[14px] text-[rgba(0,0,0,0.5)]">
                  Member since
                </p>
                <p className="font-medium text-[14px] lg:text-[16px]">
                  {new Date(user.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-x-3 items-center">
              <div className="size-9 bg-[#CFFDE7] flex items-center justify-center rounded-[10px]">
                <CircleUser className="size-5 text-[#07B681]" />
              </div>
              <div>
                <p className="text-[12px] lg:text-[14px] text-[rgba(0,0,0,0.5)]">
                  Account type
                </p>
                <p className="font-medium text-[14px] lg:text-[16px]">
                  {user.accountType}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 p-6 flex flex-col gap-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[20px] lg:text-[24px]">
              Profile Details
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col xl:flex-row justify-between gap-y-2 xl:gap-y-0 xl:gap-x-2">
            <div className="w-full xl:w-1/2 flex flex-col gap-y-4">
              <label className="font-medium text-[14px]">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F4F7FD]"
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
            <div className="w-full xl:w-1/2 flex flex-col gap-y-4">
              <label className="font-medium text-[14px]">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F4F7FD]"
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="w-full xl:w-1/2 flex flex-col gap-y-4">
            <label className="font-medium text-[14px]">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F4F7FD]"
            />
            {formErrors.email && (
              <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>
          {user.id === currentUser?.id && (
            <>
              <div className="w-full xl:w-1/2 flex flex-col gap-y-4 relative">
                <label className="block text-sm font-medium text-[#000000]">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  title="Password must contain at least one uppercase letter, one lowercase letter, and one number."
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F4F7FD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-13 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formErrors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div className="w-full xl:w-1/2 flex flex-col gap-y-4 relative">
                <label className="block text-sm font-medium text-[#000000]">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F4F7FD]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-13 text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </>
          )}
          <button
            className="mt-2 w-full h-12 bg-[#07B681] rounded-[10px] text-white font-semibold hover:bg-[#06a56c] transition-colors cursor-pointer"
            disabled={isLoading}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
