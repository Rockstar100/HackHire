from functools import wraps
from flask import request, jsonify
import random
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask_pymongo import PyMongo

def authenticate_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('User-ID')
        if not user_id:
            return jsonify({'message': 'Unauthorized'}), 401

        mongo = PyMongo(request.app)
        users_collection = mongo.db.users
        user = users_collection.find_one({'_id': ObjectId(user_id)})

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return f(user, *args, **kwargs)

    return decorated_function

def get_mock_flights():
    flight_statuses = ['On Time', 'Delayed', 'Cancelled']
    gates = ['A1', 'B2', 'C3', 'D4', 'E5']
    flights = []

    for i in range(1, 11):
        flights.append({
            'flightNumber': f'FL{i:03}',
            'status': random.choice(flight_statuses),
            'departureTime': (datetime.now() + timedelta(hours=random.randint(1, 10))).isoformat(),
            'arrivalTime': (datetime.now() + timedelta(hours=random.randint(12, 20))).isoformat(),
            'gate': random.choice(gates)
        })

    return flights
