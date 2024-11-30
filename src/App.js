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
import { db } from './firebase';
import { collection, query, onSnapshot } from "firebase/firestore";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(0);
    const { currentUser } = useAuth();

    useEffect(() => {
        const q = query(collection(db, "expenses"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let expensesArray = [];
            querySnapshot.forEach((doc) => {
                expensesArray.push({ ...doc.data(), id: doc.id });
            });
            setExpenses(expensesArray);
        });

        return () => unsubscribe();
    }, []);

    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

    const chartData = expenses.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += parseFloat(expense.amount);
        } else {
            acc.push({ name: category, value: parseFloat(expense.amount) });
        }
        return acc;
    }, []);

    const handleBudgetSubmit = (budget) => {
        setBudgetLimit(budget);
    };

    return (
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
                                <Route path="/add-expense" element={<ExpenseForm />} />
                                <Route path="/add-budget" element={<BudgetForm />} />
                                <Route path="/edit-expense" element={<ExpenseForm />} />
                                <Route path="/edit-budget" element={<BudgetForm />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/" element={
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <BudgetStatus totalExpenses={totalExpenses} budgetLimit={budgetLimit} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <ExpenseForm />
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
    );
};

export default App;
