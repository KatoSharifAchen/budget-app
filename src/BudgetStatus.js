import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot } from "firebase/firestore";
import { Paper, Typography } from '@mui/material';

const BudgetStatus = () => {
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "budget"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let budgetArray = [];
            querySnapshot.forEach((doc) => {
                budgetArray.push({ ...doc.data(), id: doc.id });
            });
            setBudget(budgetArray.length ? budgetArray[0].budget : 0);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "expenses"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let totalExpenses = 0;
            querySnapshot.forEach((doc) => {
                totalExpenses += parseFloat(doc.data().amount);
            });
            setExpenses(totalExpenses);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">
                Budget Status
            </Typography>
            <Typography variant="body1">
                You have spent ${expenses.toFixed(2)} of your ${budget.toFixed(2)} budget
            </Typography>
            {expenses > budget && (
                <Typography variant="body1" color="error">
                    You are over your budget!
                </Typography>
            )}
        </Paper>
    );
};

export default BudgetStatus;
