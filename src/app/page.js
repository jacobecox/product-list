'use client'
import React, { useEffect, useState } from "react";

const filters = ["None", "Price: Low to High", "Price: High to Low"];

export default function App() {
  // Holds the state of each item below
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(1)
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] =  useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { // Fetches all categories in database collection when component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/categories");
        const data = await response.json();
        setCategories(["All", ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => { // Fetches all products when called
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({ // URLSearchParams handles query strings in the url to be sent back to db
          page: currentPage,
          search,
          category: selectedCategory,
          sort: selectedFilter === "Price: Low to High" ? "asc" : selectedFilter === "Price: High to Low" ? "desc" : undefined ,
        })
        const response = await fetch(`http://localhost:8000/products?${params}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json(); // Sets the state to be what the data returned is
        setProducts(data.products)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)
        setTotalItems(data.totalItems)
      } catch (err) {
        setError(error.message)
      } finally {
        setLoading(false)
      };
    };
    fetchProducts()
  }, [currentPage, search, selectedCategory, selectedFilter]);  // Any time these dependencies change the useEffect will run again

  const handlePageChange = (page) => { // Sets the current page to change to whatever page was selected
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen" >
      <p className="text-xl font-bold">Loading products...</p>
    </div>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
    <h1 className='text-7xl font-bold text-center mb-4'>Ecommerce App</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products"
          className="w-full md:w-1/3 p-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Category Dropdown */}
        <select
          className="w-full md:w-1/3 p-2 border rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="" disabled hidden>
            Select a Category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select> 

        {/* Filter Dropdown */}
        <select
          className="w-full md:w-1/3 p-2 border rounded-lg"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="" disabled hidden>
            Select a Filter
          </option>
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>

      {/* Page Info */}
    <p className="text-sm text-gray-600 mb-4">
        Showing page {currentPage} of {totalPages} ({totalItems} items)
      </p>

      {/* Products */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products?.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center">
          <p className="text-gray-400">Category: {product.category}</p>
          <p className="text-lg font-semibold text-right">${product.price.toFixed(2)}</p>
          </div>
          <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover mb-2"
            />
          <h2 className="text-2xl font-semibold text-center">{product.name}</h2> 
        </div>
      ))}
    </div>

    {/* Page Toggle Buttons */}
    <p className="font-bold text-center py-1 mt-6">Page</p>
    <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
    </div>
  </div>
  );
};