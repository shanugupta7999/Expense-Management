import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { FaMoneyBill, FaHistory, FaCalendarDay, FaCalendarAlt, FaDollarSign, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

function ExpenseCard({ title, amount, bgColor, icon }) {
  return (
    <div className="expense-card" style={{ backgroundColor: bgColor }}>
      {icon}
      <h2>{title}</h2>
      <p>{amount}</p>
    </div>
  );
}

function Dashboard() {
  const [expensesData, setExpensesData] = useState({
    today: 0,
    yesterday: 0,
    last7Days: 0,
    thisMonth: 0,
    totalExpenses: 0,
    budgetLeft: 'Not Set Yet',
  });

  const [monthlyBudget, setMonthlyBudget] = useState(0);

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          console.error("User not found in localStorage");
          return;
        }

        const res = await axios.post('/transections/getalltransection', { userid: user._id, type: 'expense' });
        const transactions = res.data;

        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');
        const startOfMonth = moment().startOf('month');

        const todayExpenses = transactions
          .filter(t => moment(t.date).isSame(today, 'day'))
          .reduce((acc, t) => acc + t.amount, 0);

        const yesterdayExpenses = transactions
          .filter(t => moment(t.date).isSame(yesterday, 'day'))
          .reduce((acc, t) => acc + t.amount, 0);

        const last7DaysExpenses = transactions
          .filter(t => moment(t.date).isAfter(moment().subtract(7, 'days')))
          .reduce((acc, t) => acc + t.amount, 0);

        const thisMonthExpenses = transactions
          .filter(t => moment(t.date).isSameOrAfter(startOfMonth))
          .reduce((acc, t) => acc + t.amount, 0);

        const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);

        const budgetLeft = monthlyBudget
          ? `$${(monthlyBudget - thisMonthExpenses).toFixed(2)}`
          : 'Not Set Yet';

        setExpensesData({
          today: todayExpenses,
          yesterday: yesterdayExpenses,
          last7Days: last7DaysExpenses,
          thisMonth: thisMonthExpenses,
          totalExpenses,
          budgetLeft,
        });
      } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
      }
    };

    fetchExpensesData();
  }, [monthlyBudget]);

  useEffect(() => {
    const storedBudget = localStorage.getItem('monthlyBudget');
    if (storedBudget) {
      setMonthlyBudget(Number(storedBudget));
    }
  }, []);

  return (
    <div className="App">
      <div className="expense-grid">
        <ExpenseCard
          title="Today's Expenses"
          amount={expensesData.today === 0 ? "No Expenses Logged Today" : `$${expensesData.today.toFixed(2)}`}
          bgColor="rgb(255, 0, 0)"
          icon={<FaMoneyBill />}
        />
        <ExpenseCard
          title="Yesterday's Expenses"
          amount={expensesData.yesterday === 0 ? "No Expenses Logged Yesterday" : `$${expensesData.yesterday.toFixed(2)}`}
          bgColor="rgb(0, 0, 255)"
          icon={<FaHistory />}
        />
        <ExpenseCard
          title="Last 7 Days' Expenses"
          amount={expensesData.last7Days === 0 ? "No Expenses Logged This Week" : `$${expensesData.last7Days.toFixed(2)}`}
          bgColor="rgb(60, 179, 113)"
          icon={<FaCalendarDay />}
        />
        <ExpenseCard
          title="This Month's Expenses"
          amount={expensesData.thisMonth === 0 ? "No Expenses This Month" : `$${expensesData.thisMonth.toFixed(2)}`}
          bgColor="rgb(238, 130, 238)"
          icon={<FaCalendarAlt />}
        />
        <ExpenseCard
          title="Monthly Budget Left"
          amount={expensesData.budgetLeft}
          bgColor="rgb(255, 165, 0)"
          icon={<FaDollarSign />}
        />
        <ExpenseCard
          title="Total Expenses"
          amount={`$${expensesData.totalExpenses.toFixed(2)}`}
          bgColor="rgb(106, 90, 205)"
          icon={<FaWallet />}
        />
      </div>
    </div>
  );
}

export default Dashboard;
