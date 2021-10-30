let trlist = document.querySelectorAll("#tracks > div");
for (let i = 0; i < trlist.length; i++) {
    trlist[i].addEventListener("click", function() {
        if (document.getElementById(trlist[i].id)) {
            document.getElementById(trlist[i].id).style.display = 'flex'
            document.getElementById(trlist[i].id.replace('t_', 'p_')).style.display = 'flex'
        } else {
            initElement(id)
        }
        trlist.forEach(function(ns) {
            if (trlist[i] == ns) {
                console.log('test')
            } else {
                console.log('69 ' + ns.id)
                document.getElementById('t_' + ns.id).style.display = 'none'
                document.getElementById(ns.id.replace('t_', 'p_')).style.display = 'none'
                ns.style.display = 'none'
            }
        });
    });
}
let allaudio = document.getElementsByTagName('audio')

function initElement(id) {
    request({
        url: 'https://api.spotify.com/v1/playlists/' + id + '?fields=name,id,external_urls,description,images,tracks(items(track(name,preview_url,external_urls,id,artists,album(album_type,artists,id,images,name))))',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let tracks = document.getElementById('tracks')
        let name = data['name']
        let description = data['description']
        let image = data['images'][0]['url']
        let playtrack = data['tracks']['items']
        console.log('75 ' + playtrack)

        let playlistdiv = document.getElementById('playlist')
        playlistdiv.innerHTML = ''
        tracks.innerHTML = ''
        let plid = document.createElement('div')
        plid.id = 'p_' + id
        plid.className = 'con2'
        // let plid = `<div id="p_${id}" class="con2"></div>`
        playlistdiv.appendChild(plid)

        let html = `<div class="con4">${name}</div><div style="width: 60%;display: flex;align-items: center"><button class="button"><a href="${data['external_urls']['spotify']}" target="_blank">Open in Spotify</a></button>${description}</div><div class="con4" style="background-image: url('${image}');background-size: cover;background-repeat: no-repeat"></div>`
        let refresh = `<button id="refresh_${id}" class="refresh-end" onclick="refr('refresh_${id}')"><img src="../static/images/refresh-icon.svg" height="12" id="icon_${id}" alt="refresh button"></button>`
        html += refresh
        let trid = document.createElement('div')
        trid.id = 't_' + id
        trid.className = 'con2'
        // let trid = `<div id="t_${id}" class="con2"></div>`
        tracks.appendChild(trid)
        let i = 0
        for (const pla of playtrack) {
            let d = document.createElement('div')
            d.setAttribute('data-target', i++)
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['track']['album']['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${list(pla['track']['artists'])} -  ${pla['track']['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (pla['track']['preview_url'])
                a.src = `${pla['track']['preview_url']}`
            else {
                d.style.opacity = '.5'
            }
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                if (document.getElementById('expand' + `${pla['track']['id']}`) != null) {
                    document.getElementById('expand' + `${pla['track']['id']}`).style.display = 'block'
                    let allTracks = document.querySelectorAll('[id^=expand]');
                    if (allTracks != null) {
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + `${pla['track']['id']}`) != null && allTracks[i].id == document.getElementById('expand' + `${pla['track']['id']}`).id) {

                            } else {
                                allTracks[i].style.display = 'none'
                            }
                        }
                    }

                } else {
                    let allTracks = document.querySelectorAll('[id^=expand]');
                    if (allTracks != null) {
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + `${pla['track']['id']}`) != null && allTracks[i].id == document.getElementById('expand' + `${pla['track']['id']}`).id) {

                            } else {
                                allTracks[i].style.display = 'none'
                            }


                        }
                        deeper(pla, d, 'playlist', trid, id)
                    }


                }

                // insertAfterf(tracks[tar])
            })

            trid.appendChild(d)
            window.scrollTo({
                top: findPos(plid),
                behavior: 'smooth'
            });
        }
        plid.insertAdjacentHTML('afterbegin', html)
        let tracksid = document.querySelectorAll("#t_" + id + ">div[class=con3]")
        for (let i = 0; i < tracksid.length; i++) {
            tracksid[i].addEventListener("click", function() {
                console.log('262 ' + tracksid[i].id)
                if (tracksid[i].classList.contains("con3active")) {

                } else {
                    tracksid[i].classList.toggle("con3active");
                }
                tracksid.forEach(function(ns) {
                    // console.log('279 ' + ns)
                    if (tracksid[i].getAttribute("data-target") == ns.getAttribute("data-target")) {} else {
                        // console.log('282 ' + ns.id)
                        ns.classList.remove('con3active')
                    }
                });
            });
        }

    }).catch((status) => {
        if (status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                initElement(id)
            })
        }
    })
}


function list(artists) {
    const names = artists.map(({
        name
    }) => name);
    console.log('195 ' + names)
    const finalName = names.pop();
    return names.length ?
        names.join(', ') + ' & ' + finalName :
        finalName;
}
let plalist = document.querySelectorAll("#playlistlist > div");
for (let i = 0; i < plalist.length; i++) {
    plalist[i].addEventListener("click", function() {
        console.log('262 ' + plalist[i].id)
        if (document.getElementById('t_' + plalist[i].id)) {
            console.log('258')
        } else {
            console.log(plalist[i].id)
            initElement(plalist[i].id)
        }
        if (plalist[i].classList.contains("activetab")) {

        } else {
            plalist[i].classList.toggle("activetab");
        }
        plalist.forEach(function(ns) {
            // console.log('279 ' + ns)
            if (plalist[i].id == ns.id) {
                // console.log('test')
                if (document.getElementById('t_' + ns.id)) {
                    document.getElementById('t_' + ns.id).style.display = 'flex'
                    document.getElementById('p_' + ns.id).style.display = 'flex'
                }
            } else {
                // console.log('282 ' + ns.id)
                ns.classList.remove('activetab')
                if (document.getElementById('t_' + ns.id)) {
                    document.getElementById('t_' + ns.id).style.display = 'none'
                    document.getElementById('p_' + ns.id).style.display = 'none'
                }
            }
        });
    });
}
document.getElementById('topartists').addEventListener('click', function() {
    document.getElementById('artists').style.display = 'flex'
    document.getElementById('artists6').style.display = 'none'
    document.getElementById('artistsall').style.display = 'none'
})
document.getElementById('ta').addEventListener("click", function() {
    console.log('294')
    if (Array.from(ta).find(ta => ta.className === 'activetab') == undefined) {
        if (document.getElementById('artists').hasChildNodes() == true) {
            document.getElementById('artists').style.display = 'flex'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'none'
        } else {
            topartistst()
        }
    } else {
        if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'artists') {
            document.getElementById('artists').style.display = 'flex'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'none'
        } else if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'artists6') {
            document.getElementById('artists').style.display = 'none'
            document.getElementById('artists6').style.display = 'flex'
            document.getElementById('artistsall').style.display = 'none'
        } else if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'toptrackat') {
            document.getElementById('artists').style.display = 'none'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'flex'
        }

    }
})

function topartistst() {
    if (document.getElementById('topartists').classList.contains("activetab")) {

    } else {
        document.getElementById('topartists').classList.toggle("activetab")
    }
    request({
            url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        .then((data) => {
            let artis = document.getElementById('artists')
            let items = data['items']
            for (const it of items) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${it['images'][1]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${it['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                artisttrack(`${it['id']}`, function(e) {
                    if (e != null) {
                        a.src = e
                    } else {
                        d.style.opacity = '.5'
                    }
                    return e
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
                    click2play(e)
                    let allTracks = document.querySelectorAll('#artists' + '>[id^=expand]');
                    console.log('671 ' + allTracks[0])
                    if (document.getElementById('expanda' + it['id']) != null) {
                        document.getElementById('expanda' + it['id']).style.display = 'block'
                        console.log('674')
                        if (allTracks != null) {
                            console.log('676')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {

                                } else {
                                    console.log('681')
                                    allTracks[i].style.display = 'none'
                                }
                            }
                        }

                    } else {
                        console.log('690')
                        if (document.getElementById('expanda' + it['id']) != null) {
                            console.log('692')
                            window.scrollTo({
                                top: findPos(document.getElementById('expanda' + it['id'])),
                                behavior: 'smooth'
                            });
                        }
                        if (allTracks[0] == null) {
                            console.log('697')
                            deep_artist(artis, it)
                        } else if (allTracks != null) {
                            console.log('700')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {
                                    console.log('703')
                                } else {
                                    console.log('705')
                                    allTracks[i].style.display = 'none'
                                }


                            }
                            if (document.getElementById('expanda' + it['id']) == null) {
                                deep_artist(artis, it)
                            }
                        }


                    }

                })
                artis.appendChild(d)
            }
        }).catch((status) => {
            if (status === 401) {
                request({
                    url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then((data) => {
                    topartistst()
                })
            }
        })
}

function topartistst6() {
    request({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let artis = document.getElementById('artists6')
        let items = data['items']
        let elem = []
        for (const it of items) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${it['images'][1]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${it['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            artisttrack(`${it['id']}`, function(e) {
                if (e != null) {
                    a.src = e
                } else {
                    d.style.opacity = '.5'
                }
                return e
            })
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                let allTracks = document.querySelectorAll('#artists' + '>[id^=expand]');
                console.log('671 ' + allTracks[0])
                if (document.getElementById('expanda' + it['id']) != null) {
                    document.getElementById('expanda' + it['id']).style.display = 'block'
                    console.log('674')
                    if (allTracks != null) {
                        console.log('676')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {

                            } else {
                                console.log('681')
                                allTracks[i].style.display = 'none'
                            }
                        }
                    }

                } else {
                    console.log('690')
                    if (document.getElementById('expanda' + it['id']) != null) {
                        console.log('692')
                        window.scrollTo({
                            top: findPos(document.getElementById('expanda' + it['id'])),
                            behavior: 'smooth'
                        });
                    }
                    if (allTracks[0] == null) {
                        console.log('697')
                        deep_artist(artis, it)
                    } else if (allTracks != null) {
                        console.log('700')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {
                                console.log('703')
                            } else {
                                console.log('705')
                                allTracks[i].style.display = 'none'
                            }


                        }
                        if (document.getElementById('expanda' + it['id']) == null) {
                            deep_artist(artis, it)
                        }
                    }


                }

            })
            artis.appendChild(d)
        }

        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'flex'
        document.getElementById('artistsall').style.display = 'none'
    }).catch((status) => {
        if (status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                topartistst6()
            })
        }
    })
}

