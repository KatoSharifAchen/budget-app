import React, { useState } from 'react';
import { TextField, Button, Container, Typography, IconButton, Icon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else if (error.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with the same email address but different sign-in credentials.');
            } else if (error.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                    type="email"
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    fullWidth 
                    margin="normal" 
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary">Login</Button>
            </form>
            <Button onClick={handleGoogleSignIn} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                Login with Google
            </Button>
            <Link to="/signup" style={{ textDecoration: 'none', marginTop: '10px', display: 'block' }}>
                <IconButton color="primary" aria-label="sign up">
                    <Icon>person_add</Icon>
                </IconButton>
                <Typography variant="body2" color="primary">
                    Sign Up
                </Typography>
            </Link>
        </Container>
    );
};

export default Login;
