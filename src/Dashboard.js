import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Paper } from '@mui/material';
import ExpenseList from './ExpenseList';
import ExpensesPieChart from './ExpensesPieChart';
import BudgetStatus from './BudgetStatus';
import { auth } from './firebase';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/login'); // Redirect to login page after sign out
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <BudgetStatus />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <ExpenseList />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <ExpensesPieChart />
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
