import React, { useState, useEffect } from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Edit as EditIcon, AttachMoney as AttachMoneyIcon, Dashboard as DashboardIcon, Receipt as ReceiptIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { db } from './firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const actions = [
  { icon: <AddIcon />, name: 'Add Expense', route: '/add-expense' },
  { icon: <AttachMoneyIcon />, name: 'Add Budget', route: '/add-budget' },
  { icon: <EditIcon />, name: 'Edit Expense', route: '/edit-expense' },
  { icon: <EditIcon />, name: 'Edit Budget', route: '/edit-budget' },
  { icon: <DashboardIcon />, name: 'Back to Dashboard', route: '/dashboard' }, // New action to go back to dashboard
];

const SpeedDialMenu = () => {
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleActionClick = (route) => {
    navigate(route);
  };

  const handleOpenDialog = () => {
    setOpen(true);
    if (currentUser) {
      const expensesQuery = query(collection(db, `users/${currentUser.uid}/expenses`));
      const unsubscribe = onSnapshot(expensesQuery, (querySnapshot) => {
        const expensesArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setExpenses(expensesArray);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (currentUser) {
      await deleteDoc(doc(db, `users/${currentUser.uid}/expenses`, id));
    }
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial menu"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleActionClick(action.route)}
          />
        ))}
        <SpeedDialAction
          icon={<ReceiptIcon />}
          tooltipTitle="View Expenses"
          onClick={handleOpenDialog}
        />
      </SpeedDial>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Saved Expenses</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {expenses.map((expense) => (
                <ListItem
                  key={expense.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(expense.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${expense.description} - $${expense.amount}`}
                    secondary={`${expense.category} | ${new Date(expense.date.seconds * 1000).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpeedDialMenu;
