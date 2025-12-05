import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TrendingUp, DollarSign, Users, FileText, Activity, ShoppingCart, MapPin, Calculator, CreditCard, BarChart3, Package, AlertCircle, Bell, Eye } from "lucide-react";

export default function FinancialDashboardContent() {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalPaymentsReceived: 0,
    currentHarvestIncome: 0,
    marketplaceRevenue: 0,
    landReportPayments: 0,
    recentTransactions: [],
    monthlyTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [newCrops, setNewCrops] = useState([]);
  const [loadingNewCrops, setLoadingNewCrops] = useState(true);
  const [showNewCropsNotification, setShowNewCropsNotification] = useState(true);
  
  // New proposal requests state
  const [newProposals, setNewProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [showProposalNotification, setShowProposalNotification] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  // Fetch new crops notification
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
        console.error("Error fetching new crops:", err);
        setNewCrops([]);
      }
      setLoadingNewCrops(false);
    };
    
    fetchNewCrops();
  }, []);

  // Fetch new proposal requests
  useEffect(() => {
    const fetchNewProposals = async () => {
      setLoadingProposals(true);
      try {
        const rootUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${rootUrl}/api/proposals/pending-financial-review`,
          { credentials: "include" }
        );
        const data = await res.json();
        
        if (data.status === 'success') {
          setNewProposals(data.data || []);
        } else {
          console.error("Error fetching proposals:", data.message);
          setNewProposals([]);
        }
      } catch (err) {
        console.error("Error fetching new proposals:", err);
        setNewProposals([]);
      }
      setLoadingProposals(false);
    };
    
    fetchNewProposals();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const rootUrl = import.meta.env.VITE_API_URL;
        
        // Fetch land report data
        const landReportRes = await fetch(`${rootUrl}/api.php/financial-analytics/land-reports`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        // Fetch marketplace transaction data (this will be our source of truth)
        const marketplaceTransactionRes = await fetch(`${rootUrl}/api.php/financial-analytics/transactions`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        const landReportData = await landReportRes.json();
        const marketplaceTransactionData = await marketplaceTransactionRes.json();

        let totalPayments = 0;
        let marketplaceRevenue = 0;
        let landReportPayments = 0;
        let recentTransactions = [];

        // Calculate marketplace revenue from transactions (same as PaymentManagement)
        if (marketplaceTransactionData.status === 'success' && marketplaceTransactionData.data.transactions) {
          marketplaceRevenue = marketplaceTransactionData.data.transactions.reduce((sum, txn) => {
            return sum + parseFloat(txn.amount || 0);
          }, 0);
          totalPayments += marketplaceRevenue;
        }

        if (landReportData.status === 'success' && landReportData.data.payments) {
          landReportPayments = landReportData.data.payments.reduce((sum, payment) => sum + payment.amount, 0);
          totalPayments += landReportPayments;
        }

        // Combine transactions from both sources
        const allTransactions = [];

        // Add marketplace transactions
        if (marketplaceTransactionData.status === 'success' && marketplaceTransactionData.data.transactions) {
          marketplaceTransactionData.data.transactions.forEach(txn => {
            allTransactions.push({
              ...txn,
              source: 'marketplace',
              sourceLabel: 'Marketplace',
              sourceIcon: 'shopping',
              customer_name: txn.first_name && txn.last_name ? `${txn.first_name} ${txn.last_name}` : 'Customer'
            });
          });
        }

        // Add land report payments
        if (landReportData.status === 'success' && landReportData.data.payments) {
          landReportData.data.payments.forEach(payment => {
            allTransactions.push({
              ...payment,
              source: 'land_report',
              sourceLabel: 'Land Report',
              sourceIcon: 'map',
              customer_name: payment.first_name && payment.last_name ? `${payment.first_name} ${payment.last_name}` : 'Landowner',
              // Standardize field names
              transaction_id: payment.transaction_id || payment.id,
              payment_status: payment.payment_status || 'completed'
            });
          });
        }

        // Sort by date (most recent first) and take the latest 8 transactions
        recentTransactions = allTransactions
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8);

        console.log('Dashboard Data Summary:', {
          marketplaceRevenue,
          landReportPayments,
          totalPayments,
          transactionCount: recentTransactions.length
        });

        setDashboardData({
          totalPaymentsReceived: totalPayments,
          currentHarvestIncome: landReportPayments,
          marketplaceRevenue,
          landReportPayments,
          recentTransactions,
          monthlyTrend: 15.2 // Placeholder for growth percentage
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDismissNewCropsNotification = () => {
    setShowNewCropsNotification(false);
  };

  const handleDismissProposalNotification = () => {
    setShowProposalNotification(false);
  };

  return (
    <div className="p-4 md:p-10 font-poppins">
      
      {/* Header Section */}
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-sm md:text-lg text-green-600 mt-2">
              Welcome back, {userName || "Financial Manager"}
            </p>
          </div>
        </div>
      </div>

      {/* New Proposal Requests Notification */}
      {!loadingProposals && newProposals.length > 0 && showProposalNotification && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-r-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-amber-500 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-800">
                    📋 New Proposal Requests for Financial Review
                  </h3>
                  <button
                    onClick={handleDismissProposalNotification}
                    className="text-amber-400 hover:text-amber-600 transition-colors"
                    title="Dismiss notification"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-amber-700 mb-3">
                    <strong>{newProposals.length}</strong> proposal{newProposals.length > 1 ? 's' : ''} waiting for financial review and approval:
                  </p>
                  
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {newProposals.slice(0, 3).map((proposal) => (
                      <div key={proposal.proposal_id} className="bg-white bg-opacity-70 rounded-md px-3 py-2 border border-amber-200 flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-amber-800">
                            Proposal #{proposal.proposal_id}
                          </span>
                          <span className="text-xs text-amber-600 ml-2">
                            from {proposal.landowner_name || 'Landowner'}
                          </span>
                        </div>
                        <span className="text-xs text-amber-600">
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {newProposals.length > 3 && (
                      <div className="text-center">
                        <span className="text-xs text-amber-600 font-medium">
                          +{newProposals.length - 3} more proposals
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <NavLink 
                      to="/financialmanagerproposalreview"
                      className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review Proposals
                    </NavLink>
                    <p className="text-xs text-amber-600 flex items-center">
                      💡 Review and approve financial terms to move proposals forward in the system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Crops Notification */}
      {!loadingNewCrops && newCrops.length > 0 && showNewCropsNotification && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-red-800">
                    New Crops Available for Marketplace
                  </h3>
                  <button
                    onClick={handleDismissNewCropsNotification}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Dismiss notification"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-red-700 mb-3">
                    <strong>{newCrops.length}</strong> new crop{newCrops.length > 1 ? 's have' : ' has'} been added to inventory:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                    {newCrops.map((crop) => (
                      <div key={crop.crop_id} className="bg-white bg-opacity-70 rounded-md px-3 py-2 border border-red-200">
                        <span className="text-sm font-medium text-red-800">{crop.crop_name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <NavLink 
                      to="/financialmanagermarketplaceproducts"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Add to Marketplace
                    </NavLink>
                    <p className="text-xs text-red-600 flex items-center">
                      Add these crops to the marketplace to make them available for buyers and start generating revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Payments Received */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Payments Received</p>
                <p className="text-2xl font-bold mt-1 text-green-800">
                  {loading ? "Loading..." : `${dashboardData.totalPaymentsReceived.toLocaleString()} LKR`}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">All revenue sources</span>
            </div>
          </div>

          {/* Current Harvest Income */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Land Report Income</p>
                <p className="text-2xl font-bold mt-1 text-emerald-800">
                  {loading ? "Loading..." : `${dashboardData.landReportPayments.toLocaleString()} LKR`}
                </p>
              </div>
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-emerald-600">From land analysis reports</span>
            </div>
          </div>

          {/* Marketplace Revenue */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-700 font-medium">Marketplace Revenue</p>
                <p className="text-2xl font-bold mt-1 text-teal-800">
                  {loading ? "Loading..." : `${dashboardData.marketplaceRevenue.toLocaleString()} LKR`}
                </p>
              </div>
              <Activity className="w-8 h-8 text-teal-600" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-teal-600">From product sales</span>
              <div className="flex items-center gap-2">
                {newCrops.length > 0 && showNewCropsNotification && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-600 font-medium">New items</span>
                  </div>
                )}
                {newProposals.length > 0 && showProposalNotification && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-amber-600 font-medium">Reviews</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
            <NavLink 
              to="/financialmanagerpaymentmanagement" 
              className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
            >
              View All
            </NavLink>
          </div>
          
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading transactions...</div>
          ) : dashboardData.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((txn, index) => (
                <div key={`${txn.source}-${txn.transaction_id || txn.id}-${index}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      txn.source === 'marketplace' 
                        ? 'bg-blue-100 border-blue-200' 
                        : 'bg-emerald-100 border-emerald-200'
                    }`}>
                      {txn.source === 'marketplace' ? (
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-800">
                          {txn.customer_name}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          txn.source === 'marketplace'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {txn.sourceLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {txn.source === 'land_report' && txn.land_id && (
                          <span className="ml-2">• Land #{txn.land_id}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      Rs {parseFloat(txn.amount).toLocaleString()}
                    </p>
                    <p className={`text-xs px-2 py-1 rounded-full font-medium ${
                      txn.payment_status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                      txn.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {txn.payment_status}
                    </p>
                  </div>
                </div>
              ))}
              
              {dashboardData.recentTransactions.length === 8 && (
                <div className="text-center pt-2">
                  <NavLink 
                    to="/financialmanagerpaymentmanagement" 
                    className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
                  >
                    View more transactions →
                  </NavLink>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💳</div>
              <p className="text-gray-500 text-sm">No recent transactions found</p>
              <p className="text-gray-400 text-xs mt-1">
                Transactions will appear here as they are processed
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            <div className="flex items-center gap-2">
              {newCrops.length > 0 && showNewCropsNotification && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">Items</span>
                </div>
              )}
              {newProposals.length > 0 && showProposalNotification && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-amber-600 font-medium">Reviews</span>
                </div>
              )}
              {(newCrops.length > 0 && showNewCropsNotification) || (newProposals.length > 0 && showProposalNotification) ? (
                <span className="text-xs text-gray-500 font-medium">Action needed</span>
              ) : null}
            </div>
          </div>
          
          <div className="space-y-3">
            
            {/* Proposal Review Action - Show first if there are pending proposals */}
            {newProposals.length > 0 && showProposalNotification && (
              <NavLink 
                to="/financialmanagerproposalreview" 
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-lg transition-colors group border border-amber-300 hover:border-amber-400 relative"
              >
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 group-hover:text-amber-800">
                      Proposal Review
                    </p>
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {newProposals.length} pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Review financial terms for new proposals
                  </p>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
              </NavLink>
            )}

            <NavLink 
              to="/financialmanagerprofitcalculation" 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 rounded-lg transition-colors group border border-green-200 hover:border-green-300"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-green-800">Profit Calculation</p>
                <p className="text-sm text-gray-600">Calculate monthly profits and expenses</p>
              </div>
            </NavLink>

            <NavLink 
              to="/financialmanagerpayment" 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-150 rounded-lg transition-colors group border border-emerald-200 hover:border-emerald-300"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-emerald-800">Payment Management</p>
                <p className="text-sm text-gray-600">Track all system payments</p>
              </div>
            </NavLink>

            <NavLink 
              to="/financialmanagermarketplacefinance" 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-150 rounded-lg transition-colors group border border-teal-200 hover:border-teal-300"
            >
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-teal-800">Marketplace Finance</p>
                <p className="text-sm text-gray-600">View marketplace earnings</p>
              </div>
            </NavLink>

            <NavLink 
              to="/financialmanagerharvestincome" 
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-lime-50 to-lime-100 hover:from-lime-100 hover:to-lime-150 rounded-lg transition-colors group border border-lime-200 hover:border-lime-300"
            >
              <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-lime-800">Harvest Income</p>
                <p className="text-sm text-gray-600">Manage harvest income reports</p>
              </div>
            </NavLink>

            <NavLink 
              to="/financialmanagermarketplaceproducts" 
              className={`flex items-center gap-4 p-4 rounded-lg transition-colors group border relative ${
                newCrops.length > 0 && showNewCropsNotification
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-red-300 hover:border-red-400'
                  : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 border-green-200 hover:border-green-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                newCrops.length > 0 && showNewCropsNotification ? 'bg-red-600' : 'bg-green-600'
              }`}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${
                    newCrops.length > 0 && showNewCropsNotification 
                      ? 'text-gray-800 group-hover:text-red-800' 
                      : 'text-gray-800 group-hover:text-green-800'
                  }`}>
                    Marketplace Products
                  </p>
                  {newCrops.length > 0 && showNewCropsNotification && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {newCrops.length} new
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {newCrops.length > 0 && showNewCropsNotification 
                    ? 'Add new crops to marketplace' 
                    : 'Manage product listings'
                  }
                </p>
              </div>
              {newCrops.length > 0 && showNewCropsNotification && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </NavLink>

          </div>
        </div>
      </div>

    </div>
  );
}


