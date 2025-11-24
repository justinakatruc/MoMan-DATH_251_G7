import React from "react";

export default function CategoriesPage() {
  return (
    <div className="lg:px-6 mt-14">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <p className="text-gray-600">
          Manage your expense and income categories here.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-y-6">
        {/* Categories management content goes here */}
        <div className="p-6 bg-white rounded-lg shadow flex flex-col gap-y-6">
          <h2 className="text-2xl font-semibold mb-4">Expense List</h2>
          <div className="flex items-center gap-x-3"></div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow flex flex-col gap-y-6">
          <h2 className="text-2xl font-semibold mb-4">Income List</h2>
          <div className="flex items-center gap-x-3"></div>
        </div>
      </div>
    </div>
  );
}