function topartiststall() {
    request({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let artis = document.getElementById('artistsall')
        let items = data['items']
        for (const it of items) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${it['images'][1]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${it['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            artisttrack(`${it['id']}`, function(e) {
                if (e != null) {
                    a.src = e
                } else {
                    d.style.opacity = '.5'
                }
                return e
            })
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                let allTracks = document.querySelectorAll('#artists' + '>[id^=expand]');
                console.log('671 ' + allTracks[0])
                if (document.getElementById('expanda' + it['id']) != null) {
                    document.getElementById('expanda' + it['id']).style.display = 'block'
                    console.log('674')
                    if (allTracks != null) {
                        console.log('676')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {

                            } else {
                                console.log('681')
                                allTracks[i].style.display = 'none'
                            }
                        }
                    }

                } else {
                    console.log('690')
                    if (document.getElementById('expanda' + it['id']) != null) {
                        console.log('692')
                        window.scrollTo({
                            top: findPos(document.getElementById('expanda' + it['id'])),
                            behavior: 'smooth'
                        });
                    }
                    if (allTracks[0] == null) {
                        console.log('697')
                        deep_artist(artis, it)
                    } else if (allTracks != null) {
                        console.log('700')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {
                                console.log('703')
                            } else {
                                console.log('705')
                                allTracks[i].style.display = 'none'
                            }


                        }
                        if (document.getElementById('expanda' + it['id']) == null) {
                            deep_artist(artis, it)
                        }
                    }


                }
            })
            artis.appendChild(d)
        }
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'none'
        document.getElementById('artistsall').style.display = 'flex'
    }).catch((status) => {

    })

}
document.getElementById('topartists6').addEventListener('click', function() {
    if (document.getElementById('artists6').hasChildNodes() == true) {
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'flex'
        document.getElementById('artistsall').style.display = 'none'
    } else {
        topartistst6()
    }
})
document.getElementById('topartistsall').addEventListener('click', function() {
    if (document.getElementById('artistsall').hasChildNodes() == true) {
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'none'
        document.getElementById('artistsall').style.display = 'flex'
    } else {
        topartiststall()
    }
})
const ta = document.querySelectorAll('[id^=topartists]');

for (let i = 0; i < ta.length; i++) {
    ta[i].addEventListener("click", function() {
        if (ta[i].classList.contains("activetab")) {

        } else {
            ta[i].classList.toggle("activetab");
        }
        ta.forEach(function(ns) {
            if (ta[i] == ns) {
                console.log('test')
            } else {
                ns.classList.remove('activetab')
            }
        });
    });
}

function artisttrack(id, callback) {
    let url = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=' + localStorage.getItem('country')
    console.log('267 ' + url)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let tracks = data['tracks']
            let fnn = (tracks.find(e => e.preview_url))
            if (fnn != null) {
                callback(fnn['preview_url'])
            } else {
                callback(null)
            }

        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            })
        }
    }
}

function savedalbums(id, callback) {
    let url = 'https://api.spotify.com/v1/albums/' + id + '/tracks?market=' + localStorage.getItem('country') + '&limit=10'
    console.log('267 ' + url)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let items = data['items']
            let fnn = (items.find(e => e.preview_url))
            if (fnn != null) {
                callback(`${fnn['preview_url']}`)
            } else {
                callback(null)
            }
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                savedalbums(id, callback)
            })
        }

    }
}

function albumstracks(id, callback) {
    let url = 'https://api.spotify.com/v1/albums/' + id + '/tracks?market=' + localStorage.getItem('country') + '&limit=10'
    console.log('267 ' + url)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let items = data['items']
            callback(items)
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                albumstracks(id, callback)
            })
        }

    }
}

const tt = document.querySelectorAll('[id^=toptracks]');

for (let i = 0; i < tt.length; i++) {
    tt[i].addEventListener("click", function() {
        if (tt[i].classList.contains("activetab")) {} else {
            tt[i].classList.toggle("activetab");
        }
        tt.forEach(function(nst) {
            if (tt[i] == nst) {
                console.log('test')
            } else {
                nst.classList.remove('activetab')
            }
        });
    });
}
document.getElementById('tt').addEventListener("click", function() {
    console.log('544')
    if (Array.from(tt).find(tt => tt.className === 'activetab') == undefined) {
        if (document.getElementById('toptrack').hasChildNodes() == true) {
            document.getElementById('toptrack').style.display = 'flex'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'none'
        } else {
            topttracks()
        }
    } else {
        if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrack') {
            document.getElementById('toptrack').style.display = 'flex'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'none'
        } else if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrack6') {
            document.getElementById('toptrack').style.display = 'none'
            document.getElementById('toptrack6').style.display = 'flex'
            document.getElementById('toptrackat').style.display = 'none'
        } else if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrackat') {
            document.getElementById('toptrack').style.display = 'none'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'flex'
        }

    }
})

function topttracks() {
    if (document.getElementById('toptracks').classList.contains("activetab")) {

    } else {
        document.getElementById('toptracks').classList.toggle("activetab")
    }
    request({
            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then((data) => {
            let tracks = document.getElementById('toptrack')
            tracks.innerHTML = ''
            let playtrack = data['items']
            console.log('325 ' + playtrack)
            for (const pla of playtrack) {
                let d
                if (pla['preview_url']) {
                    d = `<div onclick="click2play(event)" tabindex="0" class="con3" style="background-image: url(${pla['album']['images'][0]['url']});background-repeat: no-repeat;background-size: cover">${list(pla['artists'])} -  ${pla['name']}<audio type="audio/mpeg" preload="none" src="${pla['preview_url']}"></audio></div>`
                } else {
                    d = `<div onclick="click2play(event)" tabindex="0" class="con3" style="background-image: url(${pla['album']['images'][0]['url']});background-repeat: no-repeat;background-size: cover;opacity: .5;">${list(pla['artists'])} -  ${pla['name']}</div>`
                }
                d.addEventListener('click', function(e) {
                    let allTracks = document.querySelectorAll('#toptrack' + '>[id^=expand]');
                    console.log('671 ' + allTracks[0])
                    if (document.getElementById('expand' + pla['id']) != null) {
                        document.getElementById('expand' + pla['id']).style.display = 'block'
                        console.log('674')
                        if (allTracks != null) {
                            console.log('676')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {

                                } else {
                                    console.log('681')
                                    allTracks[i].style.display = 'none'
                                }
                            }
                        }

                    } else {
                        console.log('690')
                        if (document.getElementById('expand' + pla['id']) != null) {
                            console.log('692')
                            window.scrollTo({
                                top: findPos(document.getElementById('expand' + pla['id'])),
                                behavior: 'smooth'
                            });
                        }
                        if (allTracks[0] == null) {
                            console.log('697')
                            deeper(pla, tracks, 'tt')
                        } else if (allTracks != null) {
                            console.log('700')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {
                                    console.log('703')
                                } else {
                                    console.log('705')
                                    allTracks[i].style.display = 'none'
                                }
                            }
                            if (document.getElementById('expand' + pla['id']) == null) {
                                deeper(pla, tracks, 'tt')
                            }
                        }


                    }
                })
                tracks.insertAdjacentHTML('afterbegin', d)
            }
            document.getElementById('toptrack').style.display = 'flex'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'none'
        })
        .catch((status) => {
            if (status === 401) {
                request({
                    url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then((data) => {
                    topttracks()
                })
            }
        })
}
document.getElementById('toptracks').addEventListener('click', function() {
    if (document.getElementById('toptrack').hasChildNodes() == true) {
        document.getElementById('toptrack').style.display = 'flex'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'none'
    } else {
        topttracks()
    }

})
document.getElementById('toptrackssix').addEventListener('click', function() {
    if (document.getElementById('toptrack6').hasChildNodes() == true) {
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrack6').style.display = 'flex'
        document.getElementById('toptrackat').style.display = 'none'
    } else {
        topttracks6()
    }
})

function topttracks6() {
    request({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let tracks = document.getElementById('toptrack6')
        tracks.innerHTML = ''
        let playtrack = data['items']
        console.log('372 ' + playtrack)
        let elem = []
        for (const pla of playtrack) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['album']['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${list(pla['artists'])} -  ${pla['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (pla['preview_url'])
                a.src = `${pla['preview_url']}`
            else {
                d.style.opacity = '.5'
            }
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                let allTracks = document.querySelectorAll('#toptrack' + '>[id^=expand]');
                console.log('671 ' + allTracks[0])
                if (document.getElementById('expand' + pla['id']) != null) {
                    document.getElementById('expand' + pla['id']).style.display = 'block'
                    console.log('674')
                    if (allTracks != null) {
                        console.log('676')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {

                            } else {
                                console.log('681')
                                allTracks[i].style.display = 'none'
                            }
                        }
                    }

                } else {
                    console.log('690')
                    if (document.getElementById('expand' + pla['id']) != null) {
                        console.log('692')
                        window.scrollTo({
                            top: findPos(document.getElementById('expand' + pla['id'])),
                            behavior: 'smooth'
                        });
                    }
                    if (allTracks[0] == null) {
                        console.log('697')
                        deeper(pla, tracks, 'tt')
                    } else if (allTracks != null) {
                        console.log('700')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {
                                console.log('703')
                            } else {
                                console.log('705')
                                allTracks[i].style.display = 'none'
                            }


                        }
                        if (document.getElementById('expand' + pla['id']) == null) {
                            deeper(pla, tracks, 'tt')
                        }
                    }


                }
            })
            tracks.appendChild(d)
        }
        document.getElementById('toptrack6').style.display = 'flex'
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'none'
    }).catch((status) => {

    })
}

