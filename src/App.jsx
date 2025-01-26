import React, { useState, useEffect } from 'react';
import './App.css';
import FishingGame from './FishingGame';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    spent: 0
  });

  // Save to localStorage whenever transactions or budgets change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date
    };
    
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

    if (type === 'expense' && category) {
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => {
          if (budget.category === category) {
            return {
              ...budget,
              spent: budget.spent + parseFloat(amount)
            };
          }
          return budget;
        })
      );
    }

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const newBudgetItem = {
      id: Date.now(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit) || 0,
      spent: 0
    };
    setBudgets(prevBudgets => [...prevBudgets, newBudgetItem]);
    setNewBudget({ category: '', limit: '', spent: 0 });
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
  };

  const calculateIncome = () => {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const calculateExpenses = () => {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const calculateBudgetSpent = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getFinancialMood = () => {
    const balance = calculateBalance();
    const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    const budgetHealth = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    if (balance > 0 && budgetHealth < 75) {
      return {
        emoji: "😊",
        message: "Great job! Your finances are looking healthy!",
        color: '#2ecc71'
      };
    } else if (balance > 0 && budgetHealth < 90) {
      return {
        emoji: "😐",
        message: "You're doing okay, but watch your spending!",
        color: '#f1c40f'
      };
    } else {
      return {
        emoji: "😟",
        message: "Careful! Your spending needs attention.",
        color: '#e74c3c'
      };
    }
  };

  const getSpecificAdvice = () => {
    const balance = calculateBalance();
    const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    const budgetHealth = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    if (balance > 0 && budgetHealth < 75) {
      return ["Consider saving more for emergencies", "Look for ways to increase income"];
    } else if (balance > 0 && budgetHealth < 90) {
      return ["Try to save a little more each month", "Consider cutting back on non-essential expenses"];
    } else {
      return ["Cut back on unnecessary expenses", "Consider increasing income or reducing expenses"];
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        const mood = getFinancialMood();
        const specificAdvice = getSpecificAdvice();
        
        return (
          <div className="dashboard-wrapper">
            <div className="mood-section">
              <div className="mood-indicator" style={{ borderLeft: `4px solid ${mood.color}` }}>
                <div className="mood-emoji">{mood.emoji}</div>
                <p className="mood-message">{mood.message}</p>
                {specificAdvice.length > 0 && (
                  <div className="specific-advice">
                    <h4>Helpful Tips:</h4>
                    <ul>
                      {specificAdvice.map((advice, index) => (
                        <li key={index}>{advice}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="summary-cards">
                <div className="balance-card">
                  <h3>Current Balance</h3>
                  <h1>${calculateBalance().toFixed(2)}</h1>
                </div>
                <div className="summary-card income">
                  <h3>Total Income</h3>
                  <h2>${calculateIncome().toFixed(2)}</h2>
                </div>
                <div className="summary-card expense">
                  <h3>Total Expenses</h3>
                  <h2>${calculateExpenses().toFixed(2)}</h2>
                </div>
              </div>

              <div className="dashboard-content">
                <div className="recent-activity">
                  <h3>Recent Transactions</h3>
                  <div className="transactions-preview">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className={`transaction-item ${transaction.type}`}
                      >
                        <div className="transaction-info">
                          <span className="description">{transaction.description}</span>
                          {transaction.category && (
                            <span className="category">{transaction.category}</span>
                          )}
                          <span className="date">{transaction.date}</span>
                        </div>
                        <span className="amount">
                          {transaction.type === 'income' ? '+' : '-'}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="budget-overview">
                  <h3>Budget Overview</h3>
                  <div className="budget-preview">
                    {budgets.map(budget => {
                      const percentage = (budget.spent / budget.limit) * 100;
                      return (
                        <div key={budget.id} className="budget-item">
                          <div className="budget-info">
                            <h4>{budget.category}</h4>
                            <p>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</p>
                          </div>
                          <div className="budget-progress">
                            <div 
                              className={`progress-bar ${
                                percentage > 100 ? 'danger' :
                                percentage > 75 ? 'warning' : ''
                              }`}
                              style={{ 
                                width: `${Math.min(percentage, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="transactions-section">
            <form onSubmit={handleSubmit} className="transaction-form">
              <h3>Add New Transaction</h3>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {type === 'expense' && (
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required={type === 'expense'}
                  >
                    <option value="">Select Category</option>
                    {budgets.map(budget => (
                      <option key={budget.id} value={budget.category}>
                        {budget.category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="submit-btn">Add Transaction</button>
            </form>

            <div className="transactions-list">
              <h3>Transaction History</h3>
              {transactions.length === 0 ? (
                <p className="no-transactions">No transactions yet</p>
              ) : (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className={`transaction-item ${transaction.type}`}
                  >
                    <div className="transaction-info">
                      <span className="description">{transaction.description}</span>
                      {transaction.category && (
                        <span className="category">{transaction.category}</span>
                      )}
                      <span className="date">{transaction.date}</span>
                    </div>
                    <span className="amount">
                      {transaction.type === 'income' ? '+' : '-'}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="budget-section">
            <form onSubmit={handleBudgetSubmit} className="budget-form">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({
                    ...newBudget,
                    category: e.target.value
                  })}
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Limit</label>
                <input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({
                    ...newBudget,
                    limit: parseFloat(e.target.value)
                  })}
                  placeholder="Enter limit"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <button type="submit" className="submit-btn">Add Budget</button>
            </form>

            <div className="budget-list">
              {budgets.map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <div key={budget.id} className="budget-item">
                    <div className="budget-info">
                      <h4>{budget.category}</h4>
                      <p>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</p>
                    </div>
                    <div className="budget-progress">
                      <div 
                        className={`progress-bar ${
                          percentage > 100 ? 'danger' :
                          percentage > 75 ? 'warning' : ''
                        }`}
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'fishing':
        return <FishingGame />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <h2>FinTracker</h2>
        <ul className="nav-links">
          <li 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={activeTab === 'transactions' ? 'active' : ''} 
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </li>
          <li 
            className={activeTab === 'budget' ? 'active' : ''} 
            onClick={() => setActiveTab('budget')}
          >
            Budget
          </li>
          <li 
            className={activeTab === 'fishing' ? 'active' : ''} 
            onClick={() => setActiveTab('fishing')}
          >
            Fishing 🎣
          </li>
        </ul>
      </div>
      
      <div className="main-content">
        <div className="financial-tracker">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
