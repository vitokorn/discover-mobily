import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from db import SessionLocal

# create a Session
session = SessionLocal()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.secret_key = os.environ.get('secret_key')


if __name__ == '__main__':
    from views import *
    app.run(debug=True)


