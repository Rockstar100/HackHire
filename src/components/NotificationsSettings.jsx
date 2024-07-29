import React, { useState } from 'react';
import axios from 'axios';
import './NotificationsSettings.css';

const NotificationsSettings = ({ userId }) => {
    const [preferences, setPreferences] = useState({
        sms: false,
        email: false,
        app: false
    });
    console.log(userId)

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setPreferences({
            ...preferences,
            [name]: checked
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://127.0.0.1:5000/api/preferences/${userId}`, preferences)
        .then(response => {
            alert('Preferences updated successfully');
        })
        .catch(error => {
            console.error('Error updating preferences:', error);
        });
    };

    return (
        <div className="notifications-settings">
            <h2>Notification Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="sms"
                            checked={preferences.sms}
                            onChange={handleChange}
                        />
                        SMS Notifications
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="email"
                            checked={preferences.email}
                            onChange={handleChange}
                        />
                        Email Notifications
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="app"
                            checked={preferences.app}
                            onChange={handleChange}
                        />
                        App Notifications
                    </label>
                </div>
                <button type="submit" className="save-button">Save Preferences</button>
            </form>
        </div>
    );
};

export default NotificationsSettings;
