from app import db
import datetime


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True,index=True)
    spotyid = db.Column(db.String)
    country = db.Column(db.String)
    display_name = db.Column(db.String)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)
    date_update = db.Column(db.DateTime, default=datetime.datetime.utcnow)
