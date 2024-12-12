import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Header = ({ budget, expenses = [] }) => {
    const { theme, toggleTheme } = useTheme();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [warning, setWarning] = useState('');
    const [tips, setTips] = useState('');

    useEffect(() => {
        const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        const budgetUsed = budget ? Math.round((totalExpenses / budget) * 100) : 0;

        if (budgetUsed >= 75 && budgetUsed < 90) {
            setWarning('Warning: You have used more than 75% of your budget.');
            setTips('Tip: Review your expenses and cut back on non-essentials to stay within budget.');
        } else if (budgetUsed >= 90 && budgetUsed <= 100) {
            setWarning('Warning: You are close to exceeding your budget.');
            setTips('Tip: Consider postponing some expenses until next month.');
        } else if (budgetUsed > 100) {
            setWarning('Alert: You have exceeded your budget!');
            setTips('Tip: Review your budget and adjust it for the next month.');
        } else {
            setWarning('');
            setTips('');
        }
    }, [budget, expenses]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const handleCalendarOpen = () => {
        setCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setCalendarOpen(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const expensesForSelectedDate = expenses.filter(expense => expense.date === formatDate(selectedDate));

    const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    const budgetUsed = budget ? Math.round((totalExpenses / budget) * 100) : 0;
    const remainingBudget = budget ? budget - totalExpenses : 0;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>$VISTA</Typography>
                <Typography variant="h6" style={{ marginRight: 20 }}>Budget: ${remainingBudget} / ${budget}</Typography>
                <IconButton edge="end" color="inherit" onClick={toggleTheme}>
                    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
                <IconButton edge="end" color="inherit" onClick={handleCalendarOpen}>
                    <CalendarTodayIcon />
                </IconButton>
                <IconButton edge="end" color="inherit">
                    <Badge badgeContent={`${budgetUsed}%`} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Dialog open={calendarOpen} onClose={handleCalendarClose}>
                    <div style={{ padding: 20 }}>
                        <Typography variant="h6">Monthly Budget: ${budget}</Typography>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            locale={navigator.language}
                        />
                        <Typography variant="h6">Expenses for {selectedDate.toDateString()}:</Typography>
                        {expensesForSelectedDate.length > 0 ? (
                            <ul>
                                {expensesForSelectedDate.map((expense, index) => (
                                    <li key={index}>{expense.description} - ${expense.amount}</li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body1">No expenses recorded for this day.</Typography>
                        )}
                    </div>
                </Dialog>
                {warning && (
                    <div>
                        <Typography variant="h6" style={{ marginLeft: 20, color: 'red' }}>
                            {warning}
                        </Typography>
                        <Typography variant="body1" style={{ marginLeft: 20 }}>
                            {tips}
                        </Typography>
                    </div>
                )}
                {currentUser && (
                    <div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar src={currentUser.photoURL} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
