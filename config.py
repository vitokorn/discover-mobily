import os
#POSTGRES https://elements.heroku.com/addons/heroku-postgresql
import psycopg2
# DATABASE_URL = os.environ.get('DATABASE_URL')
from sqlalchemy import create_engine

DATABASE_URL = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
engine = create_engine(DATABASE_URL)
conn = engine.connect()

#ENVIROMENTS VARIABLES
# client_id = os.environ.get("client_id")
# client_secret = os.environ.get("client_secret")


# # REDIS https://elements.heroku.com/addons/heroku-redis
# from urllib.parse import urlparse
# import redis
#
# url = urlparse(os.environ.get("REDIS_URL"))
# r = redis.Redis(host=url.hostname, port=url.port, username=url.username, password=url.password, ssl=True, ssl_cert_reqs=None)


# # RabbitMQ https://elements.heroku.com/addons/cloudamqp
# import pika, os
#
# # Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
# url = os.environ.get('CLOUDAMQP_URL', 'amqp://guest:guest@localhost:5672/%2f')
# params = pika.URLParameters(url)
# connection = pika.BlockingConnection(params)
# channel = connection.channel() # start a channel
# channel.queue_declare(queue='hello') # Declare a queue
# channel.basic_publish(exchange='',
#                       routing_key='hello',
#                       body='Hello CloudAMQP!')
#
# print(" [x] Sent 'Hello World!'")
# connection.close()
#
# # consume.py
# import pika, os
#
# # Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
# url = os.environ.get('CLOUDAMQP_URL', 'amqp://guest:guest@localhost:5672/%2f')
# params = pika.URLParameters(url)
# connection = pika.BlockingConnection(params)
# channel = connection.channel() # start a channel
# channel.queue_declare(queue='hello') # Declare a queue
# def callback(ch, method, properties, body):
#   print(" [x] Received " + str(body))
#
# channel.basic_consume('hello',
#                       callback,
#                       auto_ack=True)
#
# print(' [*] Waiting for messages:')
# channel.start_consuming()
# connection.close()
