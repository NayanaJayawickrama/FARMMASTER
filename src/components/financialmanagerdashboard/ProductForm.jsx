import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProducts } from "./ProductContext";

const rootUrl = import.meta.env.VITE_API_URL;

const ProductForm = ({ product, onSave, onCancel, mode }) => {
  const { products, newCrops } = useProducts();
  const isAddMode = mode === "add";

  // Use newCrops for add mode, products for update mode
  const cropOptions = isAddMode
    ? newCrops.map(c => ({
        crop_name: c.crop_name,
        crop_id: c.crop_id,
        quantity: c.quantity
      }))
    : products.map(p => ({
        crop_name: p.crop_name,
        crop_id: p.crop_id,
        quantity: p.quantity
      }));

  const [formData, setFormData] = useState({
    product_id: "",
    crop_name: "",
    crop_id: "",
    price_per_unit: "",
    quantity: "",
    description: "",
    image_url: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Add loading state for newCrops
  const [loading, setLoading] = useState(isAddMode);

  useEffect(() => {
    if (isAddMode) {
      setLoading(newCrops.length === 0);
    }
  }, [newCrops, isAddMode]);

  useEffect(() => {
    if (product && !isAddMode) {
      setFormData({
        product_id: product.product_id,
        crop_name: product.crop_name || "",
        crop_id: product.crop_id || "",
        price_per_unit: product.price_per_unit || "",
        quantity: product.quantity || "",
        description: product.description || "",
        image_url: product.image_url || ""
      });
      setImagePreview(product.image_url || "");
      setImageFile(null);
    } else if (isAddMode) {
      setFormData({
        product_id: "",
        crop_name: "",
        crop_id: "",
        price_per_unit: "",
        quantity: "",
        description: "",
        image_url: ""
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [product, isAddMode, newCrops]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isAddMode && name === "crop_name") {
      const selected = cropOptions.find((c) => c.crop_name === value);
      setFormData((prev) => ({
        ...prev,
        crop_name: value,
        crop_id: selected ? selected.crop_id : "",
        quantity: selected ? selected.quantity : ""
      }));
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
    setImagePreview(product && product.image_url ? product.image_url : "");
    setImageFile(null);
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isAddMode
      ? `${rootUrl}/ProductRoute.php?action=addProduct`
      : `${rootUrl}/ProductRoute.php?action=updateProduct`;
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    if (imageFile) {
      form.append("image", imageFile);
    }
    try {
      const res = await axios.post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        const newImageUrl = res.data.image_url || formData.image_url;
        onSave({ ...formData, image_url: newImageUrl });
      } else {
        onSave({ ...formData, error: res.data.message || "Failed to save product." });
      }
    } catch (error) {
      onSave({ ...formData, error: "Failed to connect to the server." });
    }
  };

  // Show loading or "No new crops" message in add mode
  if (isAddMode && loading) {
    return (
      <div className="bg-white p-4 shadow rounded mb-4 text-center text-gray-600">
        Loading available crops...
      </div>
    );
  }
  if (isAddMode && cropOptions.length === 0) {
    return (
      <div className="bg-white p-4 shadow rounded mb-4 text-center text-gray-600">
        No new crops available to add.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      {!isAddMode && (
        <div className="mb-2">
          <label className="block font-semibold">Product ID (Can't Change)</label>
          <input
            name="product_id"
            value={formData.product_id}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
      )}
      <div className="mb-2">
        <label className="block font-semibold">Crop Name{isAddMode ? "" : " (Can't Change)"}</label>
        {isAddMode ? (
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
            {cropOptions.map((c) => (
              <option key={c.crop_id} value={c.crop_name}>
                {c.crop_name}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="crop_name"
            value={formData.crop_name}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        )}
      </div>
      <input type="hidden" name="crop_id" value={formData.crop_id} />
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
      {!isAddMode && (
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
      )}
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
      <div className="space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
          {isAddMode ? "Add Product" : "Update Product"}
        </button>
        <button type="button" onClick={handleCancel} className="text-gray-600 px-4 py-2 cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;