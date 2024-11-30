import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot } from "firebase/firestore";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);

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

    return (
        <Paper elevation={3} style={{ padding: '20px' }}>
            <List>
                {expenses.map(expense => (
                    <ListItem key={expense.id}>
                        <ListItemText 
                            primary={`${expense.description} - ${expense.category}`} 
                            secondary={`$${expense.amount}`} 
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ExpenseList;
