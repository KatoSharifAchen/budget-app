import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

const ExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "expenses"), {
                amount,
                description,
                category,
                date: new Date()
            });
            setAmount('');
            setDescription('');
            setCategory('');
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="Amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                fullWidth 
            />
            <TextField 
                label="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                fullWidth 
                margin="normal" 
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Transport">Transport</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">Add Expense</Button>
        </form>
    );
};

export default ExpenseForm;
