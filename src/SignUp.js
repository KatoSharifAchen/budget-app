import React, { useState } from 'react';
import { TextField, Button, Container, Typography, IconButton, Icon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // Automatically log in the user and redirect to the dashboard
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else {
                setError(error.message);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/dashboard'); // Automatically log in the user and redirect to the dashboard
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Sign Up</Typography>
            <form onSubmit={handleSignUp}>
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
                <Button type="submit" variant="contained" color="primary">Sign Up</Button>
            </form>
            <Button onClick={handleGoogleSignIn} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                Sign Up with Google
            </Button>
            <Link to="/login" style={{ textDecoration: 'none', marginTop: '10px', display: 'block' }}>
                <IconButton color="primary" aria-label="login">
                    <Icon>login</Icon>
                </IconButton>
                <Typography variant="body2" color="primary">
                    Already have an account? Log In
                </Typography>
            </Link>
        </Container>
    );
};

export default SignUp;
