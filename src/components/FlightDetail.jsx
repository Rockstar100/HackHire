import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FlightDetail.css';

const FlightDetail = ({ match }) => {
    const { flightId } = match.params;
    const [flight, setFlight] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/flights/${flightId}`)
            .then(response => {
                setFlight(response.data);
            })
            .catch(error => {
                console.error('Error fetching flight detail:', error);
            });
    }, [flightId]);

    if (!flight) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flight-detail">
            <h2>Flight {flight.flightNumber}</h2>
            <div className="flight-info">
                <p><strong>Status:</strong> {flight.status}</p>
                <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                <p><strong>Gate:</strong> {flight.gate}</p>
                <p><strong>From:</strong> {flight.from.name} ({flight.from.iata})</p>
                <p><strong>To:</strong> {flight.to.name} ({flight.to.iata})</p>
            </div>
        </div>
    );
};

export default FlightDetail;
