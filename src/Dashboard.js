import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Paper, Typography, CircularProgress, TextField } from '@mui/material';
import ExpensesTable from './ExpensesTable';
import ExpensesPieChart from './ExpensesPieChart';
import { useAuth } from './AuthContext';
import { db, auth } from './firebase';
import { collection, doc, query, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [newBudget, setNewBudget] = useState('');
    const [budgetError, setBudgetError] = useState(null);

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/login'); // Redirect to login page after sign out
    };

    const handleBudgetSave = async () => {
        try {
            if (newBudget && currentUser) {
                const month = new Date().getMonth() + 1; // Get current month (1-12)
                const year = new Date().getFullYear(); // Get current year
                const budgetDocRef = doc(db, `users/${currentUser.uid}/budgets`, `${year}-${month}`);
                await setDoc(budgetDocRef, { limit: parseFloat(newBudget), date: new Date() });
                setBudget(parseFloat(newBudget));
                setNewBudget('');
                setBudgetError(null); // Clear any previous errors
            } else {
                throw new Error("Budget value is empty or user is not authenticated.");
            }
        } catch (err) {
            console.error("Error setting budget: ", err);
            setBudgetError("Error setting budget. Please try again."); // Set the error state
        }
    };

    useEffect(() => {
        if (currentUser) {
            const expensesQuery = query(collection(db, `users/${currentUser.uid}/expenses`));
            const month = new Date().getMonth() + 1; // Get current month (1-12)
            const year = new Date().getFullYear(); // Get current year
            const budgetDocRef = doc(db, `users/${currentUser.uid}/budgets`, `${year}-${month}`);

            const unsubscribeExpenses = onSnapshot(expensesQuery, (querySnapshot) => {
                const expensesArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setExpenses(expensesArray);
                setLoading(false);
            }, (err) => {
                console.error("Error fetching expenses: ", err);
                setError(err.message);
                setLoading(false);
            });

            const fetchBudget = async () => {
                try {
                    const budgetDoc = await getDoc(budgetDocRef);
                    if (budgetDoc.exists()) {
                        setBudget(budgetDoc.data().limit);
                    }
                } catch (err) {
                    console.error("Error fetching budget: ", err);
                    setError(err.message);
                }
                setLoading(false);
            };

            fetchBudget();

            return () => unsubscribeExpenses();
        }
    }, [currentUser]);

    if (loading) {
        return <CircularProgress />;
    }

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

    return (
        <Container>
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Typography variant="h6" gutterBottom>Monthly Budget: ${budget}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>Set Monthly Budget</Typography>
                        <TextField
                            label="Budget"
                            type="number"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            variant="outlined"
                        />
                        <Button variant="contained" color="primary" onClick={handleBudgetSave} style={{ marginLeft: '20px' }}>
                            Save Budget
                        </Button>
                        {budgetError && <Typography color="error" style={{ marginTop: '10px' }}>{budgetError}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>Expenses</Typography>
                        <ExpensesTable expenses={expenses} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <ExpensesPieChart data={chartData} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
