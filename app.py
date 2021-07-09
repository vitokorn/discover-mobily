import datetime

import json
import os

import requests
from flask import Flask, request, render_template, redirect, session as fsession

from config import client_id, client_secret
from models import User
from views import get_or_create
from db import SessionLocal

# create a Session
session = SessionLocal()

redirect_uri = 'http://localhost:5000/spotify/callback/'

app = Flask(__name__)

app.secret_key = os.environ.get('secret_key')



if __name__ == '__main__':
    app.run(debug=True)


class Users:
    def __init__(self,
                 spotyid=None,
                 country=None,
                 display_name=None,
                 access_token=None,
                 refresh_token=None):

        self.spotyid = spotyid
        self.country = country
        self.display_name = display_name
        self.access_token = access_token
        self.refresh_token = refresh_token


class ClientCredentials:
    def __init__(self,
                 client_id=None,
                 client_secret=None,
                 grant_type='client_credentials'):
        self.client_id = client_id
        self.client_secret = client_secret
        self.grant_type = grant_type


@app.route('/')
def home():
    return render_template('login.html')



@app.route('/spotify/login/')
def authclient():
    url = 'https://accounts.spotify.com/authorize'
    params = {'client_id': client_id, 'client_secret': client_secret, 'redirect_uri': redirect_uri,
              'scope': 'user-library-read user-read-private playlist-read-collaborative playlist-read-private '
                       'playlist-modify-public ugc-image-upload',
              'response_type': 'code', 'show_dialog': True}
    req = requests.get(url=url, params=params)
    return redirect(req.url)


@app.route('/spotify/callback/')
def kod():
    code = request.args.get('code')
    url = 'https://accounts.spotify.com/api/token'
    data = {'grant_type': 'authorization_code', 'code': code, 'redirect_uri': redirect_uri,'client_id':client_id,
            'client_secret':client_secret}
    req = requests.post(url=url, data=data)
    test = req.json()
    if req.status_code == 401:
        return render_template('401.html')
    access_token = test['access_token']
    refresh_token = test['refresh_token']
    url = 'https://api.spotify.com/v1/me'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'scope': 'user-read-private user-read-email'
    }
    re = requests.get(url=url, headers=headers)
    test2 = re.content
    t = json.loads(test2)
    print(t)
    if re.status_code == 401:
        return render_template('401.html')
    user,create = get_or_create(session,User,spotyid=t['id'],country=t['country'],
                                display_name=t["display_name"],
                                defaults={'access_token':access_token,'refresh_token':refresh_token})
    if user:
        user.access_token = access_token
        user.refresh_token = refresh_token
        session.commit()
    fsession['username'] = t['id']
    fsession['nickname'] = t["display_name"]
    return redirect('/')


@app.route('/spotify/refresh_token/')
def refresh():
    current_time = datetime.datetime.utcnow()
    one_day = current_time - datetime.timedelta(days=1)
    # Invoice.query.filter(Invoice.invoicedate >= date.today())
    url = 'https://accounts.spotify.com/api/token'
    current = User.query.filter(User.date_update >= one_day)
    for c in current:
        data = {'grant_type': 'refresh_token','refresh_token': c.refresh_token, 'client_id':client_id,
                'client_secret':client_secret}
        req = requests.post(url=url, data=data)
        test = req.json()
        c.access_token = test['access_token']
        session.commit()


@app.route('/spotify/playlists/', methods = ['GET'])
def playlists():
    user = User.query.filter_by(spotyid = fsession['username']).first()
    offset = 0
    url = f'https://api.spotify.com/v1/me/playlists?offset={offset}&limit=100'
    # url = f'https://api.spotify.com/v1/users/{spotyid}/playlists?offset=0&limit=50' для других пользователей
    # https://api.spotify.com/v1/audio-features
    # GET https://api.spotify.com/v1/artists/{id}/top-tracks artist to tracks


    access_token = user.access_token
    headers = {
            'Authorization': f'Bearer {access_token}'
        }
    all = requests.get(url=url,headers=headers)
    if all.status_code == 401:
        refresh()
    resp = all.json()
    return redirect('/library/')


@app.route('/logout/')
def logout():
    fsession.clear()
    return redirect('/')


@app.route('/remove_account')
def removeacc():
    user = User.query.filter_by(spotyid = fsession['username']).first()
    session.delete(user)
    session.commit()
    return redirect('/')
