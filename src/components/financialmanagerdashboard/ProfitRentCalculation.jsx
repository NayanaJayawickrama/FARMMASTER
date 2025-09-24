import React, { useState } from "react";

export default function ProfitRentCalculation() {
  // Time period state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  
  // Income state
  const [monthlyProductIncome, setMonthlyProductIncome] = useState("");
  const [landReportPaymentIncome, setLandReportPaymentIncome] = useState("");
  
  // Expense state
  const [workersWages, setWorkersWages] = useState("");
  const [harvestCost, setHarvestCost] = useState("");
  const [landRental, setLandRental] = useState("");
  
  // Summary modal state
  const [showSummary, setShowSummary] = useState(false);

  // Calculate comprehensive financial metrics
  const calculateProfitData = () => {
    // Basic Calculations
    const productSalesIncome = parseFloat(monthlyProductIncome) || 0;
    const landReportIncome = parseFloat(landReportPaymentIncome) || 0;
    const totalIncome = productSalesIncome + landReportIncome;
    
    const wagesExpense = parseFloat(workersWages) || 0;
    const harvestExpense = parseFloat(harvestCost) || 0;
    const rentalExpense = parseFloat(landRental) || 0;
    const totalExpenses = wagesExpense + harvestExpense + rentalExpense;
    
    // Advanced Calculations
    const grossProfit = totalIncome - totalExpenses;
    const netProfit = grossProfit; // Assuming no taxes/interest for now
    
    // Financial Ratios & Metrics
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const revenueGrowthRate = 15; // Placeholder - would be calculated from historical data
    
    // Break-even Analysis
    const breakEvenPoint = totalExpenses;
    const marginOfSafety = totalIncome > breakEvenPoint ? totalIncome - breakEvenPoint : 0;
    const marginOfSafetyPercent = totalIncome > 0 ? (marginOfSafety / totalIncome) * 100 : 0;
    
    // Cost Analysis
    const fixedCosts = rentalExpense; // Land rental as fixed cost
    const variableCosts = wagesExpense + harvestExpense; // Variable costs
    const averageCostPerUnit = totalIncome > 0 ? totalExpenses / (totalIncome / 100) : 0; // Per 100 LKR of income
    
    // Profitability Analysis
    const returnOnRevenue = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    const costEfficiencyRatio = totalExpenses > 0 ? totalIncome / totalExpenses : 0;
    
    // Performance Indicators
    const performanceStatus = netProfit > 0 ? 'Profitable' : netProfit === 0 ? 'Break-even' : 'Loss';
    const profitabilityGrade = profitMargin >= 20 ? 'Excellent' : 
                              profitMargin >= 15 ? 'Good' : 
                              profitMargin >= 10 ? 'Average' : 
                              profitMargin >= 5 ? 'Below Average' : 'Poor';
    
    // Monthly Projections (Annualized)
    const annualProjectedIncome = totalIncome * 12;
    const annualProjectedExpenses = totalExpenses * 12;
    const annualProjectedProfit = netProfit * 12;
    
    return {
      // Basic Metrics
      totalIncome,
      totalExpenses,
      netProfit,
      grossProfit,
      
      // Income Breakdown
      productSalesIncome,
      landReportIncome,
      
      // Expense Breakdown
      wagesExpense,
      harvestExpense,
      rentalExpense,
      fixedCosts,
      variableCosts,
      
      // Financial Ratios
      profitMargin,
      expenseRatio,
      returnOnRevenue,
      costEfficiencyRatio,
      revenueGrowthRate,
      
      // Break-even Analysis
      breakEvenPoint,
      marginOfSafety,
      marginOfSafetyPercent,
      
      // Cost Analysis
      averageCostPerUnit,
      
      // Performance Indicators
      performanceStatus,
      profitabilityGrade,
      
      // Projections
      annualProjectedIncome,
      annualProjectedExpenses,
      annualProjectedProfit
    };
  };

  // Placeholder for future data loading functionality
  const checkExistingCalculation = () => {
    // This function can be implemented later when backend is ready
    console.log("Checking for existing calculation for:", selectedYear, selectedMonth);
  };

  // Clear form helper
  const clearForm = () => {
    setMonthlyProductIncome("");
    setLandReportPaymentIncome("");
    setWorkersWages("");
    setHarvestCost("");
    setLandRental("");
  };

  // Show comprehensive summary of all calculations
  const handleShowSummary = () => {
    // Validate that at least some data has been entered
    if (financialData.totalIncome === 0 && financialData.totalExpenses === 0) {
      alert("Please enter some income or expense data before generating a summary.");
      return;
    }
    
    setShowSummary(true);
  };

  // Handle clear all
  const handleClearAll = () => {
    clearForm();
    setSelectedYear(new Date().getFullYear().toString());
    setSelectedMonth((new Date().getMonth() + 1).toString());
    console.log("Form cleared successfully");
  };

  const financialData = calculateProfitData();

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Add CSS to hide number input arrows */}
      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Profit Calculation
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Enter income and expense data to calculate company profit.
      </p>

      {/* Time Period Selection */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Time Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[
                { value: '1', label: 'January' },
                { value: '2', label: 'February' },
                { value: '3', label: 'March' },
                { value: '4', label: 'April' },
                { value: '5', label: 'May' },
                { value: '6', label: 'June' },
                { value: '7', label: 'July' },
                { value: '8', label: 'August' },
                { value: '9', label: 'September' },
                { value: '10', label: 'October' },
                { value: '11', label: 'November' },
                { value: '12', label: 'December' }
              ].map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Selected Period:</span> {
            new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-6">
            Income Sources
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">
                Monthly Product Sales Income (LKR)
              </label>
              <input
                type="number"
                value={monthlyProductIncome}
                onChange={(e) => setMonthlyProductIncome(e.target.value)}
                className="w-full bg-white border border-green-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter monthly product sales income"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">
                Land Report Payment Income (LKR)
              </label>
              <input
                type="number"
                value={landReportPaymentIncome}
                onChange={(e) => setLandReportPaymentIncome(e.target.value)}
                className="w-full bg-white border border-green-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter land report payment income"
              />
            </div>

            {/* Income Summary */}
            <div className="mt-6 p-4 bg-green-100 rounded-md">
              <h3 className="font-semibold text-green-700 mb-2">Total Income</h3>
              <p className="text-2xl font-bold text-green-800">
                Rs {financialData.totalIncome.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-green-600">
                <div className="flex justify-between">
                  <span>Product Sales (%):</span>
                  <span>{financialData.totalIncome > 0 ? ((financialData.productSalesIncome / financialData.totalIncome) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Land Reports (%):</span>
                  <span>{financialData.totalIncome > 0 ? ((financialData.landReportIncome / financialData.totalIncome) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-700 mb-6">
            Expenses
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Workers' Wages (LKR)
              </label>
              <input
                type="number"
                value={workersWages}
                onChange={(e) => setWorkersWages(e.target.value)}
                className="w-full bg-white border border-red-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter total workers' wages"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Harvest Cost (LKR)
              </label>
              <input
                type="number"
                value={harvestCost}
                onChange={(e) => setHarvestCost(e.target.value)}
                className="w-full bg-white border border-red-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter harvest costs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">
                Land Rental (LKR)
              </label>
              <input
                type="number"
                value={landRental}
                onChange={(e) => setLandRental(e.target.value)}
                className="w-full bg-white border border-red-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter land rental costs"
              />
            </div>

            {/* Expense Summary */}
            <div className="mt-6 p-4 bg-red-100 rounded-md">
              <h3 className="font-semibold text-red-700 mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-800">
                Rs {financialData.totalExpenses.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-red-600">
                <div className="flex justify-between">
                  <span>Fixed Costs:</span>
                  <span>Rs {financialData.fixedCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Variable Costs:</span>
                  <span>Rs {financialData.variableCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expense Ratio:</span>
                  <span>{financialData.expenseRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Financial Dashboard */}
      <div className="mt-8 space-y-6">
        {/* Key Performance Indicators */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Key Performance Indicators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Performance Status</h3>
              <p className={`text-lg font-bold ${
                financialData.performanceStatus === 'Profitable' ? 'text-green-700' :
                financialData.performanceStatus === 'Break-even' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {financialData.performanceStatus}
              </p>
              <p className="text-xs text-gray-500 mt-1">{financialData.profitabilityGrade}</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Net Profit</h3>
              <p className={`text-lg font-bold ${financialData.netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                Rs {financialData.netProfit.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Monthly</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Profit Margin</h3>
              <p className="text-lg font-bold text-purple-700">
                {financialData.profitMargin.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Return on Revenue</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Cost Efficiency</h3>
              <p className="text-lg font-bold text-indigo-700">
                {financialData.costEfficiencyRatio.toFixed(2)}x
              </p>
              <p className="text-xs text-gray-500 mt-1">Revenue per Cost</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Break-even Point</h3>
              <p className="text-lg font-bold text-orange-700">
                Rs {financialData.breakEvenPoint.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Required Revenue</p>
            </div>
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profitability Analysis */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Profitability Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Gross Profit:</span>
                <span className="font-semibold text-green-600">Rs {financialData.grossProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Return on Revenue:</span>
                <span className="font-semibold text-blue-600">{financialData.returnOnRevenue.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Margin of Safety:</span>
                <span className="font-semibold text-purple-600">Rs {financialData.marginOfSafety.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Safety Margin %:</span>
                <span className="font-semibold text-purple-600">{financialData.marginOfSafetyPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Avg. Cost per Unit:</span>
                <span className="font-semibold text-orange-600">Rs {financialData.averageCostPerUnit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Annual Projections */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Annual Projections</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Projected Annual Income:</span>
                <span className="font-semibold text-green-600">Rs {financialData.annualProjectedIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Projected Annual Expenses:</span>
                <span className="font-semibold text-red-600">Rs {financialData.annualProjectedExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Projected Annual Profit:</span>
                <span className={`font-semibold ${financialData.annualProjectedProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rs {financialData.annualProjectedProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Revenue Growth Rate:</span>
                <span className="font-semibold text-indigo-600">{financialData.revenueGrowthRate}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Monthly Avg. Needed:</span>
                <span className="font-semibold text-purple-600">Rs {(financialData.breakEvenPoint).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Strategic Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-indigo-700 mb-2">Growth Opportunities</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {financialData.productSalesIncome > financialData.landReportIncome ? 
                'Focus on expanding product sales channels' : 
                'Consider increasing product sales volume'}</li>
              <li>• Target {financialData.revenueGrowthRate}% revenue growth for next period</li>
              <li>• Optimize cost structure to improve margins</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Risk Management</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {financialData.fixedCosts > financialData.variableCosts ? 
                'Consider reducing fixed costs' : 
                'Monitor variable cost fluctuations'}</li>
              <li>• Maintain safety margin above {financialData.marginOfSafetyPercent.toFixed(0)}%</li>
              <li>• Diversify revenue streams to reduce dependency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleShowSummary}
          className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          📊 Show Summary
        </button>
        <button 
          onClick={handleClearAll}
          className="bg-gray-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">📊 Profit Calculation Summary</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Period: {new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
                <button 
                  onClick={() => setShowSummary(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Performance Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      financialData.performanceStatus === 'Profitable' ? 'text-green-600' :
                      financialData.performanceStatus === 'Break-even' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {financialData.performanceStatus}
                    </div>
                    <div className="text-sm text-gray-600">{financialData.profitabilityGrade} Performance</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Rs {financialData.netProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Net Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {financialData.profitMargin.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Profit Margin</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income & Expenses Summary */}
                <div className="space-y-4">
                  {/* Income Breakdown */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-3">💰 Income Sources</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Product Sales:</span>
                        <span className="font-semibold text-green-700">Rs {financialData.productSalesIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Land Reports:</span>
                        <span className="font-semibold text-green-700">Rs {financialData.landReportIncome.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-green-700">Total Income:</span>
                          <span className="font-bold text-green-800">Rs {financialData.totalIncome.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-3">💸 Expenses</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">Workers' Wages:</span>
                        <span className="font-semibold text-red-700">Rs {financialData.wagesExpense.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">Harvest Costs:</span>
                        <span className="font-semibold text-red-700">Rs {financialData.harvestExpense.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">Land Rental:</span>
                        <span className="font-semibold text-red-700">Rs {financialData.rentalExpense.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-red-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-red-700">Total Expenses:</span>
                          <span className="font-bold text-red-800">Rs {financialData.totalExpenses.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics & Projections */}
                <div className="space-y-4">
                  {/* Financial Ratios */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-3">📈 Key Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Return on Revenue:</span>
                        <span className="font-semibold text-blue-700">{financialData.returnOnRevenue.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Cost Efficiency:</span>
                        <span className="font-semibold text-blue-700">{financialData.costEfficiencyRatio.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Break-even Point:</span>
                        <span className="font-semibold text-blue-700">Rs {financialData.breakEvenPoint.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Margin of Safety:</span>
                        <span className="font-semibold text-blue-700">{financialData.marginOfSafetyPercent.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Annual Projections */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-3">🔮 Annual Projections</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Projected Income:</span>
                        <span className="font-semibold text-purple-700">Rs {financialData.annualProjectedIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Projected Expenses:</span>
                        <span className="font-semibold text-purple-700">Rs {financialData.annualProjectedExpenses.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-purple-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-purple-700">Projected Profit:</span>
                          <span className={`font-bold ${financialData.annualProjectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Rs {financialData.annualProjectedProfit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Insights */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-700 mb-3">💡 Smart Insights & Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-indigo-600 mb-2">Business Health</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Your business is currently <strong>{financialData.performanceStatus.toLowerCase()}</strong> with <strong>{financialData.profitabilityGrade.toLowerCase()}</strong> performance</li>
                      <li>• Product sales contribute <strong>{financialData.totalIncome > 0 ? ((financialData.productSalesIncome / financialData.totalIncome) * 100).toFixed(1) : 0}%</strong> of total income</li>
                      <li>• {financialData.fixedCosts > financialData.variableCosts ? 
                        'Fixed costs dominate your expense structure' : 
                        'Variable costs are your main expense'}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-indigo-600 mb-2">Action Items</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>{financialData.netProfit > 0 ? 
                        '✅ Great job! Consider reinvesting profits' : 
                        '⚠️ Focus on increasing income or reducing costs'}</li>
                      <li>{financialData.profitMargin >= 15 ? 
                        '✅ Excellent profit margins' : 
                        '💡 Improve profit margins through optimization'}</li>
                      <li>{financialData.marginOfSafetyPercent >= 20 ? 
                        '✅ Good safety margin for stability' : 
                        '⚠️ Consider diversifying income sources'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Generated on {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <button 
                  onClick={() => setShowSummary(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  Close Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
