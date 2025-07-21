import React, { useState, useEffect } from "react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;

const ProductForm = ({ product, onSave, onCancel }) => {
  // 🚫 Prevent rendering if product data is invalid
  if (!product || !product.product_id) {
    return <p className="text-red-600">Invalid product data. Cannot edit.</p>;
  }

  // Always in edit mode
  const isEditing = true;

  const [formData, setFormData] = useState({
    product_id: "",
    crop_name: "",
    price_per_unit: "",
    quantity: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_id: product.product_id,
        crop_name: product.crop_name || "",
        price_per_unit: product.price_per_unit || "",
        quantity: product.quantity || "",
        description: product.description || "",
        status: product.status
          ? product.status.charAt(0).toUpperCase() + product.status.slice(1)
          : "Available",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
    };

    console.log("Sending formData:", formattedData);

    const url = `${rootUrl}/update_product.php`;

    try {
      const res = await axios.post(url, formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Server response:", res.data);

      if (res.data.success) {
        onSave({ ...formData });
      } else {
        alert(`Error: ${res.data.message || "Failed to update product."}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <div className="mb-2">
        <label className="block font-semibold">Product ID (read-only)</label>
        <input
          name="product_id"
          value={formData.product_id}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Crop Name</label>
        <select
          name="crop_name"
          value={formData.crop_name}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white text-gray-700 appearance-none"
          required
        >
          <option value="" disabled>
            -- Select Crop --
          </option>
          <option value="Carrots">Carrots</option>
          <option value="Leeks">Leeks</option>
          <option value="Tomatoes">Tomatoes</option>
          <option value="Cabbage">Cabbage</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Price Per Unit (Rs.)</label>
        <input
          name="price_per_unit"
          value={formData.price_per_unit}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          type="number"
          step="0.01"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Quantity (Kg)</label>
        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          type="number"
          step="0.001"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white text-gray-700 appearance-none"
          required
        >
          <option value="" disabled>
            -- Select Status --
          </option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      <div className="space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Update Product
        </button>
        <button type="button" onClick={onCancel} className="text-gray-600 px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
