import datetime
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate



app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
db = SQLAlchemy(app)
db.create_all()
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True,index=True)
    spotyid = db.Column(db.String)
    country = db.Column(db.String)
    display_name = db.Column(db.String)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)
    date_update = db.Column(db.DateTime, default=datetime.datetime.utcnow)


app.secret_key = os.environ.get('secret_key')


if __name__ == '__main__':
    from views import *
    app.run(debug=True)


