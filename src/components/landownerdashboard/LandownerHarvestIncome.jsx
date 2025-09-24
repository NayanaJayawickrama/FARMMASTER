import React, { useState, useEffect } from "react";
import { Eye, Calendar, MapPin, TrendingUp, DollarSign, Package, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const LandownerHarvestIncome = () => {
  const { user } = useAuth();
  const [harvestReports, setHarvestReports] = useState([]);
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalLandownerShare: 0,
    totalReports: 0,
    avgIncome: 0
  });

  const rootUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadHarvestReports();
  }, []);

  useEffect(() => {
    if (harvestReports.length > 0) {
      calculateStats();
    }
  }, [harvestReports, selectedLand]);

  const loadHarvestReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${rootUrl}/api/harvest/income-reports`, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setHarvestReports(response.data.data.harvest_reports || []);
        setLands(response.data.data.lands || []);
      } else {
        console.error("Failed to load harvest reports:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading harvest reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let filteredReports = harvestReports;
    
    if (selectedLand) {
      filteredReports = harvestReports.filter(report => report.land_id == selectedLand);
    }

    const totalIncome = filteredReports.reduce((sum, report) => sum + parseFloat(report.income || 0), 0);
    const totalLandownerShare = filteredReports.reduce((sum, report) => sum + parseFloat(report.landowner_share || 0), 0);
    const totalReports = filteredReports.length;
    const avgIncome = totalReports > 0 ? totalIncome / totalReports : 0;

    setStats({
      totalIncome,
      totalLandownerShare,
      totalReports,
      avgIncome
    });
  };

  const filteredReports = selectedLand 
    ? harvestReports.filter(report => report.land_id == selectedLand)
    : harvestReports;

  const viewDetails = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const formatCurrency = (amount) => {
    return `LKR ${parseFloat(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Harvest Income Reports</h1>
        <p className="text-gray-600">View income reports and financial details for your lands</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalIncome)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Share</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalLandownerShare)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgIncome)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter by Land</h2>
        <div className="flex gap-4 items-center">
          <select
            value={selectedLand}
            onChange={(e) => setSelectedLand(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Lands</option>
            {lands.map(land => (
              <option key={land.land_id} value={land.land_id}>
                {land.location} - {land.size} acres
              </option>
            ))}
          </select>
          {selectedLand && (
            <button
              onClick={() => setSelectedLand('')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Harvest Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Harvest Income Reports</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading harvest reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No harvest income reports found for your lands.</p>
            <p className="text-sm mt-2">Financial Manager will create reports after harvest completion.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.harvest_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(report.harvest_date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.land_location}</div>
                          <div className="text-sm text-gray-500">{report.land_size} acres</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {report.product_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(report.harvest_amount).toLocaleString()} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(report.income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(report.landowner_share)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => viewDetails(report)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Harvest Income Report Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Harvest Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harvest Date:</span>
                      <span className="font-medium">{formatDate(selectedReport.harvest_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Type:</span>
                      <span className="font-medium">{selectedReport.product_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harvest Amount:</span>
                      <span className="font-medium">{parseFloat(selectedReport.harvest_amount).toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Location:</span>
                      <span className="font-medium">{selectedReport.land_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Size:</span>
                      <span className="font-medium">{selectedReport.land_size} acres</span>
                    </div>
                  </div>
                </div>

                {selectedReport.notes && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                    <p className="text-sm text-gray-700">{selectedReport.notes}</p>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Financial Breakdown</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Income:</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedReport.income)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expenses:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedReport.expenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Rent:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedReport.land_rent)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-800">Net Profit:</span>
                      <span className="text-blue-600">{formatCurrency(selectedReport.net_profit)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Profit Distribution</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Share (40%):</span>
                      <span className="font-bold text-green-600">{formatCurrency(selectedReport.landowner_share)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FarmMaster Share (60%):</span>
                      <span className="font-medium text-blue-600">{formatCurrency(selectedReport.farmmaster_share)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Note:</strong> Profit sharing is calculated as 40% to landowner and 60% to FarmMaster after deducting all expenses and land rent from the total income.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandownerHarvestIncome;