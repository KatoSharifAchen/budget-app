import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar, Container, Typography, CircularProgress } from '@mui/material';
import { useAuth } from './AuthContext';
import { db, auth, storage } from './firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName);
                    setImageUrl(userData.profilePicUrl);
                }
                setLoading(false);
            };
            fetchUserData();
        }
    }, [currentUser]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image) {
            const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            setUploading(true);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress function
                },
                (error) => {
                    console.error(error);
                    setUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUrl(downloadURL);
                        setUploading(false);
                        updateProfile(currentUser, {
                            photoURL: downloadURL,
                            displayName: displayName
                        }).then(() => {
                            updateDoc(doc(db, 'users', currentUser.uid), {
                                profilePicUrl: downloadURL
                            });
                            console.log("Profile updated successfully");
                        }).catch((error) => {
                            console.error("Error updating profile:", error);
                        });
                    });
                }
            );
        }
    };

    const handleUpdateProfile = async () => {
        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                displayName: displayName,
                profilePicUrl: imageUrl
            });

            if (password) {
                await auth.currentUser.updatePassword(password);
            }
        }
    };

    const handleNameChange = async () => {
        try {
            await updateProfile(currentUser, { displayName });
            console.log("Name updated successfully");
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Profile</Typography>
            <Avatar src={imageUrl} sx={{ width: 100, height: 100 }} />
            <input type="file" onChange={handleImageChange} style={{ display: 'block', marginTop: 20 }} />
            <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading} style={{ marginTop: 20 }}>
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            {imageUrl && (
                <Typography variant="body1" style={{ marginTop: 20 }}>
                    Profile picture uploaded successfully!
                </Typography>
            )}
            <TextField 
                label="Display Name" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                fullWidth 
                margin="normal" 
                variant="outlined"
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNameChange} 
                style={{ marginTop: 20 }}
            >
                Update Name
            </Button>
            <TextField 
                label="Email" 
                value={email} 
                disabled 
                fullWidth 
                margin="normal" 
                variant="outlined"
            />
            <TextField 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                fullWidth 
                margin="normal" 
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleUpdateProfile} style={{ marginTop: 20 }}>
                Update Profile
            </Button>
        </Container>
    );
};

export default Profile;
