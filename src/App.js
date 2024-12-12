import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import SignUp from './SignUp';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ExpensesPieChart from './ExpensesPieChart';
import BudgetForm from './BudgetForm';
import BudgetStatus from './BudgetStatus';
import Profile from './Profile';
import Dashboard from './Dashboard';
import SpeedDialMenu from './SpeedDialMenu';
import { useAuth, AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { db } from './firebase';
import { collection, query, onSnapshot, addDoc, doc, setDoc } from 'firebase/firestore';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(0);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, `users/${currentUser.uid}/expenses`));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const expensesArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setExpenses(expensesArray);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

    const chartData = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Uncategorized';
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += parseFloat(expense.amount);
        } else {
            acc.push({ name: category, value: parseFloat(expense.amount) });
        }
        return acc;
    }, []);

    const handleExpenseSubmit = async (expense) => {
        if (currentUser) {
            await addDoc(collection(db, `users/${currentUser.uid}/expenses`), expense);
        }
    };

    const handleBudgetSubmit = async (budget) => {
        if (currentUser) {
            setBudgetLimit(budget);
            await setDoc(doc(db, `users/${currentUser.uid}/budgets`, 'currentBudget'), { limit: budget });
        }
    };

    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Header />
                        <Container>
                            <Routes>
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/login" element={<Login />} />
                                <Route element={<PrivateRoute />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/add-expense" element={<ExpenseForm onExpenseSubmit={handleExpenseSubmit} />} />
                                    <Route path="/add-budget" element={<BudgetForm onBudgetSubmit={handleBudgetSubmit} />} />
                                    <Route path="/edit-expense" element={<ExpenseForm onExpenseSubmit={handleExpenseSubmit} />} />
                                    <Route path="/edit-budget" element={<BudgetForm onBudgetSubmit={handleBudgetSubmit} />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/" element={
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <BudgetStatus totalExpenses={totalExpenses} budgetLimit={budgetLimit} />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <ExpenseForm onExpenseSubmit={handleExpenseSubmit} />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <ExpensesPieChart data={chartData} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ExpenseList expenses={expenses} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <BudgetForm onBudgetSubmit={handleBudgetSubmit} />
                                            </Grid>
                                        </Grid>
                                    } />
                                </Route>
                                <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login by default */}
                            </Routes>
                        </Container>
                        {currentUser && <SpeedDialMenu />} {/* Conditionally render SpeedDialMenu */}
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
