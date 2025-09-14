import React, { useState, useEffect } from "react";
import { useProducts } from "./ProductContext";
import ProductForm from "./ProductForm";

const MarketplaceProducts = () => {
  const { products, updateProduct, fetchProducts, newCrops, fetchNewCrops } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewCrops();
    }, 10000); // poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchNewCrops]);

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail || "");
    window.addEventListener("marketplace-search", handler);
    return () => window.removeEventListener("marketplace-search", handler);
  }, []);

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.crop_name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      String(p.price).includes(term)
    );
  });

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

  const handleAddProduct = () => {
    setAddingProduct(true);
  };

  const saveNewProduct = async (newProduct) => {
    if (newProduct.error) {
      setPopup({
        show: true,
        type: "error",
        message: newProduct.error,
      });
      setAddingProduct(false);
      return;
    }
    try {
      await fetchProducts();
      setAddingProduct(false);
      setPopup({
        show: true,
        type: "success",
        message: "Product added successfully!",
      });
    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        message: "Failed to add product.",
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

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Marketplace Products
      </h1>
      <p className="text-green-700 text-sm mb-6">
        You can only update existing product details in the online marketplace.
      </p>
      <button
        onClick={handleAddProduct}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
      >
        Add Product
      </button>
      {addingProduct && (
        <ProductForm
          product={null}
          onSave={saveNewProduct}
          onCancel={() => setAddingProduct(false)}
          mode="add"
        />
      )}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {filteredProducts.length === 0 ? (
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
              {filteredProducts.map((p, index) => (
                <tr
                  key={p.product_id || p.id || index}
                  className={`border-t hover:bg-green-50 ${
                    (p.quantity === 0) ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{p.crop_name}</td>
                  <td className="px-6 py-4">Rs. {p.price}</td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4">{p.description}</td>
                  <td className="px-6 py-4 w-28">
                    <span
                      className={`font-semibold px-3 py-1 rounded-full block text-center capitalize ${
                        Number(p.quantity) === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {Number(p.quantity) === 0 ? "Sold" : "Available"}
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

      {/* Add space between table and notification */}
      <div className="mt-4" />

      {newCrops.length > 0 && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <strong>New crop(s) detected!</strong> Please add the following crop(s) to the marketplace:
          <ul className="list-disc ml-6 mt-2">
            {newCrops.map(crop => (
              <li key={crop.crop_id}>{crop.crop_name} (Available: {crop.quantity}kg)</li>
            ))}
          </ul>
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
    </div>
  );
};

export default MarketplaceProducts;
