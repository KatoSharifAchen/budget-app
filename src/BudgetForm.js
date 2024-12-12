import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const BudgetForm = ({ onBudgetSet }) => {
    const [budget, setBudget] = useState('');
    const { currentUser } = useAuth();
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
            setMessage("Please enter a valid budget amount");
            return;
        }
        try {
            if (currentUser) {
                const budgetRef = doc(db, `users/${currentUser.uid}/budgets`, 'currentBudget');
                await setDoc(budgetRef, {
                    budget: parseFloat(budget),
                    date: new Date()
                });
                setMessage("Budget set successfully!");
                onBudgetSet(parseFloat(budget));
                setBudget('');
            } else {
                setMessage("User is not authenticated");
            }
        } catch (err) {
            console.error("Error setting budget: ", err);
            setMessage("Error setting budget. Please try again.");
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>Set Monthly Budget</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Monthly Budget"
                    variant="outlined"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Set Budget
                </Button>
            </form>
            {message && <Typography color="error" style={{ marginTop: '10px' }}>{message}</Typography>}
        </Paper>
    );
};

export default BudgetForm;
