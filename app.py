import datetime
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aewxjumzmghuqz:7c3fa637c4eb52b837213b1040c3fb39d14d7522e80697a18aa68e4bfcb18df2@ec2-54-195-76-73.eu-west-1.compute.amazonaws.com:5432/de5nclahn5ni2h'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
db = SQLAlchemy(app)
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


app.secret_key = b'\xb9\xb8h\\\x1c\xf9s^\xab\x9b\x9dz\xce\xc7\xcea\xc1\x1a\xca\xcc\xb8\xc9\xa0l'


if __name__ == '__main__':
    from views import *
    app.run(debug=True,port=4444)