function topttracksall() {
    request({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let tracks = document.getElementById('toptrackat')
        tracks.innerHTML = ''
        let playtrack = data['items']
        console.log('403' + playtrack)
        let elem = []
        for (const pla of playtrack) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['album']['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${list(pla['artists'])} -  ${pla['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (pla['preview_url'])
                a.src = `${pla['preview_url']}`
            else {
                d.style.opacity = '.5'
            }
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                let allTracks = document.querySelectorAll('#toptrack' + '>[id^=expand]');
                console.log('671 ' + allTracks[0])
                if (document.getElementById('expand' + pla['id']) != null) {
                    document.getElementById('expand' + pla['id']).style.display = 'block'
                    console.log('674')
                    if (allTracks != null) {
                        console.log('676')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {

                            } else {
                                console.log('681')
                                allTracks[i].style.display = 'none'
                            }
                        }
                    }

                } else {
                    console.log('690')
                    if (document.getElementById('expand' + pla['id']) != null) {
                        console.log('692')
                        window.scrollTo({
                            top: findPos(document.getElementById('expand' + pla['id'])),
                            behavior: 'smooth'
                        });
                    }
                    if (allTracks[0] == null) {
                        console.log('697')
                        deeper(pla, tracks, 'tt')
                    } else if (allTracks != null) {
                        console.log('700')
                        for (let i = 0; i < allTracks.length; i++) {
                            if (document.getElementById('expand' + pla['id']) != null && allTracks[i].id == document.getElementById('expand' + pla['id']).id) {
                                console.log('703')
                            } else {
                                console.log('705')
                                allTracks[i].style.display = 'none'
                            }


                        }
                        if (document.getElementById('expand' + pla['id']) == null) {
                            deeper(pla, tracks, 'tt')
                        }
                    }


                }
            })
            tracks.appendChild(d)
        }
        document.getElementById('toptrackat').style.display = 'flex'
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrack6').style.display = 'none'
    }).catch((status) => {

    })
}
document.getElementById('toptracksall').addEventListener('click', function() {
    if (document.getElementById('toptrackat').hasChildNodes() == true) {
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'flex'
    } else {
        topttracksall()
    }
})
document.getElementById('sva').addEventListener("click", function() {
    if (document.getElementById('savedalbum').hasChildNodes() == true) {
        document.getElementById('savedalbum').style.display = 'flex'
    } else {
        saved_albums()
    }
})

function saved_albums() {
    request({
        url: 'https://api.spotify.com/v1/me/albums',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let albums = document.getElementById('savedalbum')
        albums.innerHTML = ''
        let savedalbum = data['items']
        console.log('435 ' + savedalbum)
        for (const sa of savedalbum) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${sa['album']['images'][1]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${list(sa['album']['artists'])} -  ${sa['album']['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            savedalbums(sa['album']['id'], function(e) {
                if (e != null) {
                    a.src = e
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                albumstracks(sa['album']['id'], function(e) {
                    let con = document.createElement('div')
                    con.style.display = 'block'
                    con.innerText = 'Tracks'
                    con.className = 'trackList'
                    let cover = document.createElement('div')
                    cover.className = 'con3'
                    cover.style.backgroundImage = `url(${sa['album']['images'][1]['url']})`
                    cover.style.backgroundRepeat = 'no-repeat'
                    cover.style.backgroundSize = 'cover'
                    let coveraudio = document.createElement('audio')
                    cover.addEventListener('click', function(e) {
                        click2play(e)
                    })
                    let cr = document.createElement('div')
                    cr.style.display = 'block'
                    cr.style.marginLeft = '10px'
                    cr.style.marginRight = '10px'
                    let albname = document.createElement('div')
                    albname.innerText = `${sa['album']['name']}`
                    let arbrelase = document.createElement('div')
                    arbrelase.innerText = `${sa['album']['release_date']}`
                    let albart = document.createElement('div')
                    albart.innerText = `Album by ${list(sa['album']['artists'])}`
                    let grid = document.createElement('div')
                    grid.className = 'con2'
                    for (let el of e) {
                        if (e != null) {
                            let td = document.createElement('div')
                            td.className = 'img-xs'
                            td.style.backgroundImage = `url(${sa['album']['images'][1]['url']})`
                            td.style.backgroundRepeat = 'no-repeat'
                            td.style.backgroundSize = 'cover'
                            let tt = document.createElement('div')
                            tt.innerText = `${el['name']}`
                            tt.className = 'trackTitle'
                            let ta = document.createElement('audio')
                            ta.type = "audio/mpeg"
                            ta.preload = 'none'
                            if (el.preview_url) {
                                ta.src = el.preview_url
                                coveraudio.src = el.preview_url
                            } else {
                                td.style.opacity = '.5'
                            }
                            td.addEventListener('click', function(e) {
                                deeperalbumtracks(el, grid, sa)
                                if (grid.nextElementSibling) {
                                    grid.nextElementSibling.remove()
                                }
                                click2play(e)
                            })
                            td.appendChild(tt)
                            td.appendChild(ta)
                            cover.appendChild(coveraudio)
                            grid.appendChild(cover)
                            cr.appendChild(albname)
                            cr.appendChild(arbrelase)
                            cr.appendChild(albart)
                            grid.appendChild(cr)
                            con.appendChild(td)
                            grid.appendChild(con)
                            if (albums.nextElementSibling) {
                                albums.nextElementSibling.remove()
                            }
                            albums.after(albums, grid)

                        }
                    }


                })
            })
            albums.appendChild(d)
        }
    }).catch((status) => {

    })
}
document.getElementById('svt').addEventListener("click", function() {
    if (document.getElementById('savedtrack').hasChildNodes() == true) {
        document.getElementById('savedtrack').style.display = 'flex'
    } else {
        savedtracks()
    }
})

function savedtracks() {
    document.getElementById('savedtrack').innerHTML = ''
    sendRequest(0)
}

function sendRequest(offset) {
    request({
            url: 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
        .then((response) => {
            let items = response['items']
            for (const pla of items) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${pla['track']['album']['images'][1]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${list(pla['track']['artists'])} -  ${pla['track']['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                if (pla['track']['preview_url'])
                    a.src = `${pla['track']['preview_url']}`
                else {
                    d.style.opacity = '.5'
                }
                d.appendChild(a)
                d.addEventListener('click', function(e) {
                    click2play(e)
                    deeper(pla, document.getElementById('savedtrack'), 'playlist')
                })
                document.getElementById('savedtrack').appendChild(d)
            }
            if (items.length > 0) {
                sendRequest(offset + 50)
            }

        })
}
document.getElementById('followedartists').addEventListener('click', function() {
    if (document.getElementById('followedartist').hasChildNodes() === true) {
        document.getElementById('followedartist').style.display = 'flex'
    } else {
        getfollowedartist()
    }
})

function getfollowedartist() {
    request({
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
            let artis = document.getElementById('followedartist')
            let dv = document.createElement('div')
            dv.className = 'con2'
            let items = data['artists']['items']
            for (const it of items) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${it['images'][1]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${it['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                followedartist(`${it['id']}`, function(e) {
                    if (e != null) {
                        a.src = e
                    } else {
                        d.style.opacity = '.5'
                    }
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
                    click2play(e)
                    let allTracks = document.querySelectorAll('#followedartist' + '>[id^=expand]');
                    console.log('671 ' + allTracks[0])
                    if (document.getElementById('expanda' + it['id']) != null) {
                        document.getElementById('expanda' + it['id']).style.display = 'block'
                        console.log('674')
                        if (allTracks != null) {
                            console.log('676')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {

                                } else {
                                    console.log('681')
                                    allTracks[i].style.display = 'none'
                                }
                            }
                        }

                    } else {
                        console.log('690')
                        if (document.getElementById('expanda' + it['id']) != null) {
                            console.log('692')
                            window.scrollTo({
                                top: findPos(document.getElementById('expanda' + it['id'])),
                                behavior: 'smooth'
                            });
                        }
                        if (allTracks[0] == null) {
                            console.log('697')
                            deep_artist(artis, it)
                        } else if (allTracks != null) {
                            console.log('700')
                            for (let i = 0; i < allTracks.length; i++) {
                                if (document.getElementById('expanda' + it['id']) != null && allTracks[i].id == document.getElementById('expanda' + it['id']).id) {
                                    console.log('703')
                                } else {
                                    console.log('705')
                                    allTracks[i].style.display = 'none'
                                }


                            }
                            if (document.getElementById('expanda' + it['id']) == null) {
                                deep_artist(artis, it)
                            }
                        }


                    }

                })
                dv.appendChild(d)
                artis.appendChild(dv)

            }
            console.log('243 ' + data)

        }

    )
}

function followedartist(id, callback) {
    let url = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=' + localStorage.getItem('country')
    console.log('712 ' + url)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let tracks = data['tracks']
            let fnn = (tracks.find(e => e.preview_url))
            if (fnn != null) {
                callback(`${fnn['preview_url']}`)
            } else {
                callback(null)
            }
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                followedartist(id, callback)
            })
        }
    }
}
document.getElementById('newreleases').addEventListener('click', function() {
    if (document.getElementById('newrelease').hasChildNodes() === true) {
        document.getElementById('newrelease').style.display = 'flex'
    } else {
        document.getElementById('newrelease').innerHTML = ''
        getnewrelease(0)
    }
})

