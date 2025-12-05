import React, { useEffect, useState } from "react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;

const AddProductForm = ({ onProductAdded, onCancel }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    crop_id: "",
    price_per_unit: "",
    description: "",
    image: null,
    is_featured: false
  });
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  // Fetch crops not yet in product table
  useEffect(() => {
    const fetchNewCrops = async () => {
      setLoading(true);
      try {
        const cropsRes = await axios.get(`${rootUrl}/api/products/new-crops`, { withCredentials: true });
        const newCrops = cropsRes.data.data || [];
        setCrops(newCrops);
        setLoading(false);
      } catch (err) {
        setMessage("Failed to fetch crop data.");
        setLoading(false);
      }
    };
    fetchNewCrops();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview("");
      }
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crop_id) {
      setMessage("Please select a crop.");
      return;
    }
    if (!formData.price_per_unit || !formData.description) {
      setMessage("Please enter price and description.");
      return;
    }
    const data = new FormData();
    data.append("crop_id", formData.crop_id);
    data.append("price_per_unit", formData.price_per_unit);
    data.append("description", formData.description);
    data.append("is_featured", formData.is_featured ? 1 : 0);
    if (formData.image) {
      data.append("image", formData.image);
    }
    try {
      const res = await axios.post(`${rootUrl}/api/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      if (res.data.status === "success") {
        setMessage("Product added successfully!");
        setFormData({
          crop_id: "",
          price_per_unit: "",
          description: "",
          image: null,
          is_featured: false
        });
        setImagePreview("");
        if (onProductAdded) onProductAdded();
      } else {
        setMessage(res.data.message || "Failed to add product.");
      }
    } catch (err) {
      setMessage("Failed to connect to server.");
    }
  };

  const handleCancel = () => {
    setFormData({
      crop_id: "",
      price_per_unit: "",
      description: "",
      image: null,
      is_featured: false
    });
    setImagePreview("");
    setMessage("");
    if (onCancel) onCancel();
  };

  if (loading) return <p>Loading...</p>;

  if (crops.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-red-600 font-semibold mb-2">
          No new crops available to add as products.
        </p>
        <p className="text-gray-600">
          All crops in inventory are already listed in the marketplace.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <div className="mb-2">
        <label className="block font-semibold">Crop Name</label>
        <select
          name="crop_id"
          value={formData.crop_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select crop</option>
          {crops.map(crop => (
            <option key={crop.crop_id} value={crop.crop_id}>
              {crop.crop_name}
            </option>
          ))}
        </select>
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
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
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
          Add Product
        </button>
        <button
          type="button"
          className="text-gray-600 px-4 py-2 cursor-pointer"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
      {message && (
        <div className="mt-3 text-center text-red-600 font-semibold">{message}</div>
      )}
    </form>
  );
};

export default AddProductForm;
