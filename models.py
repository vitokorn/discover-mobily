from sqlalchemy import Column,Integer,String
from sqlalchemy.types import DateTime
from db import Base
import datetime

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True,index=True)
    spotyid = Column(String, lenght=100)
    country = Column(String, lenght=100)
    display_name = Column(String, lenght=100)
    access_token = Column(String)
    refresh_token = Column(String)
    date_update = Column(DateTime, default=datetime.datetime.utcnow)
