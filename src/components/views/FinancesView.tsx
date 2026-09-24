import React, { useState } from 'react';
import { Plus, Wallet, ArrowDownRight, ArrowUpRight, Target, Trash2 } from 'lucide-react';
import { Transaction, Budget } from '../../types/lifeos';
import { DonutBreakdownChart } from '../charts/DonutBreakdownChart';
import { api } from '../../services/api';

interface FinancesViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  activeDate: string;
  currency: string;
  onRefresh: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  transactions,
  budgets,
  activeDate,
  currency,
  onRefresh,
}) => {
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  // Form states
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [notes, setNotes] = useState('');

  const [budgetCategory, setBudgetCategory] = useState('Food');
  const [budgetLimit, setBudgetLimit] = useState('15000');

  const thisMonth = activeDate.slice(0, 7); // '2026-09'
  const monthTransactions = transactions.filter(t => t.transactionDate.startsWith(thisMonth));

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Group expenses by category
  const expenseByCategory: Record<string, number> = {};
  for (const t of monthTransactions.filter(t => t.type === 'expense')) {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  }

  const categoryColors: Record<string, string> = {
    Food: '#f59e0b',
    Transport: '#3b82f6',
    Education: '#8b5cf6',
    Bills: '#ef4444',
    Entertainment: '#ec4899',
    Health: '#10b981',
    Other: '#64748b',
  };

  const donutData = Object.entries(expenseByCategory).map(([cat, val]) => ({
    label: cat,
    value: val,
    color: categoryColors[cat] || '#6366f1',
  }));

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    try {
      await api.addTransaction({
        type: txType,
        amount: Number(amount),
        currency,
        category,
        paymentMethod,
        transactionDate: activeDate,
        notes,
      });
      setAmount('');
      setNotes('');
      setShowAddTx(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.setBudget({
        category: budgetCategory,
        monthlyLimit: Number(budgetLimit),
        monthYear: thisMonth,
      });
      setShowAddBudget(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Capital Allocation & Monthly Cash Flow</span>
            <span aria-hidden="true">·</span>
            <span>{thisMonth} ({currency})</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Personal Finances & Budget Control
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Track expenses against hard budget ceilings, monitor cash flow, and build emergency savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBudget(!showAddBudget)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium"
          >
            Set Budget
          </button>
          <button
            onClick={() => setShowAddTx(!showAddTx)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Total Income</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            <span className="text-xs text-neutral-400 font-normal">{currency} </span>
            {totalIncome.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Freelance & Consulting
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Total Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            <span className="text-xs text-neutral-400 font-normal">{currency} </span>
            {totalExpense.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            {monthTransactions.filter(t => t.type === 'expense').length} records this month
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Net Liquid Savings</span>
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums mt-1">
            <span className="text-xs text-neutral-400 font-normal">{currency} </span>
            {netSavings.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Positive capital flow
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Savings Rate</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            {savingsRate}%
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Target: &gt; 50%
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showAddTx && (
        <form onSubmit={handleCreateTx} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">New Financial Entry</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Type</label>
              <select
                value={txType}
                onChange={e => setTxType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Amount ({currency})</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1200"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="Food">Food & Groceries</option>
                <option value="Transport">Transport & Fuel</option>
                <option value="Education">Education & Books</option>
                <option value="Bills">Bills & Internet</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health & Fitness</option>
                <option value="Freelance">Freelance</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="eSewa">eSewa</option>
                <option value="Khalti">Khalti</option>
                <option value="Bank Transfer">Bank Transfer / ConnectIPS</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Description or notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddTx(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Transaction
            </button>
          </div>
        </form>
      )}

      {/* Add Budget Form */}
      {showAddBudget && (
        <form onSubmit={handleCreateBudget} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Set Monthly Budget Ceiling</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
              <select
                value={budgetCategory}
                onChange={e => setBudgetCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Education">Education</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Monthly Ceiling ({currency})</label>
              <input
                type="number"
                value={budgetLimit}
                onChange={e => setBudgetLimit(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddBudget(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Budget
            </button>
          </div>
        </form>
      )}

      {/* Budget Progress Bars & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Budget Ceilings (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-100">Category Budget Utilization ({thisMonth})</h3>
          <div className="space-y-3">
            {budgets.map(b => {
              const spent = expenseByCategory[b.category] || 0;
              const pct = Math.min(100, Math.round((spent / b.monthlyLimit) * 100));
              const isOver = spent > b.monthlyLimit;

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{b.category}</span>
                    <span className="font-mono tabular-nums text-neutral-400">
                      {currency} {spent.toLocaleString()} / {b.monthlyLimit.toLocaleString()}{' '}
                      <strong className={isOver ? 'text-rose-400' : 'text-neutral-300'}>
                        ({pct}%)
                      </strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Expenses Donut Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-100 mb-2">Spending Breakdown</h3>
          <DonutBreakdownChart data={donutData} unit={` ${currency}`} size={160} />
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">Recent Transactions</h3>
        <div className="divide-y divide-neutral-850">
          {transactions.slice(0, 8).map(tx => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-200">
                    {tx.category} {tx.notes && <span className="text-neutral-400 font-normal">· {tx.notes}</span>}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {tx.transactionDate} · {tx.paymentMethod}
                  </div>
                </div>
              </div>

              <div
                className={`font-mono text-xs font-bold tabular-nums ${
                  tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-200'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}{currency} {tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
