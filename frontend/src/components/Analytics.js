import React from 'react';
import { Progress } from 'antd';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Analytics.css';

const Analytics = ({ allTransection }) => {
    const category = [
        "salary", "tip", "project", "food", "movie", "bills", "medical", "fee", "tax"
    ];

    const totalTransection = allTransection.length;
    const totalIncomeTransection = allTransection.filter(
        (transection) => transection.type === 'income'
    );
    const totalExpenseTransection = allTransection.filter(
        (transection) => transection.type === 'expense'
    );
    const totalIncomePercent = (totalIncomeTransection.length / totalTransection) * 100;
    const totalExpensePercent = (totalExpenseTransection.length / totalTransection) * 100;

    const totalTurnover = allTransection.reduce((acc, transection) => acc + transection.amount, 0);
    const totalIncomeTurnover = totalIncomeTransection.reduce((acc, transection) => acc + transection.amount, 0);
    const totalExpenseTurnover = totalExpenseTransection.reduce((acc, transection) => acc + transection.amount, 0);
    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

    const savings = totalIncomeTurnover - totalExpenseTurnover;

    // Monthly Trend Analysis
    const getMonthlyBreakdown = (type) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = Array(12).fill(0);

        allTransection
            .filter(transection => transection.type === type)
            .forEach(transection => {
                const month = new Date(transection.date).getMonth();
                monthlyData[month] += transection.amount;
            });

        return { labels: months, data: monthlyData };
    };

    const incomeBreakdown = getMonthlyBreakdown('income');
    const expenseBreakdown = getMonthlyBreakdown('expense');

    const incomeExpenseTrendData = {
        labels: incomeBreakdown.labels,
        datasets: [
            {
                label: 'Income',
                data: incomeBreakdown.data,
                borderColor: 'green',
                fill: false,
            },
            {
                label: 'Expense',
                data: expenseBreakdown.data,
                borderColor: 'red',
                fill: false,
            }
        ]
    };

    // Category-wise distribution
    const categoryWiseIncomeData = category.map(cat => {
        return allTransection.filter(tran => tran.type === 'income' && tran.category === cat)
            .reduce((acc, tran) => acc + tran.amount, 0);
    });

    const categoryWiseExpenseData = category.map(cat => {
        return allTransection.filter(tran => tran.type === 'expense' && tran.category === cat)
            .reduce((acc, tran) => acc + tran.amount, 0);
    });

    const categoryDistributionData = {
        labels: category,
        datasets: [
            {
                label: 'Income',
                data: categoryWiseIncomeData,
                backgroundColor: 'green',
            },
            {
                label: 'Expense',
                data: categoryWiseExpenseData,
                backgroundColor: 'red',
            }
        ]
    };

    // Top 3 Categories
    const getTopCategories = (type) => {
        const amounts = category.map(cat => ({
            category: cat,
            amount: allTransection.filter(tran => tran.type === type && tran.category === cat)
                .reduce((acc, tran) => acc + tran.amount, 0)
        }));
        return amounts.sort((a, b) => b.amount - a.amount).slice(0, 3);
    };

    const topIncomeCategories = getTopCategories('income');
    const topExpenseCategories = getTopCategories('expense');

    return (
        <div className='main-content'>
            {/* Total Transactions and Turnover */}
            <div className="cards">
                <div className="card1">
                    <h1>TRANSECTIONS</h1>
                    <div className="card">
                        <div className="catd-header">
                            Total Transactions: {totalTransection}
                        </div>
                        <div className="card-body">
                            <h5 className='text-success'>Income: {totalIncomeTransection.length}</h5>
                            <h5 className='text-danger'>Expense: {totalExpenseTransection.length}</h5>
                        </div>
                        <div className='progress-item'>
                            <Progress type="circle" strokeColor={"green"} className='mx-2' percent={totalIncomePercent.toFixed(0)} />
                            <Progress type="circle" strokeColor={"red"} className='mx-2' percent={totalExpensePercent.toFixed(0)} />
                        </div>
                    </div>
                </div>

                <div className="card2">
                    <h1>TURNOVERS</h1>
                    <div className="card">
                        <div className="catd-header">
                            Total Turnover: {totalTurnover}
                        </div>
                        <div className="card-body">
                            <h5 className='text-success'>Income: {totalIncomeTurnover}</h5>
                            <h5 className='text-danger'>Expense: {totalExpenseTurnover}</h5>
                        </div>
                        <div className='progress-item'>
                            <Progress type="circle" strokeColor={"green"} className='mx-2' percent={totalIncomeTurnoverPercent.toFixed(0)} />
                            <Progress type="circle" strokeColor={"red"} className='mx-2' percent={totalExpenseTurnoverPercent.toFixed(0)} />
                        </div>
                    </div>
                </div>

                <div className="card3">
                    <h1>SAVINGS</h1>
                    <div className="card">
                        <div className="catd-header">
                            Total Savings: {savings}
                        </div>
                        <div className="card-body">
                            <h5>{savings >= 0 ? 'Positive' : 'Negative'} Savings</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Income vs Expense Trend */}
            <div>
            <h1>INCOME VS EXPENSE TRENDS</h1>
            <div className="trend-card">
                
                <div className="trend-section">
                    <h5>Income vs Expense Trend (Monthly)</h5>
                    <Line data={incomeExpenseTrendData} />
                </div>
            </div>
            </div>

            {/* Card for Category-wise Distribution */}
            <div>
            <h1>CATEGORY-WISE DISTRIBUTIONS</h1>
            <div className="category-card">
                
                <div className="category-content">
                    {/* Category-wise Income and Expense Distribution */}
                    <div className="category-income">
                        <h5>Income Distribution</h5>
                        <Pie data={{
                            labels: category,
                            datasets: [{
                                data: categoryWiseIncomeData,
                                backgroundColor: ['green', 'blue', 'purple', 'yellow', 'orange', 'red', 'pink', 'brown', 'grey'],
                            }]
                        }} />
                    </div>

                    <div className="category-expense">
                        <h5>Expense Distribution</h5>
                        <Pie data={{
                            labels: category,
                            datasets: [{
                                data: categoryWiseExpenseData,
                                backgroundColor: ['red', 'blue', 'purple', 'yellow', 'orange', 'green', 'pink', 'brown', 'grey'],
                            }]
                        }} />
                    </div>
                </div>
            </div>
            </div>
            {/* Top 3 Categories */}
            <div className="top-category">
                <div className="top-category-card">
                    <h1>Top 3 Income Categories</h1>
                    <div className="card">
                        <div className="catd-header1">
                            Income
                        </div>
                        <ul>
                            {topIncomeCategories.map(cat => (
                                <li key={cat.category}>{cat.category}: {cat.amount}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="top-category-card">
                    <h1>Top 3 Expense Categories</h1>
                    <div className="card">
                        <div className="catd-header2">
                            Expense
                        </div>
                        <ul>
                            {topExpenseCategories.map(cat => (
                                <li key={cat.category}>{cat.category}: {cat.amount}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;




