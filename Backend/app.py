# Updated Flask App (app.py)
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from utils import authenticate_user, get_mock_flights
import pika
import json
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/flight_notifications'

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": ["*"],  # Allow specific origins
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allow specific HTTP methods
        "allow_headers": ["Content-Type", "Authorization"]  # Allow specific headers
    }
})
mongo = PyMongo(app)
flights_collection = mongo.db.flights
users_collection = mongo.db.users
notifications_collection = mongo.db.notifications

@app.route('/api/flights', methods=['GET'])
def get_flights():
    flights = flights_collection.find()
    flight_list = [{
        '_id': str(f['_id']),
        'flightNumber': f['flightNumber'],
        'status': f['status'],
        'departureTime': f['departureTime'],
        'arrivalTime': f['arrivalTime'],
        'gate': f['gate'],
        'from': f['from'],
        'to': f['to']
    } for f in flights]
    return jsonify(flight_list)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})

    if user:
        return jsonify({'message': 'User already exists'}), 409

    new_user = {
        'username': data['username'],
        'email': data['email'],
        'password': data['password'],
        'notificationPreferences': []
    }

    result = users_collection.insert_one(new_user)
    return jsonify({'message': 'User created successfully', 'userId': str(result.inserted_id)}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})

    if user and user['password'] == data['password']:
        return jsonify({'message': 'Login successful', 'userId': str(user['_id'])})

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/preferences/<user_id>', methods=['GET'])
def user_preferences(user_id):
    # Convert user_id from string to ObjectId
    user_id = ObjectId(user_id)

    # Retrieve user's preferences
    user = users_collection.find_one({'_id': user_id})

    if user:
        # Ensure preferences is always an array
        return jsonify({'preferences': user.get('notificationPreferences', [])})

    return jsonify({'message': 'User not found'}), 404

@app.route('/api/preferences/<user_id>', methods=['POST'])
def update_preferences(user_id):
    preferences = request.get_json()

    # Convert user_id from string to ObjectId
    user_id = ObjectId(user_id)
    
    # Update user's preferences
    users_collection.update_one({'_id': user_id}, {'$set': {'notificationPreferences': preferences}})

    return jsonify({'message': 'Preferences updated successfully'})

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    user_id = ObjectId(data['userId'])
    flight_id = ObjectId(data['flightId'])

    # Check if the subscription already exists
    existing_subscription = notifications_collection.find_one({
        'userId': user_id,
        'flightId': flight_id
    })

    if existing_subscription:
        return jsonify({'message': 'Already subscribed to this flight'}), 409

    new_notification = {
        'userId': user_id,
        'flightId': flight_id,
        'type': data['type']
    }
    notifications_collection.insert_one(new_notification)

    # Send notification subscription message to RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='notifications')

    notification_message = json.dumps({
        'user_id': str(user_id),
        'flight_id': str(flight_id),
        'type': data['type']
    })
    channel.basic_publish(exchange='', routing_key='notifications', body=notification_message)
    connection.close()

    return jsonify({'message': 'Subscribed successfully'})

@app.route('/api/unsubscribe', methods=['POST'])
def unsubscribe():
    data = request.get_json()
    user_id = ObjectId(data['userId'])
    flight_id = ObjectId(data['flightId'])

    # Remove the subscription
    notifications_collection.delete_one({
        'userId': user_id,
        'flightId': flight_id
    })

    return jsonify({'message': 'Unsubscribed successfully'})

@app.route('/api/subscriptions/<user_id>', methods=['GET'])
def get_subscriptions(user_id):
    user_id = ObjectId(user_id)
    subscriptions = notifications_collection.find({'userId': user_id})
    subscription_list = [str(sub['flightId']) for sub in subscriptions]

    return jsonify({'subscriptions': subscription_list})

if __name__ == '__main__':
    app.run(debug=True)
