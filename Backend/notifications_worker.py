# notification_handler.py

import pika
import json
import smtplib
from email.mime.text import MIMEText
from pymongo import MongoClient
from bson.objectid import ObjectId

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['flight_notifications']
users_collection = db['users']

def send_notification(user_email, flight_id, notification_type):
    # Example: Sending email notification
    msg = MIMEText(f'Your flight {flight_id} has an update.')
    msg['Subject'] = 'Flight Update Notification'
    msg['From'] = 'parveenjaiswal2770@gmail.com'  # Use your Gmail email
    msg['To'] = 'naveenjaiswal6422@gmail.com'

    # Use Gmail's SMTP to send email
    try:
        print(f"Connecting to Gmail SMTP server...")
        # Connect to Gmail's SMTP server
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.ehlo()  # Send EHLO command to SMTP server
            server.starttls()  # Start TLS encryption
            server.ehlo()  # Send EHLO command again
            print(f"Logging in as parveenjaiswal2770@gmail.com...")
            server.login('parveenjaiswal2770@gmail.com', 'lcjj mhed wxia gzhy')  # Use your email and password
            print(f"Sending email to {msg['To']}...")
            server.sendmail(msg['From'], [msg['To']], msg.as_string())
            print(f'Email sent to {msg["To"]}')
    except smtplib.SMTPException as e:
        print(f'Failed to send email: {str(e)}')

def callback(ch, method, properties, body):
    notification = json.loads(body)
    user_email = 'naveenjaiswal6422@gmail.com'
    if user_email:
        send_notification(user_email, notification['flight_id'], notification['type'])
    else:
        print(f'No email found for user {notification["user_id"]}')

def get_user_email(user_id):
    # Fetch the user's email from the database
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    return user['email'] if user else None

# RabbitMQ setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='notifications')

channel.basic_consume(queue='notifications', on_message_callback=callback, auto_ack=True)
print('Waiting for notifications...')
channel.start_consuming()
