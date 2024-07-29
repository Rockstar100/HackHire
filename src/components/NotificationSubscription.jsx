// NotificationSubscription.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NotificationSubscription.css'; // Add custom styles for the component

const NotificationSubscription = ({ userId }) => {
    const [flights, setFlights] = useState([]);
    const [subscribedFlights, setSubscribedFlights] = useState([]);

    useEffect(() => {
        // Fetch flight data
        axios.get('http://127.0.0.1:5000/api/flights')
            .then(response => {
                setFlights(response.data);
            })
            .catch(error => {
                console.error('Error fetching flights:', error);
            });

        // Fetch subscribed flights for the user
        if (userId) {
            axios.get(`http://127.0.0.1:5000/api/subscriptions/${userId}`)
                .then(response => {
                    setSubscribedFlights(response.data.subscriptions || []);
                })
                .catch(error => {
                    console.error('Error fetching subscriptions:', error);
                });
        }
    }, [userId]);

    const handleSubscribe = (flightId) => {
        axios.post('http://127.0.0.1:5000/api/subscribe', {
            userId: userId,
            flightId: flightId,
            type: 'flight_update' // Specify the notification type
        })
            .then(response => {
                alert(response.data.message); // Notify user of successful subscription
                setSubscribedFlights([...subscribedFlights, flightId]);
            })
            .catch(error => {
                console.error('Error subscribing to notifications:', error);
            });
    };

    const handleUnsubscribe = (flightId) => {
        axios.post('http://127.0.0.1:5000/api/unsubscribe', {
            userId: userId,
            flightId: flightId
        })
            .then(response => {
                alert(response.data.message); // Notify user of successful unsubscription
                setSubscribedFlights(subscribedFlights.filter(id => id !== flightId));
            })
            .catch(error => {
                console.error('Error unsubscribing from notifications:', error);
            });
    };

    return (
        <div className="notification-subscription">
            <h2>Flight Notification Subscriptions</h2>
            <table className="flights-table">
                <thead>
                    <tr>
                        <th>Flight Number</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Status</th>
                        <th>Subscribe</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(flight => (
                        <tr key={flight._id}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.from.name} ({flight.from.iata})</td>
                            <td>{flight.to.name} ({flight.to.iata})</td>
                            <td>{flight.status}</td>
                            <td>
                                {subscribedFlights.includes(flight._id) ? (
                                    <button 
                                        className="unsubscribe-button"
                                        onClick={() => handleUnsubscribe(flight._id)}
                                    >
                                        Unsubscribe
                                    </button>
                                ) : (
                                    <button 
                                        className="subscribe-button"
                                        onClick={() => handleSubscribe(flight._id)}
                                    >
                                        Subscribe
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NotificationSubscription;