function getnewrelease(offset) {
    request({
        url: 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset,
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async(data) => {
        let items = data['albums']['items']
        let elem = []
        for await (const it of items) {
            elem.push(`${it['id']}`)
            // elem.push(`<div class="con3" tabindex="0" id=nr_${it['id']} onclick="playtrackat('${it['id']}','nr')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="nra_${it['id']}">${newrelease(it['id'])}</audio></div>`)
        }
        newrelease(elem, offset)
        console.log('766 ' + elem)
    }).catch((status) => {

    })
}

function newrelease(elem, offset) {
    let nr = document.getElementById('newrelease')
    request({
        url: 'https://api.spotify.com/v1/albums?ids=' + elem,
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (data) => {
        let items = data['albums']
        for await (const it of items) {
            let tracks = it['tracks']['items']
            let fnn = (tracks.find(e => e.preview_url))
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${it['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (fnn && fnn['preview_url']) {
                a.src = `${fnn['preview_url']}`
                d.innerText = `${list(fnn['artists'])} -  ${fnn['name']}`
            } else {
                d.style.opacity = '.5'
                d.innerText = `${list(it['artists'])} -  ${it['name']}`
            }
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
            })
            nr.appendChild(d)
        }
        if (items.length > 0) {
            getnewrelease(offset + 20)
        } else if (offset === 100) {

        }
    }).catch((status) => {
        if (status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                newrelease(elem, offset)
            })
        }
    })
}

function refr(id) {
    let refreshIcon = document.getElementById(id.replace('refresh_', 'icon_'))
    let refreshButton = document.getElementById(id)
    refreshIcon.setAttribute("class", "refresh-start")
    refreshButton.removeAttribute("class")
    refreshButton.disabled = true
    let type = id.replace('refresh_', '')
    setTimeout(function() {
        refreshIcon.addEventListener('animationiteration', function() {
            if (type == 'topartist') {
                topartistst()
            } else if (type == 'topartists6') {
                topartistst6()
            } else if (type == 'topartistsall') {
                topartiststall()
            } else if (type == 'toptracks') {
                topttracks()
            } else if (type == 'toptrackssix') {
                topttracks6()
            } else if (type == 'toptracksall') {
                topttracksall()
            } else if (type == 'savedalbum') {
                saved_albums()
            } else if (type == 'savetrack') {
                savedtracks()
            } else if (type == 'followedartist') {
                getfollowedartist()
            } else if (type == 'newrelease') {
                getnewrelease(0)
            } else {
                initElement(id.replace('refresh_', ''))
            }
            refreshButton.setAttribute("class", "refresh-end")
            refreshButton.disabled = false
        })
    }, 100)
}
let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

