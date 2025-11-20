import { useState } from 'react';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Calendar,
  Receipt,
  PieChart,
  Download,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const TransactionPage = () => {
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Income Data
  const participants = 28;
  const participantFee = 15000;
  const totalParticipantIncome = participants * participantFee;
  
  const sponsors = [
    { name: "Sponsor 1", amount: 11000, date: "2025-11-15", status: "received" },
    { name: "Sponsor 2", amount: 11000, date: "2025-11-18", status: "received" },
  ];
  
  const totalSponsorIncome = sponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0);
  const totalIncome = totalParticipantIncome + totalSponsorIncome;

  // Expense Data by Category
  const expenses = [
    {
      category: "Transportation",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "blue",
      items: [
        { description: "Bus Rental (Round Trip)", amount: 85000, date: "2025-12-04", status: "paid" },
        { description: "Fuel Cost", amount: 25000, date: "2025-12-04", status: "paid" },
        { description: "Driver & Helper Allowance", amount: 8000, date: "2025-12-04", status: "paid" },
        { description: "Toll & Parking Fees", amount: 5000, date: "2025-12-04", status: "paid" },
      ]
    },
    {
      category: "Accommodation",
      icon: <Building2 className="w-5 h-5" />,
      color: "purple",
      items: [
        { description: "Cox's Bazar Hotel (3 nights)", amount: 120000, date: "2025-12-05", status: "paid" },
        { description: "Saint Martin Hotel (2 nights)", amount: 90000, date: "2025-12-08", status: "paid" },
        { description: "Cox's Bazar Hotel (1 night)", amount: 40000, date: "2025-12-10", status: "paid" },
      ]
    },
    {
      category: "Food & Meals",
      icon: <Receipt className="w-5 h-5" />,
      color: "orange",
      items: [
        { description: "Breakfast (8 days x 28 people)", amount: 22400, date: "2025-12-04", status: "paid" },
        { description: "Lunch (8 days x 28 people)", amount: 44800, date: "2025-12-04", status: "paid" },
        { description: "Dinner (8 days x 28 people)", amount: 44800, date: "2025-12-04", status: "paid" },
        { description: "Snacks & Refreshments", amount: 15000, date: "2025-12-04", status: "paid" },
        { description: "Barbecue Night (Saint Martin)", amount: 25000, date: "2025-12-09", status: "pending" },
      ]
    },
    {
      category: "Ship/Boat Transport",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "cyan",
      items: [
        { description: "Ship Tickets to Saint Martin (28 people)", amount: 42000, date: "2025-12-08", status: "paid" },
        { description: "Return Ship Tickets", amount: 42000, date: "2025-12-10", status: "paid" },
        { description: "Boat to Chera Dwip", amount: 8400, date: "2025-12-09", status: "pending" },
      ]
    },
    {
      category: "Entry Fees & Activities",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "green",
      items: [
        { description: "Marine Drive Entry Fee", amount: 2800, date: "2025-12-06", status: "paid" },
        { description: "Himchori Waterfall Entry", amount: 2800, date: "2025-12-06", status: "paid" },
        { description: "Submarine Cable Station Visit", amount: 5000, date: "2025-12-07", status: "confirmed" },
        { description: "Saint Martin Entry Fee", amount: 2800, date: "2025-12-08", status: "pending" },
      ]
    },
    {
      category: "Miscellaneous",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "pink",
      items: [
        { description: "First Aid & Medical Kit", amount: 3000, date: "2025-11-20", status: "paid" },
        { description: "Photography & Videography", amount: 15000, date: "2025-12-04", status: "confirmed" },
        { description: "Tour Guide Services", amount: 10000, date: "2025-12-04", status: "confirmed" },
        { description: "Emergency Fund", amount: 20000, date: "2025-12-04", status: "reserved" },
        { description: "Souvenirs & Gifts", amount: 8000, date: "2025-12-11", status: "pending" },
        { description: "Contingency Buffer", amount: 15000, date: "2025-12-04", status: "reserved" },
      ]
    }
  ];

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, category) => 
    sum + category.items.reduce((catSum, item) => catSum + item.amount, 0), 0
  );

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = expenses.map(category => ({
    category: category.category,
    total: category.items.reduce((sum, item) => sum + item.amount, 0),
    color: category.color
  }));

  // Get status badge config
  const getStatusConfig = (status) => {
    const configs = {
      paid: { label: 'Paid', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
      received: { label: 'Received', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
      pending: { label: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: <Clock className="w-3 h-3" /> },
      confirmed: { label: 'Confirmed', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: <CheckCircle2 className="w-3 h-3" /> },
      reserved: { label: 'Reserved', bgColor: 'bg-purple-100', textColor: 'text-purple-700', icon: <AlertCircle className="w-3 h-3" /> },
    };
    return configs[status] || configs.pending;
  };

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700' },
      cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-700' },
      green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
      pink: { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' },
    };
    return colors[color] || colors.blue;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30 mb-3 sm:mb-4">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">Industrial Tour 2025</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 px-2">
              Financial Transactions
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl mx-auto px-4">
              Complete breakdown of income and expenses for Perceptron-13 tour
            </p>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{formatCurrency(totalIncome)}</div>
              <div className="text-xs sm:text-sm text-gray-200">Total Income</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{formatCurrency(totalExpenses)}</div>
              <div className="text-xs sm:text-sm text-gray-200">Total Expenses</div>
            </div>

            <div className={`bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/20 ${balance >= 0 ? '' : 'ring-2 ring-red-400'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${balance >= 0 ? 'bg-blue-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                  <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${balance >= 0 ? 'text-blue-300' : 'text-red-300'}`} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{formatCurrency(Math.abs(balance))}</div>
              <div className="text-xs sm:text-sm text-gray-200">{balance >= 0 ? 'Balance' : 'Deficit'}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{participants}</div>
              <div className="text-xs sm:text-sm text-gray-200">Participants</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs sm:text-sm flex-shrink-0 ${
                filterType === 'all'
                  ? 'bg-[#19aaba] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              <PieChart className="w-3 h-3 sm:w-4 sm:h-4" />
              All Transactions
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs sm:text-sm flex-shrink-0 ${
                filterType === 'income'
                  ? 'bg-[#19aaba] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              Income
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs sm:text-sm flex-shrink-0 ${
                filterType === 'expense'
                  ? 'bg-[#19aaba] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              Expenses
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Income & Expenses */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Income Section */}
              {(filterType === 'all' || filterType === 'income') && (
                <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-green-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 border-b border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Income Sources</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Total: {formatCurrency(totalIncome)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4">
                    {/* Participant Contributions */}
                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Participant Contributions</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{participants} participants × {formatCurrency(participantFee)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-green-700">{formatCurrency(totalParticipantIncome)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 ${getStatusConfig('received').bgColor} ${getStatusConfig('received').textColor} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {getStatusConfig('received').icon}
                          <span>Collected</span>
                        </div>
                      </div>
                    </div>

                    {/* Sponsors */}
                    <div className="space-y-3">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">Sponsor Contributions</h3>
                      {sponsors.map((sponsor, index) => (
                        <div key={index} className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900">{sponsor.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{sponsor.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-base sm:text-lg font-bold text-green-700">{formatCurrency(sponsor.amount)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 ${getStatusConfig(sponsor.status).bgColor} ${getStatusConfig(sponsor.status).textColor} px-2 py-0.5 rounded-full text-xs font-medium`}>
                              {getStatusConfig(sponsor.status).icon}
                              <span>{getStatusConfig(sponsor.status).label}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Expenses Section */}
              {(filterType === 'all' || filterType === 'expense') && (
                <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-red-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6 border-b border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Expenses Breakdown</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Total: {formatCurrency(totalExpenses)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4">
                    {expenses.map((category, catIndex) => {
                      const colors = getColorClasses(category.color);
                      const categoryTotal = category.items.reduce((sum, item) => sum + item.amount, 0);
                      const isExpanded = expandedCategory === catIndex;

                      return (
                        <div key={catIndex} className={`${colors.light} rounded-lg sm:rounded-xl border-2 ${colors.light} overflow-hidden`}>
                          <button
                            onClick={() => setExpandedCategory(isExpanded ? null : catIndex)}
                            className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <div className="text-white">
                                  {category.icon}
                                </div>
                              </div>
                              <div className="text-left">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">{category.category}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">{category.items.length} items</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="text-right">
                                <div className={`text-base sm:text-lg font-bold ${colors.text}`}>{formatCurrency(categoryTotal)}</div>
                              </div>
                              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t-2 border-gray-200 bg-white/50 p-3 sm:p-4 space-y-2 sm:space-y-3">
                              {category.items.map((item, itemIndex) => {
                                const statusConfig = getStatusConfig(item.status);
                                return (
                                  <div key={itemIndex} className="bg-white rounded-lg p-2.5 sm:p-3 border border-gray-200">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{item.description}</h4>
                                        <p className="text-xs text-gray-600">{item.date}</p>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <div className="text-sm sm:text-base font-bold text-gray-900">{formatCurrency(item.amount)}</div>
                                      </div>
                                    </div>
                                    <div className={`flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor} px-2 py-0.5 rounded-full text-xs font-medium w-fit`}>
                                      {statusConfig.icon}
                                      <span>{statusConfig.label}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Expense Distribution */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
                <div className="bg-gray-50 p-4 sm:p-5 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Expense Distribution
                  </h3>
                </div>
                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  {expensesByCategory.map((cat, index) => {
                    const colors = getColorClasses(cat.color);
                    const percentage = ((cat.total / totalExpenses) * 100).toFixed(1);
                    
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{cat.category}</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-1">
                          <div
                            className={`${colors.bg} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">{formatCurrency(cat.total)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="border-t border-gray-200 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Total Income</span>
                    <span className="text-xs sm:text-sm font-bold text-green-700">{formatCurrency(totalIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Total Expenses</span>
                    <span className="text-xs sm:text-sm font-bold text-red-700">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{balance >= 0 ? 'Balance' : 'Deficit'}</span>
                      <span className={`text-base sm:text-lg font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                        {formatCurrency(Math.abs(balance))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransactionPage;
