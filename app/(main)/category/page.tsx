"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Category } from "@/app/model";
import { Plus, X } from "lucide-react";
import { useCategories } from "@/app/context/CategoryContext";
import { useCategoryStore } from "@/app/store/useCategoryStore";
import Content from "@/app/components/Content";

interface CategoryItemProps {
  category: Category;
  isEditMode: boolean;
  onRemove: (
    categoryId: string,
    type: "expense" | "income",
    isDefault: boolean
  ) => void;
}

function CategoryItem({ category, isEditMode, onRemove }: CategoryItemProps) {
  const isDefault = category.isDefault;

  return (
    <div className="flex flex-col items-center gap-y-3">
      <div
        className={`w-full h-[97px] flex items-center justify-center ${
          isEditMode && !isDefault
            ? "bg-red-400 hover:bg-red-500 cursor-pointer"
            : category.type === "income"
            ? "bg-[#6DB6FE]"
            : "bg-[#3299FF]"
        } rounded-[20px]`}
        onClick={() => {
          if (isEditMode) {
            if (category.isDefault) {
              return;
            } else {
              onRemove(category.id, category.type, category.isDefault);
            }
          }
        }}
      >
        {isEditMode && !isDefault ? (
          <X className="size-7 text-white" />
        ) : (
          <Image
            src={category.icon}
            alt={category.name}
            width={24}
            height={24}
          />
        )}
      </div>
      <div className="font-medium text-[15px] text-[#093030]">
        {category.name}
      </div>
    </div>
  );
}

interface AddCustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Category) => Promise<boolean>;
  type: "expense" | "income";
  setErrorState: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddCustomCategoryModal({
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

  const handleSubmit = async () => {
    if (categoryName.trim()) {
      const newCategory: Category = {
        id: "",
        type: type,
        name: categoryName.trim(),
        icon: selectedIcon,
        isDefault: false,
      };

      const success = await onAddCategory(newCategory);
      if (!success) {
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

        <div className="flex items-start gap-4 mb-6 p-4 border border-gray-300 rounded-[12px]">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 mb-2">Icon</span>
            <div className="w-12 h-12 bg-[#00D09E] rounded-full flex items-center justify-center">
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
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-2 focus:outline-none focus:border-green-500"
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
                className={`w-12 h-12 rounded-2 flex items-center justify-center border-2 transition-colors cursor-pointer ${
                  selectedIcon === icon
                    ? "border-[#00D09E] bg-green-50"
                    : "border-gray-300 hover:border-[#00D09E]"
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

export default function CategoriesPage() {
  const [isEditExpenseMode, setIsEditExpenseMode] = useState(false);
  const [isEditIncomeMode, setIsEditIncomeMode] = useState(false);
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [showAddModal, setShowAddModal] = useState<{
    type: "expense" | "income" | null;
  }>({ type: null });
  const {
    addCategory,
    removeCategory,
    userExpenseCategories,
    userIncomeCategories,
  } = useCategories();

  const [errorState, setErrorState] = useState(false);

  return (
    <div className="flex flex-col gap-y-10 flex-1 items-center">
      {/* Header */}
      <div className="flex items-center h-[85px]">
        <div className="font-semibold text-xl mt-8 px-5 text-[#052224]">
          Categories
        </div>
      </div>

      <Content>
        <div className="flex flex-col items-center w-[358px] gap-y-10 max-h-[625px] overflow-y-auto">
          {/* Expense Categories */}
          <div className="w-full flex flex-col gap-y-5">
            <div className="flex items-center justify-center relative">
              <h2 className="font-bold text-[15px] text-[#093030]">Expense</h2>
              <button
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditExpenseMode(!isEditExpenseMode)}
              >
                {isEditExpenseMode ? "Done" : "Edit"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {userExpenseCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isEditMode={isEditExpenseMode}
                  onRemove={removeCategory}
                />
              ))}
              <div className="flex flex-col items-center gap-y-3">
                <div
                  className={`w-full h-[97px] flex items-center justify-center ${"bg-[#3299FF]"} rounded-[20px]`}
                  onClick={() => setShowAddModal({ type: "expense" })}
                >
                  <Plus className="size-10" />
                </div>
                <div className="font-medium text-[15px] text-[#093030]">
                  More
                </div>
              </div>
            </div>
          </div>

          {/* Income Categories */}
          <div className="w-full flex flex-col gap-y-5">
            <div className="flex items-center justify-center relative">
              <h2 className="font-bold text-[15px] text-[#093030]">Income</h2>
              <button
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditIncomeMode(!isEditIncomeMode)}
              >
                {isEditIncomeMode ? "Done" : "Edit"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {userIncomeCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isEditMode={isEditIncomeMode}
                  onRemove={removeCategory}
                />
              ))}
              <div className="flex flex-col items-center gap-y-3">
                <div
                  className={`w-full h-[97px] flex items-center justify-center ${"bg-[#3299FF]"} rounded-[20px]`}
                  onClick={() => setShowAddModal({ type: "income" })}
                >
                  <Plus className="size-10" />
                </div>
                <div className="font-medium text-[15px] text-[#093030]">
                  More
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>

      {showAddModal.type && (
        <AddCustomCategoryModal
          isOpen={showAddModal.type !== null}
          type={showAddModal.type}
          onAddCategory={addCategory}
          onClose={() => setShowAddModal({ type: null })}
          setErrorState={setErrorState}
        />
      )}

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
    </div>
  );
}
