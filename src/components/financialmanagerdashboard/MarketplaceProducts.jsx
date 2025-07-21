import React, { useState } from "react";
import { useProducts } from "./ProductContext";
import ProductForm from "./ProductForm";

const MarketplaceProducts = () => {
  const { products, updateProduct, fetchProducts } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);

  const saveProduct = async (updatedProduct) => {
    updateProduct(updatedProduct.product_id || updatedProduct.id, updatedProduct);
    await fetchProducts();
    setEditingProduct(null);
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Marketplace Products
      </h1>
      <p className="text-green-700 text-sm mb-6">
        You can only update existing product details in the online marketplace.
      </p>

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
                    p.status === "unavailable" ? "bg-red-50" : ""
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
                        p.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-red-600"
                      }`}
                    >
                      {p.status}
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
    </div>
  );
};

export default MarketplaceProducts;
