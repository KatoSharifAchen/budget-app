import React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';

const actions = [
  { icon: <AddIcon />, name: 'Add Expense', route: '/add-expense' },
  { icon: <AttachMoneyIcon />, name: 'Add Budget', route: '/add-budget' },
  { icon: <EditIcon />, name: 'Edit Expense', route: '/edit-expense' },
  { icon: <EditIcon />, name: 'Edit Budget', route: '/edit-budget' },
  { icon: <DashboardIcon />, name: 'Back to Dashboard', route: '/dashboard' }, // New action to go back to dashboard
];

const SpeedDialMenu = () => {
  const navigate = useNavigate();

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
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
    </SpeedDial>
  );
};

export default SpeedDialMenu;
