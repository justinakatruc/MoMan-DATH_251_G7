"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Category } from "@/app/model";
import TransactionButton from "@/app/components/TransactionButton";
import { useCategories } from "@/app/context/CategoryContext";

interface CategoryItemProps {
  category: Category;
  removeMode: boolean;
  onRemove: (categoryId: number, type: "expense" | "income") => void;
}

function CategoryItem({ category, removeMode, onRemove }: CategoryItemProps) {
  const isDefault = category.isDefault;
  return (
    <div className="flex items-center gap-3 p-3 select-none relative ">
      <div
        onClick={() => onRemove(category.id, category.type)}
        className="w-8 h-8 flex items-center"
      >
        <Image
          src={category.icon}
          alt={category.name}
          width={24}
          height={24}
          className={`w-6 h-6 absolute transition-opacity duration-500 ${
            !removeMode ? "opacity-100" : "opacity-0"
          }`}
        />
        <button
          className={`w-6 h-6 rounded-[8px] border-2absolute transition-opacity duration-1000 ${
            removeMode ? "opacity-100 z-50 shadow-md" : "opacity-0"
          } ${
            isDefault
              ? "bg-gray-300 border-2 border-gray-400"
              : "bg-red-500 border-2 border-red-700 cursor-pointer"
          }`}
        ></button>
      </div>
      <span className="text-lg lg:text-2xl font-medium">{category.name}</span>
    </div>
  );
}

interface AddCustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Category) => boolean;
  type: "expense" | "income";
  setErrorState: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddCustomCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
  type,
  setErrorState,
}: AddCustomCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("/category.png");

  const availableIcons = [
    "/food&drink.png",
    "/entertainment.png",
    "/shopping.png",
    "/transport.png",
    "/housing.png",
    "/utilities.png",
    "/salary.png",
    "/stock.png",
    "/savings.png",
    "/category.png",
    "/calendar.png",
    "/chart.png",
    "/home.png",
  ];

  const handleSubmit = () => {
    if (categoryName.trim()) {
      const newId = Date.now() + Math.floor(Math.random() * 1000);

      const newCategory: Category = {
        id: newId,
        type: type,
        name: categoryName.trim(),
        icon: selectedIcon,
        isDefault: false,
      };

      if (!onAddCategory(newCategory)) {
        setErrorState(true);
        return;
      }

      setCategoryName("");
      setSelectedIcon("/category.png");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6 z-50">
          <h2 className="text-xl font-bold text-gray-700">
            Add {type} Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <div className="flex items-start gap-4 mb-6 p-4 border border-gray-300 rounded-[12px]">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 mb-2">Icon</span>
            <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
              <Image
                src={selectedIcon}
                alt="Selected icon"
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="flex-1">
            <span className="text-sm text-gray-700 block mb-2">Name</span>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-[8px] focus:outline-none focus:border-green-500"
              maxLength={25}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {categoryName.length}/25
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Choose Icon:
          </h3>
          <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
            {availableIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => setSelectedIcon(icon)}
                className={`w-12 h-12 rounded-[8px] flex items-center justify-center border-2 transition-colors cursor-pointer ${
                  selectedIcon === icon
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-green-300"
                }`}
              >
                <Image src={icon} alt="Icon option" width={20} height={20} />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!categoryName.trim()}
          className={`w-full py-3 rounded-[12px] font-medium text-white transition-colors ${
            categoryName.trim()
              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [showAddModal, setShowAddModal] = useState<{
    type: "expense" | "income" | null;
  }>({ type: null });
  const {
    userExpenseCategories,
    userIncomeCategories,
    addCategory,
    removeCategory,
  } = useCategories();

  const [errorState, setErrorState] = useState(false);

  return (
    <>
      <div className="flex lg:ml-[260px] w-full h-full items-center justify-center">
        <div className="flex flex-col items-center min-h-screen gap-8 p-4 w-full lg:max-w-[95%]">
          <div className="flex flex-col w-full gap-4 select-none">
            <div className="flex lg:hidden items-center justify-between">
              <h1 className="text-3xl font-bold text-black">Category</h1>
              <div className="flex items-center">
                <TransactionButton />
                {/* Logo goes here */}
              </div>
            </div>
            {/* Header */}
            <div className="flex items-center gap-4 lg:justify-between">
              <h1 className="hidden lg:block text-4xl font-bold text-black lg:flex-shrink-0">
                Category
              </h1>

              <div
                onClick={handleInputClick}
                className="flex items-center gap-3 bg-[#FBFDFF] flex-1 lg:max-w-md lg:mx-auto px-4 py-3 drop-shadow-xl rounded-[12px] text-black"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent cursor-text text-lg lg:text-2xl focus:outline-none"
                  placeholder="Search Category"
                />
              </div>

              <div className="hidden lg:flex">
                <TransactionButton />
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:max-w-[90%] w-full">
            {/* Expense Section*/}
            <div className="flex flex-col my-auto lg:my-6 bg-[#FBFDFF] w-full h-80 lg:h-[20rem] px-2 py-1 md:px-6 md:py-3 drop-shadow-xl rounded-[12px] text-black">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl lg:text-2xl font-bold m-2">Expense</h1>

                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="flex text-[#666666] px-2 lg:text-2xl cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex flex-row px-1 justify-end items-center">
                    <button
                      onClick={() => setShowAddModal({ type: "expense" })}
                      className="flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer"
                    >
                      <svg
                        className="w-full h-full text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setIsRemoveMode(true);
                      }}
                      className="flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer"
                    >
                      <svg
                        className="w-full h-full text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1">
                {userExpenseCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    removeMode={isRemoveMode}
                    onRemove={removeCategory}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Income section */}
          <div className="lg:max-w-[90%] w-full">
            <div className="flex flex-col my-auto lg:my-6 bg-[#FBFDFF] w-full h-80 lg:h-[20rem] px-2 py-1 md:px-6 md:py-3 drop-shadow-xl rounded-[12px] text-black">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl lg:text-2xl font-bold m-2">Income</h1>

                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="flex text-[#666666] px-2 lg:text-2xl cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex flex-row px-1 justify-end items-center">
                    <button
                      onClick={() => setShowAddModal({ type: "income" })}
                      className="flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer"
                    >
                      <svg
                        className="w-full h-full text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setIsRemoveMode(true);
                      }}
                      className="flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer"
                    >
                      <svg
                        className="w-full h-full text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 overflow-y-auto">
                {userIncomeCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    removeMode={isRemoveMode}
                    onRemove={removeCategory}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {showAddModal.type && (
          <AddCustomCategoryModal
            isOpen={showAddModal.type !== null}
            type={showAddModal.type}
            onAddCategory={addCategory}
            onClose={() => setShowAddModal({ type: null })}
            setErrorState={setErrorState}
          />
        )}
      </div>
      {errorState && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col bg-gray-100 rounded-lg p-4 sm:p-6 shadow-lg items-start">
            <p className="text-black text-2xl lg:text-3xl self-center p-2">
              Error!
            </p>
            <div className="flex flex-col text-xl lg:text-2xl p-2">
              <span className="text-red-600 mb-4">
                This category already exists.
              </span>
              <button
                className="px-4 py-2 bg-blue-600 shadow-md text-white rounded-md hover:bg-blue-700 transition self-end cursor-pointer"
                onClick={() => setErrorState(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
