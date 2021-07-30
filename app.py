import os
import datetime
import requests
import json
import urllib3

from flask import Flask, render_template, redirect, request, session, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_babel import Babel,_
from sqlalchemy.sql import ClauseElement
from sett import client_id,client_secret,redirect_uri

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aewxjumzmghuqz:7c3fa637c4eb52b837213b1040c3fb39d14d7522e80697a18aa68e4bfcb18df2@ec2-54-195-76-73.eu-west-1.compute.amazonaws.com:5432/de5nclahn5ni2h'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://discovermobily:5r9VsXSH@localhost:5432/discover-mobily'
app.jinja_env.auto_reload = True
db = SQLAlchemy(app)
migrate = Migrate(app, db)
babel = Babel(app)


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True,index=True)
    spotyid = db.Column(db.String)
    country = db.Column(db.String)
    display_name = db.Column(db.String)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)
    date_update = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    lang = db.Column(db.String)


app.secret_key = b'\xb9\xb8h\\\x1c\xf9s^\xab\x9b\x9dz\xce\xc7\xcea\xc1\x1a\xca\xcc\xb8\xc9\xa0l'


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


@babel.localeselector
def get_locale():
    if session.get('lang') is not None:
        if session['lang'] == 'en':
            return 'en'
        elif session['lang'] == 'ru':
            return 'ru'
    else:
        if session.get('username') is not None:
            current = User.query.filter_by(spotyid=session['username']).first()
            if current.lang is not None:
                return current.lang
        return request.accept_languages.best_match(['en','ru'])

@app.route('/lang/<lang>/')
def lang(lang):
    current = User.query.filter_by(spotyid=session['username']).first()
    if lang == 'en':
        print('87')
        current.lang = 'en'
        db.session.commit()
    elif lang == 'ru':
        current.lang = 'ru'
        db.session.commit()
    return redirect('/')



@app.route('/')
def home():
    if session.get('nickname') is not None:
        user = User.query.filter_by(spotyid=session['username']).first()
        url = f'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50'
        access_token = user.access_token
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        req = requests.get(url=url,headers=headers)
        if req.status_code == 401:
            print(req.status_code)
            token,r = refresh(session['username'])
            if r is True:
                headers = {
                    'Authorization': f'Bearer {token}'
                }
                req = requests.get(url=url, headers=headers)
                res = req.json()
                print('req 85' + str(res))
                pl = res['items']
                return render_template('home.html', pl=pl,user=user)
            else:
                print('Error')
                raise ValueError
        else:
            res = req.json()
            print('req 95' + str(res))
            pl = res['items']
            return render_template('home.html',pl=pl,user=user)
    else:
        return render_template('403.html')


@app.route('/mobile/')
def mobile():
    if session.get('nickname') is not None:
        user = User.query.filter_by(spotyid=session['username']).first()
        session['country'] = user.country
        url = f'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50'
        access_token = user.access_token
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        req = requests.get(url=url,headers=headers)
        if req.status_code == 401:
            print(req.status_code)
            token,r = refresh(session['username'])
            if r is True:
                headers = {
                    'Authorization': f'Bearer {token}'
                }
                req = requests.get(url=url, headers=headers)
                res = req.json()
                print('req 85' + str(res))
                pl = res['items']
                return render_template('mobile.html', pl=pl,user=user)
            else:
                print('Error')
                raise ValueError
        else:
            res = req.json()
            # print('req 95' + str(res))
            pl = res['items']
            return render_template('mobile.html',pl=pl,user=user)
    else:
        return render_template('mobile.html')


@app.route('/spotify/login/')
def authclient():
    url = 'https://accounts.spotify.com/authorize'
    params = {'client_id': client_id, 'client_secret': client_secret, 'redirect_uri': redirect_uri,
              'scope': 'user-library-read user-read-private playlist-read-collaborative playlist-read-private '
                       'playlist-modify-public user-top-read user-follow-read',
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
    print('155' + str(test))
    access_token = test['access_token']
    refresh_token = test['refresh_token']
    url = 'https://api.spotify.com/v1/me'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'scope': 'user-read-private user-read-email'
    }
    http = urllib3.PoolManager()
    re = http.request("GET", url,headers=headers)
    if re.status == 403:
        return render_template('403.html')

    # re = requests.get(url=url, headers=headers)
    # test2 = re.text
    # t = json.loads(test2.decode("utf-8"))
    if re.status == 401:
        return render_template('401.html')
    t = json.loads(re.data)
    print(t)
    user,create = get_or_create(db.session,User,spotyid=t['id'],country=t['country'],
                                display_name=t["display_name"],
                                defaults={'access_token':access_token,'refresh_token':refresh_token})
    if user is not None:
        user.access_token = access_token
        user.refresh_token = refresh_token
        db.session.commit()
    session['username'] = t['id']
    session['nickname'] = t["display_name"]
    session['country'] = t['country']
    return redirect('/')


@app.route('/spotify/refresh_token/<username>')
def refresh(username):
    current_time = datetime.datetime.utcnow()
    print('current_time ' + str(current_time))
    one_day = current_time - datetime.timedelta(hours=1)
    print('one_day ' + str(one_day))

    # Invoice.query.filter(Invoice.invoicedate >= date.today())
    url = 'https://accounts.spotify.com/api/token'
    current = User.query.filter_by(spotyid=username).first()
    print('current ' + str(current))
    data = {'grant_type': 'refresh_token','refresh_token': current.refresh_token, 'client_id':client_id,
                'client_secret':client_secret}
    req = requests.post(url=url, data=data)
    res = req.json()
    print(str(res))
    current.access_token = res['access_token']
    db.session.commit()
    return res['access_token'], True

@app.route('/spotify/refresh_token/')
def refreshall():
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


