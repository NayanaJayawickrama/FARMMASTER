import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    crop_name: "",
    price_per_unit: "",
    quantity: "",
    product_description: "",
    status: "",
  });

  const isEditing = !!product?.product_id;

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        product_id: product.product_id?.replace(/^P/, "") || "",
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
      product_id: `P${formData.product_id.replace(/^P/, "")}`,
    };

    const url = isEditing
      ? "http://localhost/backend/api/update_product.php"
      : "http://localhost/backend/api/create_product.php";

    try {
      const res = await axios.post(url, formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        onSave(formattedData);
      } else {
        alert(res.data.message || "Failed to save product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <div className="mb-2">
        <label className="block font-semibold">Product ID</label>
        <div className="flex">
          <span className="bg-gray-200 px-3 py-2 rounded-l text-gray-600 font-bold">
            P
          </span>
          <input
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full border p-2 rounded-r"
            pattern="\d+"
            title="Only numbers are allowed"
            required
            disabled={isEditing}
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Product Name</label>
        <input
          name="crop_name"
          value={formData.crop_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-semibold">Price Per Unit</label>
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
        <label className="block font-semibold">Quantity</label>
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
          name="product_description"
          value={formData.product_description}
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
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <div className="space-x-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Update Product" : "Save Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
