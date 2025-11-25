"use client";
import { useState } from "react";
import Image from "next/image";
import { Category } from "@/app/model";
import { X } from "lucide-react";
import Topbar from "@/app/components/Topbar";
import { AddCustomCategoryModal } from "../../category/page";
import { useCategories } from "@/app/context/CategoryContext";
interface CategoryItemProps {
  category: Category;
  removeMode: boolean;
  onRemove: (
    categoryId: string,
    type: "expense" | "income",
    isDefault: boolean
  ) => void;
}

function CategoryItem({ category, removeMode, onRemove }: CategoryItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 select-none relative">
      <div className="w-8 h-8 flex items-center relative">
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
          className={`w-6 h-6 rounded-[6px] border-2 absolute transition-opacity duration-1000 ${
            removeMode ? "opacity-100 z-50 shadow-md" : "opacity-0"
          } bg-red-500 border-2 border-red-700 cursor-pointer text-white`}
          onClick={() =>
            onRemove(category.id, category.type, category.isDefault)
          }
        >
          <X size={16} className="m-auto" />
        </button>
      </div>
      <span className="text-lg lg:text-2xl font-medium cursor-pointer">
        {category.name}
      </span>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const {
    userExpenseCategories,
    userIncomeCategories,
    addCategory,
    removeCategory,
  } = useCategories();

  const [isRemoveExpenseMode, setIsRemoveExpenseMode] = useState(false);
  const [isRemoveIncomeMode, setIsRemoveIncomeMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState<{
    type: "expense" | "income" | null;
  }>({ type: null });

  const [errorState, setErrorState] = useState(false);

  const handleRemove = (
    categoryId: string,
    type: "expense" | "income",
    isDefault: boolean
  ) => {
    try {
      removeCategory(categoryId, type, isDefault);
    } catch (error) {
      console.error("Error removing category:", error);
      setErrorState(true);
    }

    const handleAdd = async (category: Category): Promise<boolean> => {
      try {
        category.isDefault = true;
        return await addCategory(category);
      } catch (error) {
        console.error("Error adding category:", error);
        setErrorState(true);
        return false;
      }
    };

    const defaultExpenses = userExpenseCategories.filter(
      (cat) => cat.isDefault
    );
    const defaultIncomes = userIncomeCategories.filter((cat) => cat.isDefault);

    return (
      <>
        <div className="flex">
          <div className="p-5 lg:p-0 flex flex-col items-center min-h-screen gap-8 w-full">
            <Topbar />
            {/* Expense Section */}
            <div className="lg:max-w-[90%] w-full">
              <div className="flex flex-col my-auto lg:my-6 bg-[#FBFDFF] w-full h-80 lg:h-[20rem] px-2 py-1 md:px-6 md:py-3 drop-shadow-xl rounded-[12px] text-black">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl lg:text-2xl font-bold m-2">
                    Default Expense Categories
                  </h1>
                  <div className="flex flex-row gap-x-3">
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
                      onClick={() =>
                        setIsRemoveExpenseMode(!isRemoveExpenseMode)
                      }
                      className={`flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer`}
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
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto flex-1">
                  {defaultExpenses.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      removeMode={isRemoveExpenseMode}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Income Section */}
            <div className="lg:max-w-[90%] w-full">
              <div className="flex flex-col my-auto lg:my-6 bg-[#FBFDFF] w-full h-80 lg:h-[20rem] px-2 py-1 md:px-6 md:py-3 drop-shadow-xl rounded-[12px] text-black">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl lg:text-2xl font-bold m-2">
                    Default Income Categories
                  </h1>
                  <div className="flex flex-row gap-x-3">
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
                      onClick={() => setIsRemoveIncomeMode(!isRemoveIncomeMode)}
                      className={`flex w-8 h-8 bg-transparent rounded-[12px] cursor-pointer`}
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
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto flex-1">
                  {defaultIncomes.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      removeMode={isRemoveIncomeMode}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Modals */}
          <AddCustomCategoryModal
            isOpen={!!showAddModal.type}
            type={showAddModal.type || "expense"}
            onClose={() => setShowAddModal({ type: null })}
            onAddCategory={handleAdd}
            setErrorState={setErrorState}
          />
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
  };
}
