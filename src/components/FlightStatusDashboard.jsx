import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FlightStatusDashboard.css';

const FlightStatusDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/flights')
            .then(response => {
                setFlights(response.data);
            })
            .catch(error => {
                console.error('Error fetching flights:', error);
            });
    }, []);

    const handleEmail = () => {
        const emailDetails = {
            to: recipientEmail,
            subject: `Flight Details: ${selectedFlight.flightNumber}`,
            body: `
                Flight Number: ${selectedFlight.flightNumber}
                Status: ${selectedFlight.status}
                Departure Time: ${new Date(selectedFlight.departureTime).toLocaleString()}
                Arrival Time: ${new Date(selectedFlight.arrivalTime).toLocaleString()}
                Gate: ${selectedFlight.gate}
                From: ${selectedFlight.from.name} (${selectedFlight.from.iata})
                To: ${selectedFlight.to.name} (${selectedFlight.to.iata})
            `
        };

        axios.post('http://127.0.0.1:5000/api/send-email', emailDetails)
            .then(response => {
                alert('Email sent successfully');
                setIsModalOpen(false);
                setRecipientEmail('');
            })
            .catch(error => {
                console.error('Error sending email:', error);
                alert('Error sending email');
            });
    };

    return (
        <>
            {/* <Home /> */}
            <div className="dashboard">
                <h1>Flight Status Dashboard</h1>
                <table className="flights-table">
                    <thead>
                        <tr>
                            <th>Flight Number</th>
                            <th>Status</th>
                            <th>Departure Time</th>
                            <th>Arrival Time</th>
                            <th>Gate</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map(flight => (
                            <tr key={flight._id}>
                                <td>{flight.flightNumber}</td>
                                <td>{flight.status}</td>
                                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                <td>{flight.gate}</td>
                                <td>{flight.from.name} ({flight.from.iata})</td>
                                <td>{flight.to.name} ({flight.to.iata})</td>
                                <td>
                                    <button className="primary-btn" onClick={() => { setSelectedFlight(flight); setIsModalOpen(true); }}>
                                        Email Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Send Flight Details</h2>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={e => setRecipientEmail(e.target.value)}
                            placeholder="Enter recipient's email"
                        />
                        <button onClick={handleEmail} className="primary-btn">Send Email</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FlightStatusDashboard;
