import React, { useState, useEffect } from "react";
import { Plus, Edit, Eye, Calculator, MapPin, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const HarvestIncomeManagement = () => {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [existingHarvests, setExistingHarvests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    land_id: "",
    harvest_date: "",
    product_type: "",
    harvest_amount: "",
    income: "",
    expenses: "",
    land_rent: "",
    notes: ""
  });

  const rootUrl = import.meta.env.VITE_API_URL;

  // Load lands for dropdown
  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    try {
      const response = await axios.get(`${rootUrl}/api/harvest/lands-for-reports`, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setLands(response.data.data.lands);
      } else {
        setMessage("Failed to load lands");
      }
    } catch (error) {
      console.error("Error loading lands:", error);
      setMessage("Error loading lands: " + (error.response?.data?.message || error.message));
    }
  };

  const loadHarvestsForLand = async (landId) => {
    if (!landId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${rootUrl}/api/harvest?land_id=${landId}`, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setExistingHarvests(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading harvests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLandSelect = (landId) => {
    const land = lands.find(l => l.land_id === parseInt(landId));
    setSelectedLand(land);
    setFormData(prev => ({ ...prev, land_id: landId }));
    loadHarvestsForLand(landId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateFinancialBreakdown = () => {
    const income = parseFloat(formData.income) || 0;
    const expenses = parseFloat(formData.expenses) || 0;
    const landRent = parseFloat(formData.land_rent) || 0;
    
    const totalIncome = income + landRent; // Land rent is added to income
    const netProfit = totalIncome - expenses;
    const landownerShare = netProfit * 0.4; // 40%
    const farmmasterShare = netProfit * 0.6; // 60%
    
    return { netProfit, landownerShare, farmmasterShare, totalIncome };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate required fields
    if (!formData.land_id) {
      setMessage("Error: Please select a land first");
      setLoading(false);
      return;
    }

    if (!formData.harvest_date || !formData.product_type || !formData.harvest_amount || 
        !formData.income || !formData.expenses || !formData.land_rent) {
      setMessage("Error: Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const submitData = { ...formData };
      if (editingHarvest) {
        submitData.harvest_id = editingHarvest.harvest_id;
      }

      const response = await axios.post(`${rootUrl}/api/harvest/income-report`, submitData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setMessage(`Harvest income report ${editingHarvest ? 'updated' : 'created'} successfully!`);
        setShowForm(false);
        setEditingHarvest(null);
        resetForm();
        if (selectedLand) {
          loadHarvestsForLand(selectedLand.land_id);
        }
      } else {
        setMessage("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving harvest report:", error);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      land_id: selectedLand?.land_id || "",
      harvest_date: "",
      product_type: "",
      harvest_amount: "",
      income: "",
      expenses: "",
      land_rent: "",
      notes: ""
    });
  };

  const startEdit = (harvest) => {
    setEditingHarvest(harvest);
    setFormData({
      land_id: harvest.land_id,
      harvest_date: harvest.harvest_date,
      product_type: harvest.product_type,
      harvest_amount: harvest.harvest_amount,
      income: harvest.income,
      expenses: harvest.expenses,
      land_rent: harvest.land_rent,
      notes: harvest.notes || ""
    });
    setShowForm(true);
  };

  const { netProfit, landownerShare, farmmasterShare, totalIncome } = calculateFinancialBreakdown();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Harvest Income Management</h1>
        {selectedLand && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingHarvest(null);
              resetForm();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Income Report
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Land Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Land</h2>
        <select
          value={selectedLand?.land_id || ""}
          onChange={(e) => handleLandSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Choose a land...</option>
          {lands.map(land => (
            <option key={land.land_id} value={land.land_id}>
              {land.location} - {land.size} acres - Owner: {land.first_name} {land.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Land Info */}
      {selectedLand && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Selected Land Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <span><strong>Location:</strong> {selectedLand.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-blue-600" />
              <span><strong>Size:</strong> {selectedLand.size} acres</span>
            </div>
            <div>
              <strong>Owner:</strong> {selectedLand.first_name} {selectedLand.last_name}
            </div>
          </div>
        </div>
      )}

      {/* Existing Harvest Reports */}
      {selectedLand && existingHarvests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Existing Harvest Reports</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landowner Share</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {existingHarvests.map(harvest => (
                  <tr key={harvest.harvest_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(harvest.harvest_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{harvest.product_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{harvest.harvest_amount} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LKR {parseFloat(harvest.income).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      LKR {parseFloat(harvest.landowner_share).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => startEdit(harvest)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Income Report Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingHarvest ? 'Edit' : 'Create'} Harvest Income Report
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    name="harvest_date"
                    value={formData.harvest_date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <input
                    type="text"
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Tomato, Rice, Carrot"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Amount (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="harvest_amount"
                    value={formData.harvest_amount}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Income (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expenses (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Rent (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="land_rent"
                    value={formData.land_rent}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Financial Breakdown Preview */}
              {(formData.income || formData.expenses || formData.land_rent) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Financial Breakdown Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Harvest Income:</span>
                      <div className="font-medium">LKR {(parseFloat(formData.income) || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Land Rent:</span>
                      <div className="font-medium">+ LKR {(parseFloat(formData.land_rent) || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Income:</span>
                      <div className="font-semibold text-blue-600">LKR {totalIncome.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expenses:</span>
                      <div className="font-medium text-red-600">- LKR {(parseFloat(formData.expenses) || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Net Profit:</span>
                        <div className="font-semibold">LKR {netProfit.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Landowner Share (40%):</span>
                        <div className="font-semibold text-green-600">LKR {landownerShare.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">FarmMaster Share (60%):</span>
                        <div className="font-semibold text-blue-600">LKR {farmmasterShare.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Additional notes about the harvest..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingHarvest(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingHarvest ? 'Update Report' : 'Create Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestIncomeManagement;