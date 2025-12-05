import React, { useEffect, useState } from "react";
import { useProducts } from "./ProductContext";
import { useNavigate } from "react-router-dom"; // Add this import
import ProductForm from "./ProductForm";
import AddProductForm from "./AddProductForm"; // <-- import the new form

const MarketplaceProducts = () => {
  const { products, updateProduct, fetchProducts } = useProducts();
  const navigate = useNavigate(); // Add this hook
  const [editingProduct, setEditingProduct] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrops, setNewCrops] = useState([]);
  const [loadingNewCrops, setLoadingNewCrops] = useState(true);
  const [addProductPopup, setAddProductPopup] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    const fetchNewCrops = async () => {
      setLoadingNewCrops(true);
      try {
        const rootUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${rootUrl}/api/products/new-crops`,
          { credentials: "include" }
        );
        const data = await res.json();
        setNewCrops(data.data || []);
      } catch (err) {
        setNewCrops([]);
      }
      setLoadingNewCrops(false);
    };
    fetchNewCrops();
  }, []);

  const saveProduct = async (updatedProduct) => {
    if (updatedProduct.error) {
      setPopup({
        show: true,
        type: "error",
        message:
          updatedProduct.error === "No changes made or product not found."
            ? "No changes made."
            : updatedProduct.error,
      });
      setEditingProduct(null);
      return;
    }
    try {
      updateProduct(updatedProduct.product_id || updatedProduct.id, updatedProduct);
      await fetchProducts();
      setEditingProduct(null);
      setPopup({
        show: true,
        type: "success",
        message: "Product updated successfully!",
      });
    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        message: "Failed to update product.",
      });
    }
  };

  const handleClosePopup = () => {
    setPopup({ show: false, type: "success", message: "" });
  };

  const handleSeeUpdates = () => {
    setPopup({ show: false, type: "success", message: "" });
    window.location.href = "/marketplace";
  };

  const handleAddProductSuccess = () => {
    setShowAddForm(false);
    fetchProducts();
    setAddProductPopup({
      show: true,
      message: "Product added successfully! See it in the marketplace.",
    });
  };

  const handleAddProductCancel = () => {
    setShowAddForm(false);
  };

  const handleCloseAddProductPopup = () => {
    setAddProductPopup({ show: false, message: "" });
    window.location.href = "/marketplace";
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Header Section with Title and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
            Marketplace Products
          </h1>
          
        </div>
        
        {/* Quick Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            title="Go to marketplace"
          >
            
            Go to Marketplace
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Notification for new crops */}
      {!loadingNewCrops && newCrops.length > 0 && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                <strong>New crops added to inventory:</strong>
              </p>
              <div className="mt-2">
                <ul className="list-disc ml-4 text-sm">
                  {newCrops.map((crop) => (
                    <li key={crop.crop_id}>{crop.crop_name}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  Please add these crops to the marketplace to make them available for buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddProductForm
          onProductAdded={handleAddProductSuccess}
          onCancel={handleAddProductCancel}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Crop Name</th>
                <th className="px-6 py-4">Price/Unit</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.product_id || p.id || index}
                  className={`border-t hover:bg-green-50 ${
                    (p.status !== "available" || p.quantity === 0)
                      ? "bg-red-50"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{p.crop_name}</td>
                  <td className="px-6 py-4">
                    Rs. {parseFloat(p.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4">{p.description}</td>
                  <td className="px-6 py-4 w-28">
                    <span
                      className={`font-semibold px-3 py-1 rounded-full block text-center capitalize ${
                        Number(p.quantity) === 0
                          ? "bg-red-100 text-red-700"
                          : p.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-red-600"
                      }`}
                    >
                      {Number(p.quantity) === 0
                        ? "Sold"
                        : p.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-black font-semibold text-sm whitespace-nowrap">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="hover:underline hover:text-green-600 cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className={`bg-white border p-6 rounded-lg shadow-xl text-center ${
              popup.type === "success" ? "border-green-600" : "border-red-600"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-2 ${
                popup.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {popup.message}
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              {popup.type === "success" && (
                <button
                  onClick={handleSeeUpdates}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  See Updates
                </button>
              )}
              <button
                onClick={handleClosePopup}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {addProductPopup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-green-600 p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-lg font-bold mb-2 text-green-700">
              {addProductPopup.message}
            </h2>
            <button
              onClick={handleCloseAddProductPopup}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
            >
              Go to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceProducts;
