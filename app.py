import datetime
import os
import requests
import json

from flask import Flask, render_template, redirect, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.sql import ClauseElement

app = Flask(__name__)
# app._static_url = 'static'
# app._static_folder = 'discover-mobily/static'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aewxjumzmghuqz:7c3fa637c4eb52b837213b1040c3fb39d14d7522e80697a18aa68e4bfcb18df2@ec2-54-195-76-73.eu-west-1.compute.amazonaws.com:5432/de5nclahn5ni2h'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
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

# redirect_uri = 'http://localhost:4444/spotify/callback/'
redirect_uri = 'https://discover-mobily.herokuapp.com/spotify/callback'
client_id = os.environ.get('client_id')
client_secret = os.environ.get('client_secret')
# client_id = 'a9be8e308f094d439c5b58809fd0316f'
# client_secret = 'aadfe9af67e84469aaada1bfd736b9a6'

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

@app.route('/pl/')
def pl():
    if session['nickname']:
        user = User.query.filter_by(spotyid=session['username']).first()
        url = f'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50'
        access_token = user.access_token
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        req = requests.get(url=url,headers=headers)
        if req.status_code == 401:
            print(req.status_code)
            token,r = refresh()
            if r is True:
                headers = {
                    'Authorization': f'Bearer {token}'
                }
                req = requests.get(url=url, headers=headers)
                res = req.json()
                print('req 85' + str(res))
                pl = res['items']
                return render_template('playlists.html', pl=pl)
            else:
                print('Error')
                raise ValueError
        else:
            res = req.json()
            print('req 95' + str(res))
            pl = res['items']
            return render_template('playlists.html',pl=pl)


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
    user,create = get_or_create(db.session,User,spotyid=t['id'],country=t['country'],
                                display_name=t["display_name"],
                                defaults={'access_token':access_token,'refresh_token':refresh_token})
    if user is not None:
        user.access_token = access_token
        user.refresh_token = refresh_token
        db.session.commit()
    session['username'] = t['id']
    session['nickname'] = t["display_name"]
    return redirect('/')


@app.route('/spotify/refresh_token/')
def refresh():
    current_time = datetime.datetime.utcnow()
    print('current_time ' + str(current_time))
    one_day = current_time - datetime.timedelta(hours=1)
    print('one_day ' + str(one_day))

    # Invoice.query.filter(Invoice.invoicedate >= date.today())
    url = 'https://accounts.spotify.com/api/token'
    current = User.query.all()
    print('current ' + str(current))
    for c in current:
        data = {'grant_type': 'refresh_token','refresh_token': c.refresh_token, 'client_id':client_id,
                'client_secret':client_secret}
        req = requests.post(url=url, data=data)
        test = req.json()
        print(str(test))
        c.access_token = test['access_token']
        db.session.commit()
        return test['access_token'], True


# @app.route('/spotify/playlists/', methods = ['GET'])
# def playlists():
#     user = User.query.filter_by(spotyid = session['username']).first()
#     offset = 0
#     url = f'https://api.spotify.com/v1/me/playlists?offset={offset}&limit=50'
#     # url = f'https://api.spotify.com/v1/users/{spotyid}/playlists?offset=0&limit=50' для других пользователей
#     # https://api.spotify.com/v1/audio-features
#     # GET https://api.spotify.com/v1/artists/{id}/top-tracks artist to tracks
#
#
#     access_token = user.access_token
#     headers = {
#             'Authorization': f'Bearer {access_token}'
#         }
#     all = requests.get(url=url,headers=headers)
#     if all.status_code == 401:
#         refresh()
#     resp = all.json()
#     return redirect('/library/')


@app.route('/spotify/playlists/<playlist_id>', methods = ['GET'])
def playlists(playlist_id):
    print(playlist_id)
    user = User.query.filter_by(spotyid = session['username']).first()
    url = f'https://api.spotify.com/v1/playlists/{playlist_id}?fields=name,id,description,images,tracks(items(track(name,preview_url,id,artists,album(artists,id,images))))'
    # url = f'https://api.spotify.com/v1/users/{spotyid}/playlists?offset=0&limit=50' для других пользователей
    # https://api.spotify.com/v1/audio-features
    # GET https://api.spotify.com/v1/artists/{id}/top-tracks artist to tracks
    access_token = user.access_token
    headers = {
            'Authorization': f'Bearer {access_token}'
        }
    all = requests.get(url=url,headers=headers)
    if all.status_code == 401:
        if refresh() is True:
            all = requests.get(url=url, headers=headers)
    resp = all.json()
    return resp

@app.route('/logout/')
def logout():
    session.clear()
    return redirect('/')


@app.route('/remove_account')
def removeacc():
    user = User.query.filter_by(spotyid = session['username']).first()
    db.session.delete(user)
    db.session.commit()
    return redirect('/')



def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).one_or_none()
    if instance:
        return instance, False
    else:
        params = {k: v for k, v in kwargs.items() if not isinstance(v, ClauseElement)}
        params.update(defaults or {})
        instance = model(**params)
        try:
            session.add(instance)
            session.commit()
        except Exception:  # The actual exception depends on the specific database so we catch all exceptions. This is similar to the official documentation: https://docs.sqlalchemy.org/en/latest/orm/session_transaction.html
            session.rollback()
            instance = session.query(model).filter_by(**kwargs).one()
            return instance, False
        else:
            return instance, True


