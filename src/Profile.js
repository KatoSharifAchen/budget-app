import React, { useState } from 'react';
import { TextField, Button, Avatar, Container, Typography } from '@mui/material';
import { storage } from './firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from './firebase';
import { updateProfile } from "firebase/auth";

const Profile = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image) {
            const storageRef = ref(storage, `profile_pictures/${user.uid}`);
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
                        updateProfile(user, {
                            photoURL: downloadURL,
                            displayName: displayName
                        }).then(() => {
                            console.log("Profile updated successfully");
                        }).catch((error) => {
                            console.error("Error updating profile:", error);
                        });
                    });
                }
            );
        }
    };

    const handleNameChange = async () => {
        try {
            await updateProfile(user, { displayName });
            console.log("Name updated successfully");
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Profile</Typography>
            <Avatar src={user?.photoURL} sx={{ width: 100, height: 100 }} />
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
            <input 
                type="file" 
                onChange={handleImageChange} 
                style={{ display: 'block', marginTop: 20 }} 
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpload} 
                disabled={uploading}
                style={{ marginTop: 20 }}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            {imageUrl && (
                <Typography variant="body1" style={{ marginTop: 20 }}>
                    Profile picture uploaded successfully!
                </Typography>
            )}
        </Container>
    );
};

export default Profile;
