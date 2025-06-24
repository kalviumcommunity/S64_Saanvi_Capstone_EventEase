import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Profile.css';
import { useAuth } from '../Context/AuthContext';

// Import icons
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('/default-avatar.png');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: ''
  });

  // Helper to get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    if (user) {
    fetchUserProfile();
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: ''
      });
      setProfileImage('/default-avatar.png');
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, getAuthConfig());
      const userData = response.data;
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zipcode: userData.address?.zipcode || ''
      });
      if (userData.profileImage) {
        const imageUrl = userData.profileImage.startsWith('http') 
          ? userData.profileImage 
          : `${API_URL}${userData.profileImage}`;
        setProfileImage(imageUrl);
      } else {
        setProfileImage('/default-avatar.png');
      }
    } catch (error) {
      setProfileImage('/default-avatar.png');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: ''
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/profile/update`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode
        },
        getAuthConfig()
      );
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      try {
        const formDataImg = new FormData();
        formDataImg.append('profileImage', file);
        const response = await axios.post(
          `${API_URL}/api/profile/upload-image`,
          formDataImg,
          {
            ...getAuthConfig(),
            headers: {
              ...getAuthConfig().headers,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        const imagePath = response.data.profileImage;
        const imageUrl = imagePath.startsWith('http') 
          ? imagePath 
          : `${API_URL}${imagePath}`;
        setProfileImage(imageUrl);
        toast.success('Profile image updated successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to upload profile image');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/profile`, getAuthConfig());
        navigate('/login');
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const sidebarItems = [
    { icon: <EventIcon />, text: 'My Events', onClick: () => navigate('/dashboard') },
    { icon: <PaymentIcon />, text: 'Payment Details', onClick: () => navigate('/payment') },
    { icon: <SettingsIcon />, text: 'Account Settings', onClick: () => navigate('/settings') },
    { icon: <DeleteIcon />, text: 'Delete account', onClick: handleDeleteAccount }
  ];

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile Information</h1>
      <div className="profile-subtitle">
        <span>Manage your personal information</span>
        <button 
          className="edit-profile-btn"
          onClick={isEditing ? handleSaveProfile : handleEditProfile}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
          {!isEditing && !isLoading && <EditIcon />}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            <img src={profileImage} alt="Profile" className="profile-image" />
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {isEditing && (
              <label htmlFor="profile-image-upload" className="upload-overlay">
                Change Photo
              </label>
            )}
          </div>
          <h2 className="username">{formData.firstName} {formData.lastName}</h2>
          <div className="sidebar-items">
            {sidebarItems.map((item, index) => (
              <button key={index} className="sidebar-item" onClick={item.onClick}>
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="profile-details">
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <h3 className="address-title">Address Information</h3>
            
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Zip code</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 