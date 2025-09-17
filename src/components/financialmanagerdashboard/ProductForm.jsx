import React, { useState, useEffect } from "react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;

const ProductForm = ({ product, onSave, onCancel }) => {
  if (!product || !product.product_id) {
    return <p className="text-red-600">Invalid product data. Cannot edit.</p>;
  }

  const [formData, setFormData] = useState({
    product_id: "",
    crop_name: "",
    price_per_unit: "",
    quantity: "",
    description: "",
    image_url: product.image_url || "",
    is_featured: product.is_featured ? true : false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product.image_url || "");

  useEffect(() => {
    if (product) {
      setFormData({
        product_id: product.product_id,
        crop_name: product.crop_name || "",
        price_per_unit: product.price_per_unit || "",
        quantity: product.quantity || "",
        description: product.description || "",
        image_url: product.image_url || "",
        is_featured: product.is_featured ? true : false
      });
      setImagePreview(product.image_url || "");
      setImageFile(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(formData.image_url || "");
    }
  };

  const handleCancel = () => {
    setImagePreview(product.image_url || "");
    setImageFile(null);
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      price_per_unit: formData.price_per_unit,
      description: formData.description,
      is_featured: formData.is_featured ? 1 : 0
    };
    const url = `${rootUrl}/api/products/${formData.product_id}`;
    const form = new FormData();
    Object.entries(formattedData).forEach(([key, value]) => {
      form.append(key, value);
    });
    form.append('_method', 'PUT');
    if (imageFile) {
      form.append("image", imageFile);
    }
    try {
      // Do NOT set Content-Type header manually for FormData
      const res = await axios.post(url, form, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        const newImageUrl = res.data.data?.image_url || formData.image_url;
        onSave({ ...formData, image_url: newImageUrl });
      } else if (res.data.status === 'info') {
        onSave({ ...formData, error: res.data.message });
      } else {
        onSave({ ...formData, error: res.data.message || "Failed to update product." });
      }
    } catch (error) {
      // If error.response exists, show backend error message
      if (error.response && error.response.data && error.response.data.message) {
        onSave({ ...formData, error: error.response.data.message });
      } else {
        onSave({ ...formData, error: "Failed to connect to the server." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <div className="mb-2">
        <label className="block font-semibold">Product ID (Can't Change)</label>
        <input
          name="product_id"
          value={formData.product_id}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Crop Name</label>
        <input
          name="crop_name"
          value={formData.crop_name}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Price Per Unit (Rs.)</label>
        <input
          name="price_per_unit"
          value={formData.price_per_unit}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          type="text"
          pattern="^\d+(\.\d{0,2})?$"
          required
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Quantity (Kg) (Can't Change)</label>
        <input
          name="quantity"
          value={Number(formData.quantity) === 0 ? "No inventory (Sold out)" : formData.quantity}
          readOnly
          className={`w-full border p-2 rounded bg-gray-100 ${Number(formData.quantity) === 0 ? 'text-red-700 font-bold' : ''}`}
          type="text"
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
      <div className="mb-2">
        <label className="block font-semibold">Status (auto-set)</label>
        <input
          name="status"
          value={Number(formData.quantity) === 0 ? "Sold" : "Available"}
          readOnly
          className={`w-full border p-2 rounded ${Number(formData.quantity) === 0 ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100'}`}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Product Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Product Preview" className="mt-2 w-24 h-24 object-contain" />
        )}
      </div>
      <div className="mb-2">
        <label className="inline-flex items-center">
          <span className="font-semibold mr-3">Set as Featured Product</span>
          <button
            type="button"
            className={`w-12 h-6 flex items-center rounded-full px-1 transition-colors duration-200 ${
              formData.is_featured ? "bg-green-500" : "bg-gray-300"
            }`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                is_featured: !prev.is_featured,
              }))
            }
            aria-pressed={formData.is_featured}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                formData.is_featured ? "translate-x-6" : ""
              }`}
            />
          </button>
        </label>
      </div>
      <div className="space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
          Update Product
        </button>
        <button type="button" onClick={handleCancel} className="text-gray-600 px-4 py-2 cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;