document.getElementById('srch').addEventListener('input', delay(function(e) {
    if (document.getElementById('srch').value) {
        let value = document.getElementById('srch').value

        request({
            url: 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then((data) => {
            let songs = document.getElementById('s1')
            let arti = document.getElementById('ar1')
            let albu = document.getElementById('al1')
            let play = document.getElementById('p1')
            let albums = data['albums']['items']
            let artists = data['artists']['items']
            let playlists = data['playlists']['items']
            let tracks = data['tracks']['items']
            songs.innerHTML = ''
            arti.innerHTML = ''
            albu.innerHTML = ''
            play.innerHTML = ''
            console.log(albums)
            console.log(artists)
            console.log(playlists)
            console.log(tracks)
            for (const alb of albums) {
                let main = document.createElement('div')
                main.className = 'playable-search'
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${alb['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                let d1 = document.createElement('div')
                d1.className = 'title'
                let d2 = document.createElement('div')
                d2.textContent = `${alb['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                albumtracks(`${(alb['href'])}`, function(items) {
                    let fnn = (items.find(e => e.preview_url))
                    if (fnn != null) {
                        a.src = fnn.preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                })
                d.appendChild(a)
                main.addEventListener('click', function(e) {
                    click2play(e)
                })
                main.appendChild(d)
                d1.appendChild(d2)
                main.appendChild(d1)
                albu.appendChild(main)
            }
            for (const art of artists) {
                let main = document.createElement('div')
                main.className = 'playable-search'
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                if ((art['images']).length != 0) {
                    d.style.backgroundImage = `url(${art['images'][0]['url']})`
                } else {
                    d.style.backgroundColor = 'grey'
                }
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.style.borderRadius = '50%'
                let d1 = document.createElement('div')
                d1.className = 'title'
                let d2 = document.createElement('div')
                d2.textContent = `${art['name']}`

                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                artisttracks(`${(art['href'])}`, function(e) {
                    if (e != null) {
                        a.src = e
                    } else {
                        d.style.opacity = '.5'
                    }
                })
                d.appendChild(a)
                main.addEventListener('click', function(e) {
                    click2play(e)
                })
                main.appendChild(d)
                d1.appendChild(d2)
                main.appendChild(d1)
                arti.appendChild(main)
            }
            for (const pls of playlists) {
                let main = document.createElement('div')
                main.className = 'playable-search'
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${pls['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                let d1 = document.createElement('div')
                d1.className = 'title'
                let d2 = document.createElement('div')
                d2.textContent = `${pls['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                pltracks(`${(pls['tracks']['href'])}`, function(e) {
                    if (e != null) {
                        a.src = e
                    } else {
                        d.style.opacity = '.5'
                    }
                })
                d.appendChild(a)
                main.addEventListener('click', function(e) {
                    click2play(e)
                })
                main.appendChild(d)
                d1.appendChild(d2)
                main.appendChild(d1)
                play.appendChild(main)
            }
            for (const pla of tracks) {
                let main = document.createElement('div')
                main.className = 'playable-search'
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${pla['album']['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                let d1 = document.createElement('div')
                d1.className = 'title'
                let d2 = document.createElement('div')
                d2.textContent = `${list(pla['artists'])} -  ${pla['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                if (pla['preview_url'])
                    a.src = `${pla['preview_url']}`
                else {
                    d.style.opacity = '.5'
                }
                d.appendChild(a)
                main.addEventListener('click', function(e) {
                    click2play(e)
                })
                main.appendChild(d)
                d1.appendChild(d2)
                main.appendChild(d1)
                songs.appendChild(main)
            }
        }).catch((status) => {
            if (status === 401) {
                request({
                    url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                })
            }
        })
    }
}, 1000));

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            callback.apply(context, args);
        }, ms || 0);
    }
}

function pltracks(href, callback) {
    let url = href
    console.log('994' + url)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let playtrack = data['items']
            if (playtrack[0]['track']["preview_url"]) {
                callback(playtrack[0]['track']["preview_url"])
            } else {
                callback(null)
            }
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                pltracks(href, callback)
            })
        }
    }

}

function albumtracks(href, callback) {
    let url = href + '/tracks'
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            let items = data['items']
            callback(items)
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                albumtracks(href, callback)
            })
        }
    }

}

function artisttracks(href, callback) {
    let url = href + '/top-tracks?market=' + localStorage.getItem('country')
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    xhr.send()
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(this.response)
            console.log('1061' + data)
            let items = data['tracks']
            let fnn = (items.find(e => e.preview_url))
            if (fnn != null) {
                callback(`${fnn['preview_url']}`)
            } else {
                callback(null)
            }
        } else if (xhr.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                artisttracks(href, callback)
            })
        }
    }

}

function deeper(pla, tracks, type, trid, id) {
    let block = document.createElement('div')
    block.className = 'expanded'
    block.style.display = 'block'
    block.style.width = '100%'
    if (type == 'playlist') {
        let info = document.createElement('div')
        info.style.width = '100%'
        block.id = 'expand' + pla['track']['id']
        info.style.display = 'flex'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
        info.className = 'rectrack'
        let playable = document.createElement('div')
        playable.className = 'con3'
        playable.style.backgroundImage = `url(${pla['track']['album']['images'][0]['url']})`
        playable.style.backgroundRepeat = 'no-repeat'
        playable.style.backgroundSize = 'cover'
        // playable.innerText = `${list(pla['track']['artists'])} -  ${pla['track']['name']}`
        let playaudio = document.createElement('audio')
        if (pla['track']['preview_url'])
            playaudio.src = `${pla['track']['preview_url']}`
        else {
            playable.style.opacity = '.5'
        }
        playable.addEventListener('click', function(e) {
            click2play(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.style.width = '50%'
        trackinfo.style.marginLeft = '10px'
        trackinfo.innerText = `${pla['track']['name']}`
        let tracktype = document.createElement('div')
        tracktype.style.color = 'white'
        tracktype.style.display = 'flex'
        tracktype.innerText = 'From the ' + `${pla['track']['album']['album_type']}`
        let alb = document.createElement('div')
        alb.innerText = `${pla['track']['album']['name']}`
        alb.addEventListener('click', function() {
            let href = 'https://api.spotify.com/v1/albums/' + pla['track']['album']['id']
            albumtracks(href, function(items) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                // d.style.backgroundImage = `url(${pla['track']['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                // d.innerText = `${list(albus['artists'])} -  ${albus['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                let fnn = (items.find(e => e.preview_url))
                if (fnn != null) {
                    a.src = fnn.preview_url
                } else {
                    d.style.opacity = '.5'
                }
                // d.addEventListener('click', function() {
                //   deeperalbum(sing, ab, fnn,items)
                // })
            })
            // deeperalbum(pla['track']['album'],)
        })
        tracktype.appendChild(alb)

        let trackartist = document.createElement('div')
        let by = document.createElement('p')
        by.innerText = 'By '
        trackartist.appendChild(by)
        trackartist.style.display = 'flex'
        trackartist.style.alignItems = 'center'
        let dv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = pla['track']['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dv.appendChild(openinspotify)
        // let arrr = []
        let pta = pla['track']['artists']
        for (const ar of pla['track']['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            console.log('1610 ' + last)
            if (first['name'] == last['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function() {
                    hideel(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '

                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.marginLeft = '4px'
                    artst.style.cursor = 'pointer'
                    artst.addEventListener('click', function() {
                        hideel(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.style.cursor = 'pointer'
                    artst.addEventListener('click', function() {
                        hideel(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }

        function hideel(ar, pla) {
            let ex = document.querySelectorAll('#expand' + pla['track']['id'] + '>[id^=expanda]');
            if (document.getElementById('expanda' + `${ar['id']}`) == null) {
                if (ex[0] == null) {
                    deep_artist(block, ar, info)
                } else {
                    for (let i = 0; i < ex.length; i++) {
                        console.log('1740 ' + ex[i].id)
                        ex[i].style.display = 'none'
                        deep_artist(block, ar, info)
                    }
                }



            } else {
                if (ex != null) {
                    console.log('1779')
                    for (let i = 0; i < ex.length; i++) {
                        if (document.getElementById('expanda' + `${ar['id']}`) != null && ex[i].id == document.getElementById('expanda' + `${ar['id']}`).id) {
                            document.getElementById('expanda' + `${ar['id']}`).style.display = 'grid'
                        } else {
                            ex[i].style.display = 'none'
                        }


                    }

                }
            }
        }
        // trackartist.innerText = 'By ' + `${list2(arrr)}`
        let recomend = document.createElement('span')
        recomend.innerText = 'Recommended songs'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', function() {
            if (document.getElementById('rec_' + pla['track']['id'])) {
                document.getElementById('rec_' + pla['track']['id']).style.display = 'flex'
            } else {
                request({
                    url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['track']['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then((data) => {
                    let rstracks = data['tracks']
                    let rc = document.createElement('div')
                    rc.className = 'con2'
                    rc.id = 'rec_' + pla['track']['id']
                    let i = 0
                    for (const rst of rstracks) {
                        let rd = document.createElement('div')
                        rd.tabIndex = 0
                        rd.setAttribute('data-target', i++)
                        rd.className = 'con3'
                        rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                        rd.style.backgroundRepeat = 'no-repeat'
                        rd.style.backgroundSize = 'cover'
                        rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                        let ra = document.createElement('audio')
                        ra.type = "audio/mpeg"
                        ra.preload = 'none'
                        if (rst['preview_url'])
                            ra.src = `${rst['preview_url']}`
                        else {
                            rd.style.opacity = '.5'
                        }
                        rd.appendChild(ra)
                        rd.addEventListener('click', function(e) {
                            let tracksid = document.querySelectorAll("#rec_" + pla['track']['id'] + ">div[class=con3]")
                            for (let i = 0; i < tracksid.length; i++) {
                                tracksid[i].addEventListener("click", function() {
                                    console.log('1636 ' + tracksid[i].id)
                                    if (tracksid[i].classList.contains("con3active")) {

                                    } else {
                                        tracksid[i].classList.toggle("con3active");
                                    }
                                    tracksid.forEach(function(ns) {
                                        // console.log('279 ' + ns)
                                        if (tracksid[i].getAttribute("data-target") == ns.getAttribute("data-target")) {
                                            if (!tracksid[i].classList.contains("con3active")) {
                                                tracksid[i].classList.toggle = 'con3active'
                                            }
                                        } else {
                                            // console.log('282 ' + ns.id)
                                            ns.classList.remove('con3active')
                                        }
                                    });
                                });
                            }
                            click2play(e)
                        })
                        rd.appendChild(ra)
                        rc.appendChild(rd)
                        block.after(block, rc)
                        // tracks.appendChild(rc)
                    }
                }).catch((status) => {

                })
            }
        })
        // let artistcirle = document.createElement('div')
        // for (const ar of pla['track']['artists']) {
        //   let artst = document.createElement('div')
        //   artst.innerText = ar['name']
        //   artst.style.cursor = 'pointer'
        //   artst.addEventListener('click', function() {
        //     deep_artist(tracks, ar,info)
        //   })
        //   // if (pla['track']['artists'][0]['name'] == ar['name']){
        //   //     artst.click()
        //   // }
        //
        //   artistcirle.appendChild(artst)
        // }
        playable.appendChild(playaudio)
        info.appendChild(playable)
        info.appendChild(trackinfo)
        // info.appendChild(artistcirle)
        trackinfo.appendChild(tracktype)
        trackinfo.appendChild(trackartist)
        trackinfo.appendChild(recomend)
        trackinfo.appendChild(dv)
        block.insertAdjacentHTML('afterbegin',info.outerHTML)
        console.log(2001)
        console.log(block.outerHTML)

        let containerWidth = trid.offsetWidth;
        let itemWidth = document.querySelectorAll(`#t_${id} > div`)[0].offsetWidth;
        let itemsPerRow = Math.floor(containerWidth / itemWidth);
        // console.log('itemsPerRow ' + itemsPerRow)
        //
        let allFlexItems = document.querySelectorAll(`#t_${id} > div`);

        console.log('data-target ' + tracks.getAttribute('data-target'))
        let tar = tracks.getAttribute('data-target')
        console.log('tar ' + tar)
        // let elNumber = parseInt(tar)
        // let elNumber = itemsData.indexOf(tar)
        // console.log('indexOf ' + itemsData.indexOf(tar))
        // console.log('elNumber ' + elNumber)
        let rowNumber = Math.floor(tar / itemsPerRow);
        console.log('rowNumber ' + rowNumber)
        let insertAfter = itemsPerRow * rowNumber + itemsPerRow - 1;
        console.log('insertAfter ' + insertAfter)
        // let current = allFlexItems[tar]
        console.log('136 ' + allFlexItems[tar])
        console.log('allFlexItems[insertAfter]' + allFlexItems[insertAfter])
        if (allFlexItems[insertAfter] === undefined) {
            console.log('1678')
            let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
            t.after(t, block)
        } else if (allFlexItems[insertAfter] !== undefined) {
            let t = document.querySelector('div[data-target="' + insertAfter + '"]')
            if (t == null) {
                let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
                t.after(t, block)
                window.scrollTo({
                    top: findPos(t),
                    behavior: 'smooth'
                });
            } else {
                t.after(t, block)
                window.scrollTo({
                    top: findPos(t),
                    behavior: 'smooth'
                });
            }

        }

        window.addEventListener('resize', function(event) {
            let containerWidth = trid.offsetWidth;
            let itemWidth = document.querySelectorAll(`#t_${id} > div`)[0].offsetWidth;
            let itemsPerRow = Math.floor(containerWidth / itemWidth);
            // console.log('itemsPerRow ' + itemsPerRow)
            //
            let allFlexItems = document.querySelectorAll(`#t_${id} > div`);

            console.log('data-target ' + tracks.getAttribute('data-target'))
            let tar = tracks.getAttribute('data-target')
            console.log('tar ' + tar)
            // let elNumber = parseInt(tar)
            // let elNumber = itemsData.indexOf(tar)
            // console.log('indexOf ' + itemsData.indexOf(tar))
            // console.log('elNumber ' + elNumber)
            let rowNumber = Math.floor(tar / itemsPerRow);
            console.log('rowNumber ' + rowNumber)
            let insertAfter = itemsPerRow * rowNumber + itemsPerRow - 1;
            console.log('insertAfter ' + insertAfter)
            // let current = allFlexItems[tar]
            console.log('136 ' + allFlexItems[tar])
            console.log('allFlexItems[insertAfter]' + allFlexItems[insertAfter])
            if (allFlexItems[insertAfter] === undefined) {
                console.log('1678')
                let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
                t.after(t, block)
            } else if (allFlexItems[insertAfter] !== undefined) {
                let t = document.querySelector('div[data-target="' + insertAfter + '"]')
                if (t == null) {
                    let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
                    t.after(t, block)
                    window.scrollTo({
                        top: findPos(t),
                        behavior: 'smooth'
                    });
                } else {
                    t.after(t, block)
                    window.scrollTo({
                        top: findPos(t),
                        behavior: 'smooth'
                    });
                }

            }

        })
        // info.scrollIntoView()
    } else if (type == 'tt') {
        block.id = 'expand' + pla['id']
        let info = document.createElement('div')
        info.style.display = 'flex'
        info.style.width = '100%'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
        info.className = 'rectrack'
        let playable = document.createElement('div')
        playable.className = 'con3'
        playable.style.backgroundImage = `url(${pla['album']['images'][0]['url']})`
        playable.style.backgroundRepeat = 'no-repeat'
        playable.style.backgroundSize = 'cover'
        playable.innerText = `${list(pla['artists'])} -  ${pla['name']}`
        let playaudio = document.createElement('audio')
        if (pla['preview_url'])
            playaudio.src = `${pla['preview_url']}`
        else {
            playable.style.opacity = '.5'
        }
        playable.addEventListener('click', function(e) {
            click2play(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.style.width = '50%'
        trackinfo.style.marginLeft = '10px'
        trackinfo.innerText = `${pla['name']}`
        let tracktype = document.createElement('div')
        tracktype.innerText = 'From the ' + `${pla['album']['album_type']}` + ' ' + `${pla['album']['name']}`
        let trackartist = document.createElement('div')
        let by = document.createElement('div')
        by.innerText = 'By '
        trackartist.appendChild(by)
        trackartist.style.display = 'flex'
        trackartist.style.alignItems = 'center'
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        let pta = pla['artists']
        for (const ar of pla['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            console.log('1610 ' + last)
            if (first['name'] == last['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function() {
                    hideel2(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel2(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel2(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel2(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel2(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel2(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }
        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = pla['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dvv.appendChild(openinspotify)
        let recomend = document.createElement('span')
        recomend.innerText = 'Recommended songs'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', function() {
            if (document.getElementById('rec_' + pla['id'])) {
                document.getElementById('rec_' + pla['id']).style.display = 'flex'
            } else {
                request({
                    url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then((data) => {
                    let rstracks = data['tracks']
                    let rc = document.createElement('div')
                    rc.className = 'con2'
                    rc.id = 'rec_' + pla['id']
                    for (const rst of rstracks) {
                        let rd = document.createElement('div')
                        rd.tabIndex = 0
                        rd.className = 'con3'
                        rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                        rd.style.backgroundRepeat = 'no-repeat'
                        rd.style.backgroundSize = 'cover'
                        rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                        let ra = document.createElement('audio')
                        ra.type = "audio/mpeg"
                        ra.preload = 'none'
                        if (rst['preview_url'])
                            ra.src = `${rst['preview_url']}`
                        else {
                            rd.style.opacity = '.5'
                        }
                        rd.appendChild(ra)
                        rd.addEventListener('click', function(e) {
                            click2play(e)

                        })
                        rd.appendChild(ra)
                        rc.appendChild(rd)
                        tracks.appendChild(rc)
                    }
                }).catch((status) => {

                })
            }
        })

        function hideel2(ar, pla) {
            let ex = document.querySelectorAll('#expand' + pla['id'] + '>[id^=expanda]');
            console.log('2131 ' + '#expand' + pla['id'] + '>[id^=expanda]')
            if (document.getElementById('expanda' + `${ar['id']}`) == null) {
                if (ex[0] == null) {
                    deep_artist(block, ar, info)
                } else {
                    for (let i = 0; i < ex.length; i++) {
                        console.log('1740 ' + ex[i].id)
                        ex[i].style.display = 'none'
                        deep_artist(block, ar, info)
                    }
                }



            } else {
                if (document.getElementById('expanda' + `${ar['id']}`) != null) {
                    window.scrollTo({
                        top: findPos(document.getElementById('expanda' + ar['id'])),
                        behavior: 'smooth'
                    });
                }
                if (ex != null) {
                    for (let i = 0; i < ex.length; i++) {
                        console.log('2145' + ex[i].id)

                        if (document.getElementById('expanda' + `${ar['id']}`) != null && ex[i].id == document.getElementById('expanda' + `${ar['id']}`).id) {
                            console.log('2148')
                            document.getElementById('expanda' + `${ar['id']}`).style.display = 'grid'
                            window.scrollTo({
                                top: findPos(document.getElementById('expanda' + `${ar['id']}`)),
                                behavior: 'smooth'
                            });
                        } else {
                            ex[i].style.display = 'none'
                        }


                    }

                }
            }
        }
        playable.appendChild(playaudio)
        info.appendChild(playable)
        info.appendChild(trackinfo)
        trackinfo.appendChild(tracktype)
        trackinfo.appendChild(trackartist)
        trackinfo.appendChild(recomend)
        trackinfo.appendChild(dvv)
        block.appendChild(info)
        tracks.appendChild(block)
        window.scrollTo({
            top: findPos(block),
            behavior: 'smooth'
        });
    } else if (type == 'nr') {
        block.id = 'expand' + pla['id']
        let info = document.createElement('div')
        info.style.display = 'flex'
        info.style.width = '100%'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
        info.className = 'rectrack'
        let playable = document.createElement('div')
        playable.className = 'con3'
        playable.style.backgroundImage = `url(${pla['images'][0]['url']})`
        playable.style.backgroundRepeat = 'no-repeat'
        playable.style.backgroundSize = 'cover'
        playable.innerText = `${list(pla['artists'])} -  ${pla['name']}`
        let playaudio = document.createElement('audio')
        if (pla['preview_url'])
            playaudio.src = `${pla['preview_url']}`
        else {
            playable.style.opacity = '.5'
        }
        playable.addEventListener('click', function(e) {
            click2play(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.style.width = '50%'
        trackinfo.style.marginLeft = '10px'
        trackinfo.innerText = `${pla['name']}`
        let tracktype = document.createElement('div')
        tracktype.innerText = 'From the ' + `${pla['album_type']}` + ' ' + `${pla['name']}`
        let trackartist = document.createElement('div')
        let by = document.createElement('div')
        by.innerText = 'By '
        trackartist.appendChild(by)
        trackartist.style.display = 'flex'
        trackartist.style.alignItems = 'center'
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        let pta = pla['artists']
        for (const ar of pla['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            console.log('1610 ' + last)
            if (first['name'] == last['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function() {
                    hideel3(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel3(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel3(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel3(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel3(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel3(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }

        function hideel3(ar, pla) {
            let ex = document.querySelectorAll('#expand' + pla['id'] + '>[id^=expanda]');
            if (document.getElementById('expanda' + `${ar['id']}`) == null) {
                if (ex[0] == null) {
                    deep_artist(block, ar, info)
                } else {
                    for (let i = 0; i < ex.length; i++) {
                        console.log('1740 ' + ex[i].id)
                        ex[i].style.display = 'none'
                        deep_artist(block, ar, info)
                    }
                }



            } else {
                if (ex != null) {
                    console.log('3461')
                    for (let i = 0; i < ex.length; i++) {
                        if (document.getElementById('expanda' + `${ar['id']}`) != null && ex[i].id == document.getElementById('expanda' + `${ar['id']}`).id) {
                            document.getElementById('expanda' + `${ar['id']}`).style.display = 'grid'
                        } else {
                            ex[i].style.display = 'none'
                        }


                    }

                }
            }
        }
        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = pla['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dvv.appendChild(openinspotify)
        let recomend = document.createElement('span')
        recomend.innerText = 'Recommended songs'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', function() {
            if (document.getElementById('rec_' + pla['id'])) {
                document.getElementById('rec_' + pla['id']).style.display = 'flex'
            } else {
                request({
                    url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then((data) => {
                    let rstracks = data['tracks']
                    let rc = document.createElement('div')
                    rc.className = 'con2'
                    rc.id = 'rec_' + pla['id']
                    for (const rst of rstracks) {
                        let rd = document.createElement('div')
                        rd.tabIndex = 0
                        rd.className = 'con3'
                        rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                        rd.style.backgroundRepeat = 'no-repeat'
                        rd.style.backgroundSize = 'cover'
                        rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                        let ra = document.createElement('audio')
                        ra.type = "audio/mpeg"
                        ra.preload = 'none'
                        if (rst['preview_url'])
                            ra.src = `${rst['preview_url']}`
                        else {
                            rd.style.opacity = '.5'
                        }
                        rd.appendChild(ra)
                        rd.addEventListener('click', function(e) {
                            click2play(e)

                        })
                        rd.appendChild(ra)
                        rc.appendChild(rd)
                        tracks.appendChild(rc)
                    }
                }).catch((status) => {

                })
            }
        })
        let artistcirle = document.createElement('div')
        for (const ar of pla['artists']) {
            let artst = document.createElement('div')
            artst.innerText = ar['name']
            artst.addEventListener('click', function() {
                deep_artist(tracks, ar)
            })
            artistcirle.appendChild(artst)
        }
        playable.appendChild(playaudio)
        info.appendChild(playable)
        info.appendChild(trackinfo)
        info.appendChild(artistcirle)
        trackinfo.appendChild(tracktype)
        trackinfo.appendChild(trackartist)
        trackinfo.appendChild(recomend)
        trackinfo.appendChild(dvv)
        block.appendChild(info)
        tracks.appendChild(block)
        window.scrollTo({
            top: findPos(info),
            behavior: 'smooth'
        });
    }
}

function deeperalbumtracks(pla, tracks, images) {
    let block = document.createElement('div')
    block.className = 'expanded'
    block.style.display = 'block'
    block.style.width = '100%'
    block.id = 'expand' + pla['id']
    let info = document.createElement('div')
    info.style.display = 'flex'
    info.className = 'recalbum'
    info.style.width = '100%'
    info.style.marginTop = '12px'
    info.style.marginBottom = '6px'
    let playable = document.createElement('div')
    playable.className = 'con3'
    if (images['album']) {
        playable.style.backgroundImage = `url(${images['album']['images'][0]['url']})`
    } else {
        playable.style.backgroundImage = `url(${images['images'][0]['url']})`
    }
    playable.style.backgroundRepeat = 'no-repeat'
    playable.style.backgroundSize = 'cover'
    playable.innerText = `${list(pla['artists'])} -  ${pla['name']}`
    let playaudio = document.createElement('audio')
    if (pla['preview_url'])
        playaudio.src = `${pla['preview_url']}`
    else {
        playable.style.opacity = '.5'
    }
    playable.addEventListener('click', function(e) {
        click2play(e)
    })
    let trackinfo = document.createElement('div')
    trackinfo.style.width = '50%'
    trackinfo.style.marginLeft = '4px'
    trackinfo.style.marginRight = '4px'
    trackinfo.innerText = `${pla['name']}`
    let tracktype = document.createElement('div')
    if (images['album']) {
        tracktype.innerText = 'From the ' + `${images['album']['album_type']}` + ' ' + `${images['album']['name']}`
    } else {
        tracktype.innerText = 'From the ' + `${images['album_type']}` + ' ' + `${images['name']}`

    }
    let trackartist = document.createElement('div')
    let by = document.createElement('div')
    by.innerText = 'By '
    trackartist.appendChild(by)
    trackartist.style.display = 'flex'
    trackartist.style.alignItems = 'center'
    let dvv = document.createElement('div')
    let openinspotify = document.createElement('a')
    openinspotify.href = pla['external_urls']['spotify']
    openinspotify.target = '_blank'
    let btn = document.createElement('button')
    btn.className = 'button'
    btn.innerText = 'Open is Spotify'
    openinspotify.appendChild(btn)
    dvv.appendChild(openinspotify)

    if (pla['album']) {
        // trackartist.innerText = 'By ' + `${list(pla['album']['artists'])}`
        let pta = pla['album']['artists']
        for (const ar of pla['album']['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            if (first['name'] == last['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.addEventListener('click', function() {
                    hideel4(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }
    } else {
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        let pta = pla['artists']
        for (const ar of pla['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            console.log('1610 ' + last)
            if (first['name'] == last['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function() {
                    hideel4(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('div')
                    amper.innerText = ' & '
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('div')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel4(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }
    }

    function hideel4(ar, pla) {
        let ex = document.querySelectorAll('#expand' + pla['id'] + '>[id^=expanda]');
        console.log('2131 ' + '#expand' + pla['id'] + '>[id^=expanda]')
        if (document.getElementById('expanda' + `${ar['id']}`) == null) {
            if (ex[0] == null) {
                deep_artist(block, ar, info)
            } else {
                for (let i = 0; i < ex.length; i++) {
                    console.log('1740 ' + ex[i].id)
                    ex[i].style.display = 'none'
                    deep_artist(block, ar, info)
                }
            }



        } else {
            if (document.getElementById('expanda' + `${ar['id']}`) != null) {
                window.scrollTo({
                    top: findPos(document.getElementById('expanda' + ar['id'])),
                    behavior: 'smooth'
                });
            }
            if (ex != null) {
                for (let i = 0; i < ex.length; i++) {
                    console.log('2145' + ex[i].id)

                    if (document.getElementById('expanda' + `${ar['id']}`) != null && ex[i].id == document.getElementById('expanda' + `${ar['id']}`).id) {
                        console.log('2148')
                        document.getElementById('expanda' + `${ar['id']}`).style.display = 'grid'
                        window.scrollTo({
                            top: findPos(document.getElementById('expanda' + `${ar['id']}`)),
                            behavior: 'smooth'
                        });
                    } else {
                        ex[i].style.display = 'none'
                    }


                }

            }
        }
    }
    let recomend = document.createElement('span')
    recomend.innerText = 'Recommended songs based on this'
    recomend.style.color = '#f037a5'
    recomend.addEventListener('click', function() {
        if (document.getElementById('rec_' + pla['id'])) {
            document.getElementById('rec_' + pla['id']).style.display = 'flex'
        } else {
            request({
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                let rstracks = data['tracks']
                let rc = document.createElement('div')
                rc.className = 'con2'
                rc.id = 'rec_' + pla['id']
                for (const rst of rstracks) {
                    let rd = document.createElement('div')
                    rd.tabIndex = 0
                    rd.className = 'con3'
                    rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                    rd.style.backgroundRepeat = 'no-repeat'
                    rd.style.backgroundSize = 'cover'
                    rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                    let ra = document.createElement('audio')
                    ra.type = "audio/mpeg"
                    ra.preload = 'none'
                    if (rst['preview_url'])
                        ra.src = `${rst['preview_url']}`
                    else {
                        rd.style.opacity = '.5'
                    }
                    rd.appendChild(ra)
                    rd.addEventListener('click', function(e) {
                        click2play(e)
                    })
                    rd.appendChild(ra)
                    rc.appendChild(rd)
                    tracks.appendChild(rc)

                }
            }).catch((status) => {

            })
        }
    })
    if (info.nextElementSibling) {
        info.nextElementSibling.remove()
    }
    playable.appendChild(playaudio)
    info.appendChild(playable)
    info.appendChild(trackinfo)
    trackinfo.appendChild(tracktype)
    trackinfo.appendChild(trackartist)
    trackinfo.appendChild(recomend)
    trackinfo.appendChild(dvv)
    block.appendChild(info)
    tracks.after(tracks, block)
    window.scrollTo({
        top: findPos(block),
        behavior: 'smooth'
    });
}

function deeperalbum(pla, tracks, el, e) {
    let block = document.createElement('div')
    block.className = 'expanded'
    block.style.display = 'block'
    block.style.width = '100%'
    block.id = 'expand' + pla['id']
    let info = document.createElement('div')
    info.style.display = 'flex'
    info.style.width = '100%'
    info.style.marginTop = '12px'
    info.style.marginBottom = '6px'
    let playable = document.createElement('div')
    playable.className = 'con3'
    if (pla['album']) {
        playable.style.backgroundImage = `url(${pla['album']['images'][0]['url']})`
    } else {
        playable.style.backgroundImage = `url(${pla['images'][0]['url']})`
    }
    playable.style.backgroundRepeat = 'no-repeat'
    playable.style.backgroundSize = 'cover'
    if (pla['album']) {
        playable.innerText = `${list(pla['album']['artists'])}`
    } else {
        playable.innerText = `${list(pla['artists'])}`
    }
    let playaudio = document.createElement('audio')
    if (el['preview_url'])
        playaudio.src = `${el['preview_url']}`
    else {
        playable.style.opacity = '.5'
    }
    playable.addEventListener('click', function(e) {
        click2play(e)
    })
    let trackinfo = document.createElement('div')
    // trackinfo.style.width = '50%'
    trackinfo.style.marginLeft = '10px'
    trackinfo.style.marginRight = '10px'
    if (pla['album']) {
        trackinfo.innerText = `${pla['album']['name']}`
    } else {
        trackinfo.innerText = `${pla['name']}`
    }
    let trackrelease = document.createElement('div')
    if (pla['album']) {
        trackrelease.innerText = `${pla['album']['release_date']}`
    } else {
        trackrelease.innerText = `${pla['release_date']}`
    }

    let con = document.createElement('div')
    con.style.display = 'block'
    con.innerText = 'Tracks'
    con.className = 'trackList'

    let trackartist = document.createElement('div')
    let by = document.createElement('div')
    by.innerText = 'By '
    trackartist.appendChild(by)
    trackartist.style.display = 'flex'
    trackartist.style.alignItems = 'center'
    if (pla['album']) {
        // trackartist.innerText = 'By ' + `${list(pla['album']['artists'])}`
        let pta = pla['album']['artists']
        for (const ar of pla['album']['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            if (first['name'] == last['name']) {
                let artst = document.createElement('p')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.addEventListener('click', function() {
                    hideel5(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('p')
                    amper.innerText = ' & '
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('p')
                    amper.innerText = ' & '
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }
    } else {
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        let pta = pla['artists']
        for (const ar of pla['artists']) {
            let last = pta[pta.length - 1]
            let first = pta[0]
            let second = pta[1]
            let prelast = pta[pta.length - 2]
            console.log('1610 ' + last)
            if (first['name'] == last['name']) {
                let artst = document.createElement('p')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function() {
                    hideel5(ar, pla)
                })
                trackartist.appendChild(artst)
            } else if (second['name'] == last['name']) {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('p')
                    amper.innerText = ' & '
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '4px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            } else {
                if (ar['name'] == last['name']) {
                    let amper = document.createElement('p')
                    amper.innerText = ' & '
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        deep_artist(tracks, ar)
                    })
                    trackartist.appendChild(amper)
                    trackartist.appendChild(artst)
                } else if (ar['name'] == prelast['name']) {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name']
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.style.marginRight = '4px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                } else {
                    let artst = document.createElement('p')
                    artst.innerText = ar['name'] + ', '
                    artst.style.cursor = 'pointer'
                    artst.style.marginLeft = '3px'
                    artst.addEventListener('click', function() {
                        hideel5(ar, pla)
                    })
                    trackartist.appendChild(artst)
                }
            }
        }
    }

    function hideel5(ar, pla) {
        let ex = document.querySelectorAll('#expand' + pla['id'] + '>[id^=expanda]');
        console.log('2131 ' + '#expand' + pla['id'] + '>[id^=expanda]')
        if (document.getElementById('expanda' + `${ar['id']}`) == null) {
            if (ex[0] == null) {
                deep_artist(block, ar, info)
            } else {
                for (let i = 0; i < ex.length; i++) {
                    console.log('1740 ' + ex[i].id)
                    ex[i].style.display = 'none'
                    deep_artist(block, ar, info)
                }
            }



        } else {
            if (document.getElementById('expanda' + `${ar['id']}`) != null) {
                window.scrollTo({
                    top: findPos(document.getElementById('expanda' + ar['id'])),
                    behavior: 'smooth'
                });
            }
            if (ex != null) {
                for (let i = 0; i < ex.length; i++) {
                    console.log('2145' + ex[i].id)

                    if (document.getElementById('expanda' + `${ar['id']}`) != null && ex[i].id == document.getElementById('expanda' + `${ar['id']}`).id) {
                        console.log('2148')
                        document.getElementById('expanda' + `${ar['id']}`).style.display = 'grid'
                        window.scrollTo({
                            top: findPos(document.getElementById('expanda' + `${ar['id']}`)),
                            behavior: 'smooth'
                        });
                    } else {
                        ex[i].style.display = 'none'
                    }


                }

            }
        }
    }
    let grid = document.createElement('p')
    for (let l of e) {
        if (e != null) {
            let td = document.createElement('p')
            td.className = 'img-xs'
            if (pla['album']) {
                td.style.backgroundImage = `url(${pla['album']['images'][1]['url']})`
            } else {
                td.style.backgroundImage = `url(${pla['images'][1]['url']})`
            }
            td.style.backgroundRepeat = 'no-repeat'
            td.style.backgroundSize = 'cover'
            let tt = document.createElement('div')
            tt.innerText = `${l['name']}`
            tt.className = 'trackTitle'
            let ta = document.createElement('audio')
            ta.type = "audio/mpeg"
            ta.preload = 'none'
            if (l.preview_url) {
                ta.src = l.preview_url
            } else {
                td.style.opacity = '.5'
            }
            td.addEventListener('click', function(e) {
                click2play(e)
                if (info.nextElementSibling) {
                    info.nextElementSibling.remove()
                }
                deeperalbumtracks(l, info, pla)

            })
            td.appendChild(tt)
            td.appendChild(ta)
            con.appendChild(td)
            grid.appendChild(con)


        }
    }

    let recomend = document.createElement('span')
    recomend.innerText = 'Recommended songs'
    recomend.style.color = '#f037a5'
    recomend.addEventListener('click', function() {
        if (document.getElementById('rec_' + pla['id'])) {
            document.getElementById('rec_' + pla['id']).style.display = 'flex'
        } else {
            request({
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                let rstracks = data['tracks']
                let rc = document.createElement('div')
                rc.className = 'con2'
                rc.id = 'rec_' + pla['id']
                for (const rst of rstracks) {
                    let rd = document.createElement('div')
                    rd.tabIndex = 0
                    rd.className = 'con3'
                    rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                    rd.style.backgroundRepeat = 'no-repeat'
                    rd.style.backgroundSize = 'cover'
                    rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                    let ra = document.createElement('audio')
                    ra.type = "audio/mpeg"
                    ra.preload = 'none'
                    if (rst['preview_url'])
                        ra.src = `${rst['preview_url']}`
                    else {
                        rd.style.opacity = '.5'
                    }
                    rd.appendChild(ra)
                    rd.addEventListener('click', function(e) {
                        click2play(e)
                    })
                    rd.appendChild(ra)
                    rc.appendChild(rd)
                    tracks.appendChild(rc)
                }
            }).catch((status) => {

            })
        }
    })


    playable.appendChild(playaudio)
    info.appendChild(playable)
    info.appendChild(trackinfo)
    info.appendChild(grid)
    trackinfo.appendChild(trackrelease)
    trackinfo.appendChild(trackartist)
    trackinfo.appendChild(recomend)
    block.appendChild(info)
    tracks.after(tracks, block)
}

async function deep_artist(tracks, ar) {
    let block = document.createElement('div')
    block.className = 'expanded'
    block.style.display = 'block'
    block.style.width = '100%'
    block.id = 'expanda' + ar['id']
    const ab = document.createElement('div')
    let artinfo = document.createElement('div')
    artinfo.style.gridColumn = '3 / 8'
    ab.style.display = 'grid'
    ab.style.gridGap = '16px'
    ab.style.marginTop = '12px'
    ab.style.marginBottom = '6px'
    ab.className = 'recartist'

    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'],
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        let dv = document.createElement('div')
        dv.className = 'con3'
        dv.style.gridColumn = '1 / 3'
        dv.id = ar['id']
        dv.style.backgroundImage = `url(${data['images'][0]['url']})`
        dv.style.backgroundRepeat = 'no-repeat'
        dv.style.backgroundSize = 'cover'
        dv.addEventListener('click', function(e) {
            click2play(e)
        })

        artinfo.innerText = data['name']
        let af = document.createElement('div')
        af.innerText = data['followers']['total'] + ' followers'
        let ag = document.createElement('div')
        ag.innerText = data['genres']
        let arr = document.createElement('div')
        arr.innerText = 'Recommended songs'
        arr.style.color = '#f037a5'
        arr.addEventListener('click', function() {
            request({
                url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + data['id'] + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((data) => {
                let rstracks = data['tracks']
                let rc = document.createElement('div')
                rc.className = 'con2'
                console.log('232' + ar['id'])
                rc.id = 'recart_' + ar['id']
                for (const rst of rstracks) {
                    let rd = document.createElement('div')
                    rd.tabIndex = 0
                    rd.className = 'con3'
                    rd.style.backgroundImage = `url(${rst['album']['images'][0]['url']})`
                    rd.style.backgroundRepeat = 'no-repeat'
                    rd.style.backgroundSize = 'cover'
                    rd.innerText = `${list(rst['artists'])} -  ${rst['name']}`
                    let ra = document.createElement('audio')
                    ra.type = "audio/mpeg"
                    ra.preload = 'none'
                    if (rst['preview_url'])
                        ra.src = `${rst['preview_url']}`
                    else {
                        rd.style.opacity = '.5'
                    }
                    rd.appendChild(ra)
                    rd.addEventListener('click', function(e) {
                        click2play(e)

                    })
                    rd.appendChild(ra)
                    rc.appendChild(rd)
                    tracks.appendChild(rc)
                }
            }).catch((status) => {

            })
        })
        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = ar['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dvv.appendChild(openinspotify)
        ab.appendChild(dv)
        artinfo.appendChild(af)
        artinfo.appendChild(ag)
        artinfo.appendChild(arr)
        artinfo.appendChild(dvv)
        ab.appendChild(artinfo)
        console.log(JSON.stringify('204 ' + data['images'][0]['url']))
    }).catch((status) => {

    })
    const grid = document.createElement('div')
    grid.style.gridColumn = '1/8'
    let name = document.createElement('div')
    name.innerText = 'Top tracks'
    grid.appendChild(name)
    let nme = document.createElement('div')
    nme.innerText = 'Albums'
    grid.appendChild(nme)
    let nm = document.createElement('div')
    nm.innerText = 'single'
    grid.appendChild(nm)
    let ne = document.createElement('div')
    ne.innerText = 'appears on'
    grid.appendChild(ne)
    let area = document.createElement('div')
    area.style.gridArea = '1 / 8 / 3 / 10'
    area.innerText = 'Related Artists'

    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'] + '/top-tracks?limit=10&market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async(data) => {
        console.log(data)
        // let tt = document.createElement('audio')
        // tt.src = data['tracks'][0]['preview_url']
        // document.getElementById(ar['id']).appendChild(tt)
        let con = document.createElement('div')
        // con.style.display = 'flex'
        con.className = 'att col2'
        let i = 0
                            console.log(3363)
        for await(const topt of data['tracks']) {
                                        console.log(3365)
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.setAttribute('data-target', i++)
            d.style.backgroundImage = `url(${topt['album']['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            d.innerText = `${list(topt['artists'])} -  ${topt['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (topt['preview_url'])
                a.src = `${topt['preview_url']}`
            else {
                d.style.opacity = '.5'
            }
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                deeper(topt, tracks, 'tt')
                let tracksid = document.querySelectorAll(".att >div")
                for (let i = 0; i < tracksid.length; i++) {
                    tracksid[i].addEventListener("click", function() {
                        console.log('1636 ' + tracksid[i].id)
                        if (tracksid[i].classList.contains("con3active")) {

                        } else {
                            tracksid[i].classList.toggle("con3active");
                        }
                        tracksid.forEach(function(ns) {
                            // console.log('279 ' + ns)
                            if (tracksid[i].getAttribute("data-target") == ns.getAttribute("data-target")) {
                                if (!tracksid[i].classList.contains("con3active")) {
                                    tracksid[i].classList.toggle = 'con3active'
                                }
                            } else {
                                // console.log('282 ' + ns.id)
                                ns.classList.remove('con3active')
                            }
                        });
                    });
                }
                click2play(e)

                // deeper(topt, tracks, 'tt')
            })
            con.appendChild(d)
            name.after(name, con)
            // grid.appendChild(con)
            ab.appendChild(grid)
        }
    }).catch((status) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=album&limit=10',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        if (data['items'].length === 0) {
            nme.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for (const albus of data['items']) {
                console.log('346 ' + albus['id'])
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${albus['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${list(albus['artists'])} -  ${albus['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                albumtracks(`${(albus['href'])}`, function(items) {
                    let fnn = (items.find(e => e.preview_url))
                    if (fnn != null) {
                        a.src = fnn.preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function() {
                        deeperalbum(albus, ab, fnn, items)
                        click2play(e)
                    })
                })
                d.appendChild(a)
                con.appendChild(d)
                nme.after(nme, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }
    }).catch((status) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=single,compilation',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        if (data['items'].length == 0) {
            nm.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for (const sing of data['items']) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${sing['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${list(sing['artists'])} -  ${sing['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                albumtracks(`${(sing['href'])}`, function(items) {
                    let fnn = (items.find(e => e.preview_url))
                    if (fnn != null) {
                        a.src = fnn.preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function() {
                        deeperalbum(sing, ab, fnn, items)
                    })
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
                    click2play(e)
                })
                con.appendChild(d)
                nm.after(nm, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }

    }).catch((status) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=appears_on',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        if (data['items'].length == 0) {
            ne.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for (const appear of data['items']) {
                console.log('441 ' + appear['id'])
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.style.backgroundImage = `url(${appear['images'][0]['url']})`
                d.style.backgroundRepeat = 'no-repeat'
                d.style.backgroundSize = 'cover'
                d.innerText = `${list(appear['artists'])} -  ${appear['name']}`
                let a = document.createElement('audio')
                a.type = "audio/mpeg"
                a.preload = 'none'
                albumtracks(`${(appear['href'])}`, function(items) {
                    d.addEventListener('click', function() {
                        deeperalbum(appear, ab, fnn, items)
                    })
                    let fnn = (items.find(e => e.preview_url))
                    if (fnn != null) {
                        a.src = fnn.preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
                    click2play(e)
                })
                d.addEventListener('click', function() {
                    deeperalbum(tracks, appear)
                })
                con.appendChild(d)
                ne.after(ne, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }
    }).catch((status) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + ar['id'] + '/related-artists',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async(data) => {
        let con = document.createElement('div')
        con.className = 'col2'
        for (const ra of data['artists']) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'img-xs'
            d.style.backgroundImage = `url(${ra['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            // d.innerText = `${ra['name']}`
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            await artisttrack(`${ra['id']}`, function(e) {
                if (e != null) {
                    a.src = e
                } else {
                    d.style.opacity = '.5'
                }
                return e
            })
            d.appendChild(a)
            d.addEventListener('click', function(e) {
                click2play(e)
                deep_artist(tracks, ra)
            })


            con.appendChild(d)
            area.appendChild(con)
            // grid.appendChild(con)
            ab.appendChild(area)
        }
    }).catch((status) => {

    })
    request({
        url: 'https://api.spotify.com/v1/search?q="this is ' + ar['name'] + '"&type=playlist&limit=50&offset=0&market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((data) => {
        console.log(data)
    }).catch((status) => {})
    tracks.appendChild(ab)
    block.appendChild(ab)
    tracks.appendChild(block)
    window.scrollTo({
        top: findPos(block),
        behavior: 'smooth'
    });
}

function findPos(obj) {
    let curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.status);
                // reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};

function click2play(e) {
    let target = e.target
    let audios = target.lastChild
    for (let i = 0; i < allaudio.length; i++) {
        if (allaudio[i] == e.target.lastChild) {

        } else {
            allaudio[i].pause()
        }
    }

    if (audios.paused == false) {
        audios.pause()
    } else {
        audios.play()
    }
}