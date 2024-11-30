import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

const BudgetForm = () => {
    const [budget, setBudget] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "budget"), {
                budget: parseFloat(budget),
                date: new Date()
            });
            setBudget('');
        } catch (err) {
            console.error("Error setting budget: ", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="Monthly Budget" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
                fullWidth 
            />
            <Button type="submit" variant="contained" color="primary">Set Budget</Button>
        </form>
    );
};

export default BudgetForm;
