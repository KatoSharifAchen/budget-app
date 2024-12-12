import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ExpensesTable = ({ expenses }) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="expenses table">
                <TableHead>
                    <TableRow>
                        <TableCell>Amount</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>${expense.amount}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ExpensesTable;
