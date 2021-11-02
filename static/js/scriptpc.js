function initElement(id) {
    console.log('58 ' + id)
    request({
        url: 'https://api.spotify.com/v1/playlists/' + id + '?fields=name,id,external_urls,description,images,tracks(items(track(name,preview_url,external_urls,id,artists,album(album_type,artists,id,images,name))))',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let name = data['name']
        let description = data['description']
        let image = data['images'][0]['url']
        let playtrack = data['tracks']['items']

        let playlistdiv = document.getElementById('playlist')
        let playlistcont = document.createElement('div')
        playlistcont.id = 'p' + id
        let plid = document.createElement('div')
        plid.className = 'con2'
        playlistcont.appendChild(plid)
        let names = document.createElement('div')
        names.innerText = name
        names.className = 'con4'
        plid.appendChild(names)

        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = data['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dvv.appendChild(openinspotify)
        let descriptions = document.createElement('div')
        descriptions.innerHTML = description
        descriptions.style.width = '60%'
        descriptions.style.display = 'flex'
        descriptions.style.alignItems = 'center'
        descriptions.appendChild(dvv)
        // descriptions.className = 'con4'
        plid.appendChild(descriptions)
        let cover = document.createElement('div')
        cover.className = 'con4'
        cover.style.backgroundImage = "url('" + image + "')"
        cover.style.backgroundRepeat = 'no-repeat'
        cover.style.backgroundSize = 'cover'
        plid.appendChild(cover)
        let refresh = document.createElement('button')
        refresh.id = 'refresh_' + id
        refresh.className = 'refresh-end'
        refresh.setAttribute("onclick", "refr('refresh_" + id + "')")
        plid.appendChild(refresh)
        let img = document.createElement('img')
        img.id = 'icon_' + id
        img.src = '../static/images/refresh-icon.svg'
        img.height = 12
        refresh.appendChild(img)
        let trid = document.createElement('div')
        trid.className = 'con2'
        playlistcont.appendChild(trid)
        for await (const pla of playtrack) {
            console.log('75 ' + pla)
            let d = document.createElement('div')
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(pla, playlistdiv.nextElementSibling, 'playlist')
            })


            await trid.appendChild(d)
            window.scrollTo({
                top: findPos(plid),
                behavior: 'smooth'
            });
        }
        playlistdiv.appendChild(playlistcont)
    }).catch((error) => {
        if (error.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((response) => {
                initElement(id)
            }).catch((error) => {

            })
        }

    })
}

function list(artists) {
    const names = artists.map(({
                                   name
                               }) => name);
    const finalName = names.pop();
    return names.length ?
        names.join(', ') + ' & ' + finalName :
        finalName;
}

let pllist = document.querySelectorAll("#playlistlist > div");
for (let i = 0; i < pllist.length; i++) {
    pllist[i].addEventListener("click", function () {
        if (document.getElementById('p' + pllist[i].id)) {
        } else {
            initElement(pllist[i].id)
        }
        if (pllist[i].classList.contains("activetab")) {

        } else {
            pllist[i].classList.toggle("activetab");
        }
        pllist.forEach(function (ns) {
            if (pllist[i].id === ns.id) {
                if (document.getElementById('p' + ns.id)) {
                    document.getElementById('p' + ns.id).style.display = 'block'
                }
            } else {
                ns.classList.remove('activetab')
                if (document.getElementById('p' + ns.id)) {
                    document.getElementById('p' + ns.id).style.display = 'none'
                }
            }
        });
        let rectrack = document.getElementById('playlist').nextElementSibling.childNodes
        for (let i of rectrack) {
            i.style.display = 'none'
        }
    });
}
document.getElementById('topartists').addEventListener('click', function () {
    document.getElementById('artists').style.display = 'flex'
    document.getElementById('artists6').style.display = 'none'
    document.getElementById('artistsall').style.display = 'none'
})
document.getElementById('ta').addEventListener("click", function () {
    console.log('294')
    if (Array.from(ta).find(ta => ta.className === 'activetab') === undefined) {
        if (document.getElementById('artists').hasChildNodes() === true) {
            document.getElementById('artists').style.display = 'flex'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'none'
        } else {
            topartistst()
        }
    } else {
        if (Array.from(ta).find(ta => ta.className === 'activetab').id === 'artists') {
            document.getElementById('artists').style.display = 'flex'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'none'
        } else if (Array.from(ta).find(ta => ta.className === 'activetab').id === 'artists6') {
            document.getElementById('artists').style.display = 'none'
            document.getElementById('artists6').style.display = 'flex'
            document.getElementById('artistsall').style.display = 'none'
        } else if (Array.from(ta).find(ta => ta.className === 'activetab').id === 'toptrackat') {
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
    }).then(async (response) => {
        let data = response.data
        let artis = document.getElementById('artists')
        let items = data['items']
        for await (const it of items) {
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
            await artisttrack(`${it['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deep_artist(artis.lastChild, it, true)
            })
            artis.appendChild(d)
        }

        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        artis.appendChild(rectrack)
        document.getElementById('artists').style.display = 'flex'
        document.getElementById('artists6').style.display = 'none'
        document.getElementById('artistsall').style.display = 'none'
    }).catch((error) => {
        if (error.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((response) => {
                topartistst()
            }).catch((error) => {
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
    }).then(async (response) => {
        let data = response.data
        let artis = document.getElementById('artists6')
        let items = data['items']
        for await (const it of items) {
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
            await artisttrack(`${it['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deep_artist(artis.lastChild, it, true)
            })
            artis.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        artis.appendChild(rectrack)
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'flex'
        document.getElementById('artistsall').style.display = 'none'
    }).catch((error) => {

    })
}

function topartiststall() {
    request({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let artis = document.getElementById('artistsall')
        let items = data['items']
        for await (const it of items) {
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
            await artisttrack(`${it['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deep_artist(artis.lastChild, it, true)
            })
            artis.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        artis.appendChild(rectrack)
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'none'
        document.getElementById('artistsall').style.display = 'flex'
    }).catch((error) => {

    })

}

document.getElementById('topartists6').addEventListener('click', function () {
    if (document.getElementById('artists6').hasChildNodes() === true) {
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'flex'
        document.getElementById('artistsall').style.display = 'none'
    } else {
        topartistst6()
    }
})
document.getElementById('topartistsall').addEventListener('click', function () {
    if (document.getElementById('artistsall').hasChildNodes() === true) {
        document.getElementById('artists').style.display = 'none'
        document.getElementById('artists6').style.display = 'none'
        document.getElementById('artistsall').style.display = 'flex'
    } else {
        topartiststall()
    }
})
const ta = document.querySelectorAll('[id^=topartists]');

for (let i = 0; i < ta.length; i++) {
    ta[i].addEventListener("click", function () {
        if (ta[i].classList.contains("activetab")) {

        } else {
            ta[i].classList.toggle("activetab");
        }
        ta.forEach(function (ns) {
            if (ta[i] === ns) {
                console.log('test')
            } else {
                ns.classList.remove('activetab')
            }
        });
    });
}

async function artisttrack(id) {
    return request({
        url: 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        if (error.status === 401) {
            request({
                url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((response) => {

            }).catch((error) => {

            })
        }

    })
}


function albumstracks(id) {
    return request({
        url: 'https://api.spotify.com/v1/albums/' + id + '/tracks?market=' + localStorage.getItem('country') + '&limit=10',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        return response
    }).catch((error) => {

    })
}

const tt = document.querySelectorAll('[id^=toptracks]');

for (let i = 0; i < tt.length; i++) {
    tt[i].addEventListener("click", function () {
        if (tt[i].classList.contains("activetab")) {
        } else {
            tt[i].classList.toggle("activetab");
        }
        tt.forEach(function (nst) {
            if (tt[i] === nst) {
                console.log('test')
            } else {
                nst.classList.remove('activetab')
            }
        });
    });
}
document.getElementById('tt').addEventListener("click", function () {
    console.log('544')
    if (Array.from(tt).find(tt => tt.className === 'activetab') === undefined) {
        if (document.getElementById('toptrack').hasChildNodes() === true) {
            document.getElementById('toptrack').style.display = 'flex'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'none'
        } else {
            topttracks()
        }
    } else {
        if (Array.from(tt).find(tt => tt.className === 'activetab').id === 'toptrack') {
            document.getElementById('toptrack').style.display = 'flex'
            document.getElementById('toptrack6').style.display = 'none'
            document.getElementById('toptrackat').style.display = 'none'
        } else if (Array.from(tt).find(tt => tt.className === 'activetab').id === 'toptrack6') {
            document.getElementById('toptrack').style.display = 'none'
            document.getElementById('toptrack6').style.display = 'flex'
            document.getElementById('toptrackat').style.display = 'none'
        } else if (Array.from(tt).find(tt => tt.className === 'activetab').id === 'toptrackat') {
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
    }).then(async (response) => {
        let data = response.data
        let tracks = document.getElementById('toptrack')
        tracks.innerHTML = ''
        let playtrack = data['items']
        console.log('325 ' + playtrack)
        for await(const pla of playtrack) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['album']['images'][1]['url']})`
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(pla, tracks.lastChild, 'tt')
            })
            tracks.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        tracks.appendChild(rectrack)
        document.getElementById('toptrack').style.display = 'flex'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'none'
    }).catch((error) => {
        request({
            url: '/spotify/refresh_token/' + localStorage.getItem('username'),
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then((response) => {
            topttracks()
        }).catch((error) => {

        })
    })
}

document.getElementById('toptracks').addEventListener('click', function () {
    if (document.getElementById('toptrack').hasChildNodes() === true) {
        document.getElementById('toptrack').style.display = 'flex'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'none'
    } else {
        topttracks()
    }

})
document.getElementById('toptrackssix').addEventListener('click', function () {
    if (document.getElementById('toptrack6').hasChildNodes() === true) {
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
    }).then(async (response) => {
        let data = response.data
        let tracks = document.getElementById('toptrack6')
        tracks.innerHTML = ''
        let playtrack = data['items']
        console.log('372 ' + playtrack)
        for await(const pla of playtrack) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['album']['images'][1]['url']})`
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(pla, tracks.lastChild, 'tt')
            })
            tracks.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        tracks.appendChild(rectrack)
        document.getElementById('toptrack6').style.display = 'flex'
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'none'
    }).catch((error) => {

    })

}

function topttracksall() {
    request({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let tracks = document.getElementById('toptrackat')
        tracks.innerHTML = ''
        let playtrack = data['items']
        console.log('403' + playtrack)
        for await(const pla of playtrack) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${pla['album']['images'][1]['url']})`
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(pla, tracks, 'tt')
            })
            tracks.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        tracks.appendChild(rectrack)
        document.getElementById('toptrackat').style.display = 'flex'
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrack6').style.display = 'none'
    }).catch((error) => {

    })

}

document.getElementById('toptracksall').addEventListener('click', function () {
    if (document.getElementById('toptrackat').hasChildNodes() === true) {
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackat').style.display = 'flex'
    } else {
        topttracksall()
    }
})
document.getElementById('sva').addEventListener("click", function () {
    if (document.getElementById('savedalbum').hasChildNodes() === true) {
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
    }).then(async (response) => {
        let data = response.data
        let albums = document.getElementById('savedalbum')
        albums.innerHTML = ''
        let savedalbum = data['items']
        console.log('435 ' + savedalbum)
        for await (let sa of savedalbum) {
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
            albumstracks(sa['album']['id']).then((response) => {
                let items = response.data['items']
                if (items[0].preview_url) {
                    a.src = items[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', async function () {
                await albumstracks(sa['album']['id']).then(async (response) => {
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
                    cover.addEventListener('mouseover', function (e) {
                        mouseover2play(e)
                    })
                    cover.addEventListener('mouseleave', function (e) {
                        mouseleave2stop(e)
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
                    for await(let el of response.data['items']) {
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
                        td.addEventListener('mouseover', function (e) {
                            mouseover2play(e)
                        })
                        td.addEventListener('mouseleave', function (e) {
                            mouseleave2stop(e)
                        })
                        td.addEventListener('click', function () {
                            deeperalbumtracks(el, grid, sa)
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
                })
            })
            albums.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        albums.appendChild(rectrack)
    }).catch((error) => {

    })
}

document.getElementById('svt').addEventListener("click", function () {
    if (document.getElementById('savedtrack').hasChildNodes() === true) {
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
    }).then((response) => {
        let data = response.data
        let items = data['items']
        let tracks = document.getElementById('savedtrack')
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(pla, tracks.nextElementSibling, 'playlist')
            })
            document.getElementById('savedtrack').appendChild(d)
        }
        if (items.length > 0) {
            sendRequest(offset + 50)
        } else if (offset === 100) {

        }
    }).catch((error) => {

    })

}

document.getElementById('followedartists').addEventListener('click', function () {
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
    }).then(async (response) => {
        let data = response.data
        let artis = document.getElementById('followedartist')
        let items = data['artists']['items']
        for await (const it of items) {
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
            await artisttrack(`${it['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deep_artist(artis.lastChild, it, true)
            })
            artis.appendChild(d)
        }
        let rectrack = document.createElement('div')
        rectrack.className = 'rectrack'
        artis.appendChild(rectrack)
    }).catch((error) => {

    })

}

document.getElementById('newreleases').addEventListener('click', function () {
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
    }).then(async (response) => {
        let data = response.data
        let items = data['albums']['items']
        let elem = []
        for await (const it of items) {
            elem.push(`${it['id']}`)
        }
        newrelease(elem, offset)
        console.log('766 ' + elem)
    }).catch((error) => {

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
    }).then((response) => {
        let data = response.data
        let items = data['albums']
        for (const it of items) {
            let tracks = it['tracks']['items']
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
            d.style.backgroundImage = `url(${it['images'][0]['url']})`
            d.style.backgroundRepeat = 'no-repeat'
            d.style.backgroundSize = 'cover'
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            if (tracks[0]['preview_url']) {
                a.src = tracks[0]['preview_url']
                d.innerText = `${list(tracks[0]['artists'])} -  ${tracks[0]['name']}`
            } else {
                d.style.opacity = '.5'
                d.innerText = `${list(tracks[0]['artists'])} -  ${tracks[0]['name']}`
            }
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseout', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeper(it, nr.lastChild, 'nr')
            })
            nr.appendChild(d)
        }
        if (items.length > 0) {
            getnewrelease(offset + 20)
        } else if (offset === 100) {

        }
    }).catch((error) => {
        if (error.status === 400) {
            let rectrack = document.createElement('div')
            rectrack.className = 'rectrack'
            nr.appendChild(rectrack)
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
    setTimeout(function () {
        refreshIcon.addEventListener('animationiteration', function () {
            if (type === 'topartist') {
                topartistst()
            } else if (type === 'topartists6') {
                topartistst6()
            } else if (type === 'topartistsall') {
                topartiststall()
            } else if (type === 'toptracks') {
                topttracks()
            } else if (type === 'toptrackssix') {
                topttracks6()
            } else if (type === 'toptracksall') {
                topttracksall()
            } else if (type === 'savedalbum') {
                saved_albums()
            } else if (type === 'savetrack') {
                savedtracks()
            } else if (type === 'followedartist') {
                getfollowedartist()
            } else if (type === 'newrelease') {
                getnewrelease(0)
            } else {
                document.getElementById(id.replace('refresh_', 'p')).remove()
                initElement(id.replace('refresh_', ''))
            }
            refreshButton.setAttribute("class", "refresh-end")
            refreshButton.disabled = false
        })
    }, 100)
}

let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}


document.getElementById('srch').addEventListener('input', function () {
    clearTimeout(searchtimer)
    searchtimer = setTimeout(() => {
        if (document.getElementById('srch').value) {
            let value = document.getElementById('srch').value

            request({
                url: 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then(async (response) => {
                let songs = document.getElementById('s1')
                let arti = document.getElementById('ar1')
                let albu = document.getElementById('al1')
                let play = document.getElementById('p1')
                songs.innerHTML = ''
                arti.innerHTML = ''
                albu.innerHTML = ''
                play.innerHTML = ''
                let data = response.data
                let albums = data['albums']['items']
                let artists = data['artists']['items']
                let playlists = data['playlists']['items']
                let tracks = data['tracks']['items']

                console.log(albums)
                console.log(artists)
                console.log(playlists)
                console.log(tracks)
                for await (const alb of albums) {
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
                    await albumtracks(alb['id']).then((response) => {
                        let items = response.data['items']
                        if (items[0].preview_url) {
                            a.src = items[0].preview_url
                        } else {
                            d.style.opacity = '.5'
                        }
                        d.addEventListener('click', function (e) {
                            deeperalbum(alb, albu, items[0], items)
                        })
                    })
                    d.appendChild(a)
                    main.addEventListener('mouseover', function (e) {
                        parentmouseover2play(e)
                    })
                    main.addEventListener('mouseleave', function (e) {
                        parentmouseleave2stop(e)
                    })
                    d.addEventListener('mouseover', function (e) {
                        mouseover2play(e)
                    })
                    d.addEventListener('mouseleave', function (e) {
                        mouseleave2stop(e)
                    })
                    main.appendChild(d)
                    d1.appendChild(d2)
                    main.appendChild(d1)
                    albu.appendChild(main)
                }
                for await (const art of artists) {
                    let main = document.createElement('div')
                    main.className = 'playable-search'
                    let d = document.createElement('div')
                    d.tabIndex = 0
                    d.className = 'con3'
                    if ((art['images']).length !== 0) {
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
                    request({
                        url: `${(art['href'])}` + '/top-tracks?market=' + localStorage.getItem('country'),
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    }).then((response) => {
                        let data = response.data
                        let tracks = data['tracks']
                        if (tracks[0].preview_url) {
                            a.src = tracks[0].preview_url
                        } else {
                            d.style.opacity = '.5'
                        }

                    }).catch((error) => {

                    })
                    main.addEventListener('click', function (e) {
                        deep_artist(arti, art, false, 'trackartist')
                    })
                    d.appendChild(a)
                    main.addEventListener('mouseover', function (e) {
                        parentmouseover2play(e)
                    })
                    main.addEventListener('mouseleave', function (e) {
                        parentmouseleave2stop(e)
                    })
                    d.addEventListener('mouseover', function (e) {
                        mouseover2play(e)
                    })
                    d.addEventListener('mouseleave', function (e) {
                        mouseleave2stop(e)
                    })
                    main.appendChild(d)
                    d1.appendChild(d2)
                    main.appendChild(d1)
                    arti.appendChild(main)
                }
                for await(const pls of playlists) {
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
                    await pltracks(pls['id']).then((response) => {
                        let playtrack = response.data['items']
                        if (playtrack[0]['track']["preview_url"]) {
                            a.src = playtrack[0]['track']["preview_url"]
                        } else {
                            d.style.opacity = '.5'
                        }
                    })
                    d.appendChild(a)
                    main.addEventListener('mouseover', function (e) {
                        parentmouseover2play(e)
                    })
                    main.addEventListener('mouseleave', function (e) {
                        parentmouseleave2stop(e)
                    })
                    d.addEventListener('mouseover', function (e) {
                        mouseover2play(e)
                    })
                    d.addEventListener('mouseleave', function (e) {
                        mouseleave2stop(e)
                    })
                    main.appendChild(d)
                    d1.appendChild(d2)
                    main.appendChild(d1)
                    play.appendChild(main)
                }
                for await(const pla of tracks) {
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
                    main.addEventListener('mouseover', function (e) {
                        parentmouseover2play(e)
                    })
                    main.addEventListener('mouseleave', function (e) {
                        parentmouseleave2stop(e)
                    })
                    d.addEventListener('mouseover', function (e) {
                        mouseover2play(e)
                    })
                    d.addEventListener('mouseleave', function (e) {
                        mouseleave2stop(e)
                    })
                    main.addEventListener('click', function (e) {
                        deeper(pla, songs, 'tt')
                    })
                    main.appendChild(d)
                    d1.appendChild(d2)
                    main.appendChild(d1)
                    songs.appendChild(main)
                }
            }).catch((error) => {
                if (error.status === 401) {
                    request({
                        url: '/spotify/refresh_token/' + localStorage.getItem('username'),
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    }).then((response) => {

                    })

                }
            })
            document.getElementById('search').style.visibility = 'unset'
        }
    }, 1000)

})


function pltracks(id) {
    return request({
        url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks?limit=50',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        if (error.status === 401) {
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

function albumtracks(id) {
    return request({
        url: 'https://api.spotify.com/v1/albums/' + id + '/tracks?market=UA&limit=10',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        if (error.status === 401) {
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

async function deeper(pla, tracks, type) {
    console.log(pla)
    if (pla['track'] && pla['track']['id']) {
        let allTracks = document.querySelectorAll(".rectrack > div");
        if (await allTracks != null) {
            for await(let i of allTracks) {
                // eslint-disable-next-line no-empty
                if (document.getElementById('d' + pla.track.id) != null && i.id === document.getElementById('d' + pla.track.id).id) {

                } else {
                    i.style.display = 'none'
                }


            }

        }
        if (document.getElementById('d' + pla.track.id)) {
            document.getElementById('d' + pla.track.id).style.display = 'flex'
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('d'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
            return
        }
    } else if (pla['id']) {
        let allTracks = document.querySelectorAll(".rectrack > div");
        if (await allTracks != null) {
            for await(let i of allTracks) {
                // eslint-disable-next-line no-empty
                if (document.getElementById('d' + pla.id) != null && i.id === document.getElementById('d' + pla.id).id) {

                } else {
                    i.style.display = 'none'
                }


            }

        }
        if (document.getElementById('d' + pla.id)) {
            document.getElementById('d' + pla.id).style.display = 'flex'
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('d'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
            return
        }
    }

    if (type === 'playlist') {
        let info = document.createElement('div')
        info.style.display = 'flex'
        info.className = 'playlisttrack card2'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
        info.id = 'd' + pla['track']['id']
        let playable = document.createElement('div')
        playable.className = 'con3'
        playable.style.backgroundImage = `url(${pla['track']['album']['images'][0]['url']})`
        playable.style.backgroundRepeat = 'no-repeat'
        playable.style.backgroundSize = 'cover'
        playable.innerText = `${list(pla['track']['artists'])} -  ${pla['track']['name']}`
        let playaudio = document.createElement('audio')
        if (pla['track']['preview_url'])
            playaudio.src = `${pla['track']['preview_url']}`
        else {
            playable.style.opacity = '.5'
        }
        playable.addEventListener('mouseover', function (e) {
            mouseover2play(e)
        })
        playable.addEventListener('mouseleave', function (e) {
            mouseleave2stop(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.innerText = `${pla['track']['name']}`
        trackinfo.style.width = '50%'
        let tracktype = document.createElement('div')
        tracktype.innerText = 'From the ' + `${pla['track']['album']['album_type']}` + ' ' + `${pla['track']['album']['name']}`
        let trackartist = document.createElement('div')
        let by = document.createElement('p')
        by.innerText = 'By '
        trackartist.appendChild(by)
        trackartist.style.display = 'flex'
        trackartist.style.alignItems = 'center'
        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = pla['track']['external_urls']['spotify']
        openinspotify.target = '_blank'
        let btn = document.createElement('button')
        btn.className = 'button'
        btn.innerText = 'Open is Spotify'
        openinspotify.appendChild(btn)
        dvv.appendChild(openinspotify)
        await artname(pla['track']['artists'], trackartist, tracks)
        let recomend = document.createElement('span')
        recomend.innerText = 'Recommended songs based on this'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', async function () {
            await seedTracks(pla['track'], tracks, 'playlisttrack card2', info.id)
        })
        let artistcirle = document.createElement('div')
        for (const ar of pla['track']['artists']) {
            let artst = document.createElement('div')
            artst.className = 'artist-cirle'
            let artname = document.createElement('div')
            artname.style.float = 'left'
            artname.innerText = ar['name']
            artname.style.marginLeft = '50px'
            artist(ar['id']).then((response) => {
                artst.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                artst.style.backgroundRepeat = 'no-repeat'
                artst.style.backgroundSize = 'cover'
            })
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            await artisttrack(`${ar['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    artst.style.opacity = '.5'
                }
            })
            artst.addEventListener('click', function () {
                deep_artist(tracks, ar, false, 'trackartist')
            })
            artst.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            artst.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            // if (pla['track']['artists'][0]['name'] == ar['name']){
            //     artst.click()
            // }
            artst.appendChild(a)
            artst.appendChild(artname)
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
        tracks.appendChild(info)
        window.scrollTo({
            top: findPos(info),
            behavior: 'smooth'
        });
    } else if (type === 'tt') {
        console.log('1496 pla ' + pla)
        let info = document.createElement('div')
        info.id = 'd' + pla['id']
        info.style.display = 'flex'
        info.className = 'playlisttrack card2'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
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
        playable.addEventListener('mouseover', function (e) {
            mouseover2play(e)
        })
        playable.addEventListener('mouseleave', function (e) {
            mouseleave2stop(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.style.width = '50%'
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
        await artname(pla['artists'], trackartist, tracks)
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
        recomend.innerText = 'Recommended songs based on this'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', async function () {
            await seedTracks(pla['id'], tracks)
        })
        let artistcirle = document.createElement('div')
        for (const ar of pla['artists']) {
            let artst = document.createElement('div')
            artst.className = 'artist-cirle'
            let artname = document.createElement('div')
            artname.style.float = 'left'
            artname.innerText = ar['name']
            artname.style.marginLeft = '50px'
            artist(ar['id']).then((response) => {
                artst.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                artst.style.backgroundRepeat = 'no-repeat'
                artst.style.backgroundSize = 'cover'
            })
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            await artisttrack(`${ar['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    artst.style.opacity = '.5'
                }
            })
            artst.addEventListener('click', function () {
                deep_artist(tracks, ar, false, 'trackartist')
            })
            artst.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            artst.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            // if (pla['track']['artists'][0]['name'] == ar['name']){
            //     artst.click()
            // }
            artst.appendChild(a)
            artst.appendChild(artname)
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
        tracks.appendChild(info)
        window.scrollTo({
            top: findPos(info),
            behavior: 'smooth'
        });
    } else if (type === 'nr') {
        let info = document.createElement('div')
        info.id = 'd' + pla['id']
        info.style.display = 'flex'
        info.className = 'playlisttrack card2'
        info.style.marginTop = '12px'
        info.style.marginBottom = '6px'
        let playable = document.createElement('div')
        playable.className = 'con3'
        playable.style.backgroundImage = `url(${pla['images'][0]['url']})`
        playable.style.backgroundRepeat = 'no-repeat'
        playable.style.backgroundSize = 'cover'
        playable.innerText = `${list(pla['artists'])} -  ${pla['name']}`
        let playaudio = document.createElement('audio')
        if (pla['tracks']['items'][0]['preview_url'])
            playaudio.src = `${pla['tracks']['items'][0]['preview_url']}`
        else {
            playable.style.opacity = '.5'
        }
        playable.addEventListener('mouseover', function (e) {
            mouseover2play(e)
        })
        playable.addEventListener('mouseleave', function (e) {
            mouseleave2stop(e)
        })
        let trackinfo = document.createElement('div')
        trackinfo.style.width = '50%'
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
        await artname(pla['artists'], trackartist, tracks)

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
        recomend.innerText = 'Recommended songs based on this'
        recomend.style.color = '#f037a5'
        recomend.addEventListener('click', async function () {
            await seedTracks(pla['id'], tracks)
        })
        let artistcirle = document.createElement('div')
        for (const ar of pla['artists']) {
            let artst = document.createElement('div')
            artst.className = 'artist-cirle'
            let artname = document.createElement('div')
            artname.style.float = 'left'
            artname.innerText = ar['name']
            artname.style.marginLeft = '50px'
            artist(ar['id']).then((response) => {
                artst.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                artst.style.backgroundRepeat = 'no-repeat'
                artst.style.backgroundSize = 'cover'
            })
            let a = document.createElement('audio')
            a.type = "audio/mpeg"
            a.preload = 'none'
            await artisttrack(`${ar['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    artst.style.opacity = '.5'
                }
            })
            artst.addEventListener('click', function () {
                deep_artist(tracks, ar, false, 'trackartist')
            })
            artst.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            artst.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            // if (pla['track']['artists'][0]['name'] == ar['name']){
            //     artst.click()
            // }
            artst.appendChild(a)
            artst.appendChild(artname)
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
        tracks.appendChild(info)
        window.scrollTo({
            top: findPos(info),
            behavior: 'smooth'
        });
    }
}

async function deeperalbumtracks(pla, tracks, images) {
    let info = document.createElement('div')
    info.id = 'alb' + pla['id']
    info.className = 'deep_albums card2'
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
    playable.addEventListener('mouseover', function (e) {
        mouseover2play(e)
    })
    playable.addEventListener('mouseleave', function (e) {
        mouseleave2stop(e)
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
    let dvv = document.createElement('div')
    let openinspotify = document.createElement('a')
    openinspotify.href = pla['external_urls']['spotify']
    openinspotify.target = '_blank'
    let btn = document.createElement('button')
    btn.className = 'button'
    btn.innerText = 'Open is Spotify'
    openinspotify.appendChild(btn)
    dvv.appendChild(openinspotify)
    let by = document.createElement('div')
    by.innerText = 'By '
    trackartist.appendChild(by)
    trackartist.style.display = 'flex'
    trackartist.style.alignItems = 'center'


    if (pla['album']) {
        // trackartist.innerText = 'By ' + `${list(pla['album']['artists'])}`
        await artname(pla['album']['artists'], trackartist)
    } else {
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        await artname(pla['artists'], trackartist)
    }


    let recomend = document.createElement('span')
    recomend.innerText = 'Recommended songs based on this'
    recomend.style.color = '#f037a5'
    recomend.addEventListener('click', async function () {
        await seedTracks(pla['id'], tracks)
    })
    playable.appendChild(playaudio)
    info.appendChild(playable)
    info.appendChild(trackinfo)
    trackinfo.appendChild(tracktype)
    trackinfo.appendChild(trackartist)
    trackinfo.appendChild(recomend)
    trackinfo.appendChild(dvv)
    tracks.appendChild(info)
    window.scrollTo({
        top: findPos(block),
        behavior: 'smooth'
    });
}

async function deeperalbum(pla, tracks, el, e) {
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
    info.className = 'con2'
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
    playable.addEventListener('mouseover', function (e) {
        mouseover2play(e)
    })
    playable.addEventListener('mouseleave', function (e) {
        mouseleave2stop(e)
    })
    let trackinfo = document.createElement('div')
    trackinfo.style.marginLeft = '4px'
    trackinfo.style.marginRight = '4px'
    // trackinfo.style.width = '50%'
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

    let trackartist = document.createElement('div')
    let by = document.createElement('div')
    by.innerText = 'By '
    trackartist.appendChild(by)
    trackartist.style.display = 'flex'
    trackartist.style.alignItems = 'center'
    if (pla['album']) {
        // trackartist.innerText = 'By ' + `${list(pla['album']['artists'])}`
        await artname(pla['album']['artists'], trackartist)
    } else {
        // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
        await artname(pla['artists'], trackartist)
    }


    let con = document.createElement('div')
    con.style.display = 'block'
    con.innerText = 'Tracks'
    con.className = 'trackList'


    let grid = document.createElement('div')
    for (let l of e) {
        if (e != null) {
            let td = document.createElement('div')
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
            td.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            td.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            td.addEventListener('click', function () {
                deeperalbumtracks(l, tracks, pla)
            })
            td.appendChild(tt)
            td.appendChild(ta)
            con.appendChild(td)
            grid.appendChild(con)
        }
    }

    let recomend = document.createElement('span')
    recomend.innerText = 'Recommended songs based on this'
    recomend.style.color = '#f037a5'
    recomend.addEventListener('click', async function () {
        await seedTracks(pla['id'], tracks)
    })


    playable.appendChild(playaudio)
    info.appendChild(playable)
    info.appendChild(trackinfo)
    info.appendChild(grid)
    trackinfo.appendChild(trackrelease)
    trackinfo.appendChild(trackartist)
    trackinfo.appendChild(recomend)
    block.appendChild(info)
    console.log(tracks)
    tracks.after(tracks, block)
    window.scrollTo({
        top: findPos(block),
        behavior: 'smooth'
    });
}

async function deeperAlbum(tracks, item, albus, child, search) {
    console.log(item)
    if (await child) {
        let par = document.getElementById(child).parentElement.nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    }
    if (search === true) {
        let albs = document.querySelectorAll('#search> .rectrack > div')
        for (let i = 0; i < albs.length; i++) {
            if (document.getElementById('alb' + albus.id) != null && albs[i].id === document.getElementById('alb' + albus.id).id) {
                document.getElementById('alb' + albus.id).style.display = 'block'
            } else {
                albs[i].style.display = 'none'
            }
        }
    }
    if (document.getElementById('alb' + albus.id)) {
        document.getElementById('alb' + albus.id).style.display = 'flex'
        setTimeout(() => {
            window.scrollTo({
                top: (document.getElementById('alb' + albus.id)).offsetTop,
                behavior: 'smooth'
            });
        }, 10);
        return
    }
    let info = document.createElement('div')
    info.className = 'deep_albums card2'
    info.id = 'alb' + albus.id
    let playable = document.createElement('div')
    playable.className = 'con3'
    if (await albus['album']) {
        playable.style.backgroundImage = `url(${albus['album']['images'][0]['url']})`
    } else {
        playable.style.backgroundImage = `url(${albus['images'][0]['url']})`
    }
    playable.style.backgroundRepeat = 'no-repeat'
    playable.style.backgroundSize = 'cover'
    if (await albus['album']) {
        playable.innerText = `${list(albus['album']['artists'])}`
    } else {
        playable.innerText = `${list(albus['artists'])}`
    }
    let playaudio = document.createElement('audio')
    if (await item[0]['preview_url'])
        playaudio.src = `${item[0]['preview_url']}`
    else {
        playable.style.opacity = '.5'
    }
    playable.addEventListener('mouseover', function (e) {
        mouseover2play(e)
    })
    playable.addEventListener('mouseleave', function (e) {
        mouseleave2stop(e)
    })
    let trackinfo = document.createElement('div')
    trackinfo.style.marginLeft = '4px'
    trackinfo.style.marginRight = '4px'
    // trackinfo.style.width = '50%'
    if (await albus['album']) {
        trackinfo.innerText = `${albus['album']['name']}`
    } else {
        trackinfo.innerText = `${albus['name']}`
    }
    let trackrelease = document.createElement('div')
    if (await albus['album']) {
        trackrelease.innerText = `${albus['album']['release_date']}`
    } else {
        trackrelease.innerText = `${albus['release_date']}`
    }

    let trackartist = document.createElement('div')
    // let by = document.createElement('div')
    // by.innerText = 'By '
    // trackartist.appendChild(by)
    trackartist.style.display = 'flex'
    trackartist.style.alignItems = 'center'
    if (await albus['album']) {
        trackartist.innerText = 'By ' + `${list(albus['album']['artists'])}`
        // await artname(albus['album']['artists'], trackartist, tracks)
    } else {
        trackartist.innerText = 'By ' + `${list(albus['artists'])}`
        // await artname(albus['artists'], trackartist, tracks)
    }


    let con = document.createElement('div')
    con.style.display = 'block'
    con.innerText = 'Tracks'
    con.className = 'trackList'


    for (let i of item) {
        let trackcon = document.createElement('div')
        trackcon.className = 'playable-search'
        let td = document.createElement('div')
        td.className = 'itemImg itemImg-xs  itemImg-search'
        if (albus['album']) {
            td.style.backgroundImage = `url(${albus['album']['images'][1]['url']})`
        } else {
            td.style.backgroundImage = `url(${albus['images'][1]['url']})`
        }
        td.style.backgroundRepeat = 'no-repeat'
        td.style.backgroundSize = 'cover'
        let tt = document.createElement('div')
        tt.innerText = `${i['name']}`
        tt.className = 'title'
        let ta = document.createElement('audio')
        ta.type = "audio/mpeg"
        ta.preload = 'none'
        if (i.preview_url) {
            ta.src = i.preview_url
        } else {
            td.style.opacity = '.5'
        }
        td.addEventListener('mouseover', function (e) {
            mouseover2play(e)
        })
        td.addEventListener('mouseleave', function (e) {
            mouseleave2stop(e)
        })
        td.addEventListener('click', function () {
            deeperTracks2(tracks,i,albus,false,'deep_albums')
        })
        td.appendChild(ta)
        trackcon.appendChild(td)
        trackcon.appendChild(tt)
        con.appendChild(trackcon)
    }

    playable.appendChild(playaudio)
    info.appendChild(playable)
    info.appendChild(trackinfo)
    info.appendChild(con)
    trackinfo.appendChild(trackrelease)
    trackinfo.appendChild(trackartist)
    tracks.appendChild(info)
    window.scrollTo({
        top: findPos(trackinfo),
        behavior: 'smooth'
    });
}

async function deep_artist(tracks, item, flag, sib, related) {
    let all = document.querySelectorAll('.rectrack > div')
    let alltop = document.querySelectorAll('.rectrack > div.' + sib)
    let last = document.querySelector('.rectrack > div.trackartist > div[id="art' + item.id + '"]')
    // console.log(last)
    // console.log(item.id)
    if (await flag === true) {
        // console.log(item.id)
        if (all.length !== 0 && all.length !== 0) {
            for (let i = 0; i < all.length; i++) {
                // console.log(all[i])
                if (last !== null && all[i].firstChild.id === last.id && last.id === item.id) {
                    last.parentElement.style.display = 'block'
                } else {
                    // console.log(all[i])
                    all[i].style.display = 'none'
                }
            }
        }
    } else if (await alltop.length !== 0 && alltop[alltop.length - 1].nextElementSibling !== null) {
        let par = alltop[alltop.length - 1].nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    } else if (await related) {

        let par = document.getElementById(related).parentElement.nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    }
    if (await last !== null && last.id === 'art' + item.id) {
        if (document.getElementById('art' + item.id)) {
            document.getElementById('art' + item.id).parentElement.style.display = 'flex'
        }
        // setTimeout(() => {
        //     window.scrollTo({
        //         top: (document.getElementById('art' + item.id)).offsetTop,
        //         behavior: 'smooth'
        //     });
        // }, 10);
        return
    }

    console.log(tracks)
    let block = document.createElement('div')
    block.className = 'trackartist card2'
    block.style.display = 'block'
    block.style.width = '100%'
    const ab = document.createElement('div')
    let artinfo = document.createElement('div')
    artinfo.style.gridColumn = '3 / 8'
    ab.style.display = 'grid'
    ab.style.gridGap = '16px'
    ab.className = 'recartist'
    ab.id = 'art' + item['id']
    await request({
        url: 'https://api.spotify.com/v1/artists/' + item['id'],
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        let data = response.data
        console.log('202' + data)
        let dv = document.createElement('div')
        dv.className = 'con3'
        dv.style.gridColumn = '1 / 3'
        dv.id = item['id']
        dv.style.backgroundImage = `url(${data['images'][0]['url']})`
        dv.style.backgroundRepeat = 'no-repeat'
        dv.style.backgroundSize = 'cover'
        dv.addEventListener('mouseover', function (e) {
            mouseover2play(e)
        })
        dv.addEventListener('mouseleave', function (e) {
            mouseleave2stop(e)
        })

        artinfo.innerText = data['name']
        let af = document.createElement('div')
        af.innerText = data['followers']['total'] + ' followers'
        let ag = document.createElement('div')
        ag.innerText = data['genres']
        let arr = document.createElement('div')
        arr.innerText = 'Recommended songs based on this'
        arr.style.color = '#f037a5'
        arr.addEventListener('click', async function () {
            await seedArtists(tracks, data, 'trackartist')
        })
        let dvv = document.createElement('div')
        let openinspotify = document.createElement('a')
        openinspotify.href = item['external_urls']['spotify']
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

    }).catch((error) => {

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
        url: 'https://api.spotify.com/v1/artists/' + item['id'] + '/top-tracks?limit=10&market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let con = document.createElement('div')
        con.className = 'col2'

        for await (const topt of data['tracks']) {
            let d = document.createElement('div')
            d.tabIndex = 0
            d.className = 'con3'
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
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deeperTracks(tracks, topt, false, 'trackartist', 'art' + item.id)
            })
            con.appendChild(d)
            name.after(name, con)
            ab.appendChild(grid)
        }
    }).catch((error) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + item['id'] + '/albums?include_groups=album&limit=10',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        if (data['items'].length === 0) {
            nme.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for await (const albus of data['items']) {
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
                await albumtracks(albus['id']).then((response) => {
                    let items = response.data['items']
                    if (items[0].preview_url) {
                        a.src = items[0].preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function (e) {
                        deeperAlbum(tracks, items, albus, 'art' + item.id)
                    })
                })
                d.appendChild(a)
                d.addEventListener('mouseover', function (e) {
                    mouseover2play(e)
                })
                d.addEventListener('mouseleave', function (e) {
                    mouseleave2stop(e)
                })
                con.appendChild(d)
                nme.after(nme, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }
    }).catch((error) => {
    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + item['id'] + '/albums?include_groups=single,compilation',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        if (data['items'].length === 0) {
            nm.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for await (const sing of data['items']) {
                console.log('397 ' + sing['id'])
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
                await albumtracks(sing['id']).then((response) => {
                    let items = response.data['items']
                    if (items[0].preview_url) {
                        a.src = items[0].preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function (e) {
                        deeperalbum(sing, tracks, items[0], items)
                    })
                })
                d.appendChild(a)
                d.addEventListener('mouseover', function (e) {
                    mouseover2play(e)
                })
                d.addEventListener('mouseleave', function (e) {
                    mouseleave2stop(e)
                })
                con.appendChild(d)
                nm.after(nm, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }
    }).catch((error) => {
    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + item['id'] + '/albums?include_groups=appears_on',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        if (data['items'].length === 0) {
            ne.remove()
        } else {
            let con = document.createElement('div')
            // con.style.display = 'flex'
            con.className = 'col2'

            for await (const appear of data['items']) {
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
                await albumtracks(appear['id']).then((response) => {
                    let items = response.data['items']
                    if (items[0].preview_url) {
                        a.src = items[0].preview_url
                    } else {
                        d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function (e) {
                        deeperalbum(appear, tracks, items[0], items)
                    })
                })
                d.appendChild(a)
                d.addEventListener('mouseover', function (e) {
                    mouseover2play(e)
                })
                d.addEventListener('mouseleave', function (e) {
                    mouseleave2stop(e)
                })
                d.addEventListener('click', function () {
                    deeperalbum(tracks, appear)
                })
                con.appendChild(d)
                ne.after(ne, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
            }
        }
    }).catch((error) => {

    })
    await request({
        url: 'https://api.spotify.com/v1/artists/' + item['id'] + '/related-artists',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let con = document.createElement('div')
        con.className = 'col2'
        for await (const ra of data['artists']) {
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
            await artisttrack(`${ra['id']}`).then((response) => {
                let data = response.data
                let tracks = data['tracks']
                if (tracks[0].preview_url) {
                    a.src = tracks[0].preview_url
                } else {
                    d.style.opacity = '.5'
                }
            })
            d.appendChild(a)
            d.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            d.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            d.addEventListener('click', function () {
                deep_artist(tracks, ra, false, 'trackartist')
            })


            con.appendChild(d)
            area.appendChild(con)
            // grid.appendChild(con)
            ab.appendChild(area)
        }
    }).catch((error) => {

    })
    // request({
    //     url: 'https://api.spotify.com/v1/search?q="this is ' + item['name'] + '"&type=playlist&limit=50&offset=0&market=' + localStorage.getItem('country'),
    //     method: 'get',
    //     headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    //     }
    // }).then((response) => {
    //     console.log(response.data)
    // }).catch((error) => {
    // })
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

function artist(id) {
    return request({
        url: 'https://api.spotify.com/v1/artists/' + id,
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then((response) => {
        return response
    }).catch((error) => {

    })
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
                let response = {}
                response.data = JSON.parse(xhr.response)
                response.status = xhr.status
                resolve(response);
            } else {
                let error = {}
                error.status = xhr.status
                error.data = JSON.parse(xhr.response)
                reject(error);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};

function mouseover2play(e) {
    let target = e.target
    let audios = target.lastChild
    if (audios) {
        audios.play()
    }
}

function mouseleave2stop(e) {
    let target = e.target
    let audios = target.lastChild
    if (audios) {
        audios.pause()
    }
}

function parentmouseover2play(e) {
    let target = e.target
    let audios = target.firstChild.lastChild
    if (audios) {
        audios.play()
    }
}

function parentmouseleave2stop(e) {
    let target = e.target
    let audios = target.firstChild.lastChild
    if (audios) {
        audios.pause()
    }
}

let searchtimer = null

function artname(pla, trackartist, tracks) {
    console.log(tracks)
    let pta = pla
    for (const ar of pla) {
        let last = pta[pta.length - 1]
        let first = pta[0]
        let second = pta[1]
        let prelast = pta[pta.length - 2]
        console.log('1610 ' + last)
        if (first['name'] === last['name']) {
            let artst = document.createElement('div')
            artst.innerText = ar['name']
            artst.style.cursor = 'pointer'
            artst.style.marginLeft = '3px'
            artst.addEventListener('click', function () {
                deep_artist(tracks, ar, false, 'trackartist')
            })
            trackartist.appendChild(artst)
        } else if (second['name'] === last['name']) {
            if (ar['name'] === last['name']) {
                let amper = document.createElement('div')
                amper.innerText = ' & '
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function () {
                    deep_artist(tracks, ar, false, 'trackartist')
                })
                trackartist.appendChild(amper)
                trackartist.appendChild(artst)
            } else {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '4px'
                artst.style.marginRight = '4px'
                artst.addEventListener('click', function () {
                    deep_artist(tracks, ar, false, 'trackartist')
                })
                trackartist.appendChild(artst)
            }
        } else {
            if (ar['name'] === last['name']) {
                let amper = document.createElement('div')
                amper.innerText = ' & '
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function () {
                    deep_artist(tracks, ar, false, 'trackartist')
                })
                trackartist.appendChild(amper)
                trackartist.appendChild(artst)
            } else if (ar['name'] === prelast['name']) {
                let artst = document.createElement('div')
                artst.innerText = ar['name']
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function () {
                    deep_artist(tracks, ar, false, 'trackartist')
                })
                trackartist.appendChild(artst)
            } else {
                let artst = document.createElement('div')
                artst.innerText = ar['name'] + ', '
                artst.style.cursor = 'pointer'
                artst.style.marginLeft = '3px'
                artst.addEventListener('click', function () {
                    deep_artist(tracks, ar, false, 'trackartist')
                })
                trackartist.appendChild(artst)
            }
        }
    }
}

async function deeperTracks(tracks, item, flag, sib, child) {
    // let allTracks = document.querySelectorAll(".rectrack > div");
    // if (await allTracks != null) {
    //     for await(let i of allTracks) {
    //         // eslint-disable-next-line no-empty
    //         if (document.getElementById('d' + item.id) != null && i.id === document.getElementById('d' + item.id).id) {
    //
    //         } else {
    //             i.style.display = 'none'
    //         }
    //
    //
    //     }
    //
    // }
    if (await child) {
        let par = document.getElementById(child).parentElement.nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    } else if (await sib) {
        let alltop = document.querySelectorAll('.rectrack > div.' + sib)
        let current = alltop[alltop.length - 1].nextElementSibling
        while (await current != null) {
            // console.log(current)
            current.style.display = 'none'
            if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                current = current.nextElementSibling
            } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                current = current.nextElementSibling.nextElementSibling
            } else if (current.nextElementSibling === null) {
                current = null
            }

        }
    }
    if (await document.getElementById('d' + item.id)) {
        document.getElementById('d' + item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('d'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
    }
    let start = document.createElement('div')
    start.className = "playlisttrack card2"
    start.id = `d` + item.id
    start.style.display = 'flex'
    start.style.marginTop = '12px'
    start.style.marginBottom = '6px'

    let fl = document.createElement('div')
    fl.className = "con3"
    if (await item.album.images[0].url && item.preview_url) {
        fl.style.backgroundImage = 'url(' + item.album.images[0].url + ')'
        fl.style.backgroundSize = 'cover'
        fl.style.backgroundRepeat = 'no-repeat'
    } else if (await item.album.images[0].url && !item.preview_url) {
        fl.style.backgroundImage = 'url(' + item.album.images[0].url + ')'
        fl.style.backgroundSize = 'cover'
        fl.style.backgroundRepeat = 'no-repeat'
        fl.style.opacity = .5
    } else if (await !item.album.images[0].url && item.preview_url) {
        fl.style.backgroundColor = 'grey'
    } else {
        fl.style.backgroundColor = 'grey'
        fl.style.opacity = .5
    }
    if (await item.preview_url) {
        fl.onmouseover = mouseover2play
        fl.onmouseleave = mouseleave2stop
        let fa = document.createElement('audio')
        fa.src = item.preview_url
        fl.appendChild(fa)
    }
    start.appendChild(fl)
    let middle = document.createElement('div')
    middle.style.width = '50%'
    middle.style.textAlign = 'left'
    middle.style.marginLeft = '10px'
    let middle1 = document.createElement('div')
    middle1.innerText = item.name
    middle.appendChild(middle1)
    let middle2 = document.createElement('div')
    middle2.style.display = 'flex'
    middle2.style.alignItems = 'center'
    await artname(item.artists, middle2, tracks)
    // for await (let art of item.artists) {
    //     let art1 = document.createElement('div')
    //     art1.style.marginRight = '4px'
    //     art1.style.marginLeft = '4px'
    //     art1.style.cursor = 'pointer'
    //     // art1.onclick = "deeperartist('yourplaylists',art,d,1,false,'playlisttrack')"
    //     art1.innerText = art.name
    //     middle2.appendChild(art1)
    // }
    let middletype = document.createElement('div')
    middletype.innerText = 'From the ' + `${item['album']['album_type']}` + ' ' + `${item['album']['name']}`
    middle.appendChild(middletype)
    middle.appendChild(middle2)
    let midspan = document.createElement('span')
    midspan.style.color = 'rgb(240, 55, 165)'
    midspan.innerText = 'Recommended songs based on this'
    midspan.onclick = () => seedTracks(item.id, tracks)
    // midspan.onclick = seedTracks('yourplaylists',d.track,1,'playlisttrack','d'+ d.id)
    middle.appendChild(midspan)
    let dvv = document.createElement('div')
    let openinspotify = document.createElement('a')
    openinspotify.href = item['external_urls']['spotify']
    openinspotify.target = '_blank'
    let btn = document.createElement('button')
    btn.className = 'button'
    btn.innerText = 'Open is Spotify'
    openinspotify.appendChild(btn)
    dvv.appendChild(openinspotify)
    middle.appendChild(dvv)
    start.appendChild(middle)
    for await (let art of item.artists) {
        let pl = document.createElement('div')
        pl.className = 'artist-cirle con3'
        pl.onclick = () => deep_artist(tracks, art, false, 'trackartist')
        await artist(art['id']).then(async (response) => {
            // pl.onclick = "deeperartist('yourplaylists',art,d,1,false,'playlisttrack')"
            if (await response.data.images[0].url && item.preview_url) {
                pl.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                pl.style.backgroundSize = 'cover'
                pl.style.backgroundRepeat = 'no-repeat'
            } else if (await response.data.images[0].url && !item.preview_url) {
                pl.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                pl.style.opacity = .5
                pl.style.backgroundSize = 'cover'
                pl.style.backgroundRepeat = 'no-repeat'
            } else if (await !response.data.images[0].url && item.preview_url) {
                pl.style.backgroundColor = 'grey'
            } else {
                pl.style.backgroundColor = 'grey'
                pl.style.opacity = .5
            }
        })
        if (await item.preview_url) {
            pl.onmouseover = mouseover2play
            pl.onmouseleave = mouseleave2stop
            let pa = document.createElement('audio')
            pa.src = item.preview_url
            pl.appendChild(pa)
        }
        let pl2 = document.createElement('div')
        pl2.style.float = 'left'
        pl2.style.position = 'absolute'
        pl2.style.fontSize = '0.7em'
        pl2.innerText = art.name
        pl.appendChild(pl2)
        start.appendChild(pl)
    }
    tracks.appendChild(start)
    window.scrollTo({
        top: findPos(start),
        behavior: 'smooth'
    });
}
async function deeperTracks2(tracks, item,d, flag, sib) {
    item.images = d.images
    if (await sib) {
        let alltop = document.querySelectorAll('.rectrack > div.' + sib)
        let current = alltop[alltop.length - 1].nextElementSibling
        while (await current != null) {
            // console.log(current)
            current.style.display = 'none'
            if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none') {
                current = current.nextElementSibling
            } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none') {
                current = current.nextElementSibling.nextElementSibling
            } else if (current.nextElementSibling === null) {
                current = null
            }

        }
    }
    if (await document.getElementById('d' + item.id)) {
        document.getElementById('d' + item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('d'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
    }
    let start = document.createElement('div')
    start.className = "playlisttrack card2"
    start.id = `d` + item.id
    start.style.display = 'flex'
    start.style.marginTop = '12px'
    start.style.marginBottom = '6px'

    let fl = document.createElement('div')
    fl.className = "con3"
    if (await item.images[0].url && item.preview_url) {
        fl.style.backgroundImage = 'url(' + item.images[0].url + ')'
        fl.style.backgroundSize = 'cover'
        fl.style.backgroundRepeat = 'no-repeat'
    } else if (await item.images[0].url && !item.preview_url) {
        fl.style.backgroundImage = 'url(' + item.images[0].url + ')'
        fl.style.backgroundSize = 'cover'
        fl.style.backgroundRepeat = 'no-repeat'
        fl.style.opacity = .5
    } else if (await !item.images[0].url && item.preview_url) {
        fl.style.backgroundColor = 'grey'
    } else {
        fl.style.backgroundColor = 'grey'
        fl.style.opacity = .5
    }
    if (await item.preview_url) {
        fl.onmouseover = mouseover2play
        fl.onmouseleave = mouseleave2stop
        let fa = document.createElement('audio')
        fa.src = item.preview_url
        fl.appendChild(fa)
    }
    start.appendChild(fl)
    let middle = document.createElement('div')
    middle.style.width = '50%'
    middle.style.textAlign = 'left'
    middle.style.marginLeft = '10px'
    let middle1 = document.createElement('div')
    middle1.innerText = item.name
    middle.appendChild(middle1)
    let middle2 = document.createElement('div')
    middle2.style.display = 'flex'
    middle2.style.alignItems = 'center'
    await artname(item.artists, middle2, tracks)
    let middletype = document.createElement('div')
    middletype.innerText = 'From the ' + `${d['album_type']}` + ' ' + `${item['name']}`
    middle.appendChild(middletype)
    middle.appendChild(middle2)
    let midspan = document.createElement('span')
    midspan.style.color = 'rgb(240, 55, 165)'
    midspan.innerText = 'Recommended songs based on this'
    midspan.onclick = () => seedTracks(item.id, tracks)
    // midspan.onclick = seedTracks('yourplaylists',d.track,1,'playlisttrack','d'+ d.id)
    middle.appendChild(midspan)
    let dvv = document.createElement('div')
    let openinspotify = document.createElement('a')
    openinspotify.href = item['external_urls']['spotify']
    openinspotify.target = '_blank'
    let btn = document.createElement('button')
    btn.className = 'button'
    btn.innerText = 'Open is Spotify'
    openinspotify.appendChild(btn)
    dvv.appendChild(openinspotify)
    middle.appendChild(dvv)
    start.appendChild(middle)
    for await (let art of item.artists) {
        let pl = document.createElement('div')
        pl.className = 'artist-cirle con3'
        pl.onclick = () => deep_artist(tracks, art, false, 'trackartist')
        await artist(art['id']).then(async (response) => {
            // pl.onclick = "deeperartist('yourplaylists',art,d,1,false,'playlisttrack')"
            if (await response.data.images[0].url && item.preview_url) {
                pl.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                pl.style.backgroundSize = 'cover'
                pl.style.backgroundRepeat = 'no-repeat'
            } else if (await response.data.images[0].url && !item.preview_url) {
                pl.style.backgroundImage = `url(${response.data['images'][0]['url']})`
                pl.style.opacity = .5
                pl.style.backgroundSize = 'cover'
                pl.style.backgroundRepeat = 'no-repeat'
            } else if (await !response.data.images[0].url && item.preview_url) {
                pl.style.backgroundColor = 'grey'
            } else {
                pl.style.backgroundColor = 'grey'
                pl.style.opacity = .5
            }
        })
        if (await item.preview_url) {
            pl.onmouseover = mouseover2play
            pl.onmouseleave = mouseleave2stop
            let pa = document.createElement('audio')
            pa.src = item.preview_url
            pl.appendChild(pa)
        }
        let pl2 = document.createElement('div')
        pl2.style.float = 'left'
        pl2.style.position = 'absolute'
        pl2.style.fontSize = '0.7em'
        pl2.innerText = art.name
        pl.appendChild(pl2)
        start.appendChild(pl)
    }
    tracks.appendChild(start)
    window.scrollTo({
        top: findPos(start),
        behavior: 'smooth'
    });
}

async function seedTracks(item, tracks, sib, child) {
    let alltop = document.querySelectorAll('.rectrack > div.' + sib)
    if (child) {
        let par = document.getElementById(child).nextElementSibling
        // console.log(par)
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    } else if (sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
        let par = alltop[alltop.length - 1].nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    }
    if (document.getElementById('st' + item.id)) {
        document.getElementById('st' + item.id).style.display = 'flex'
        setTimeout(() => {
            window.scrollTo({
                top: (document.getElementById('st' + item.id)).offsetTop,
                behavior: 'smooth'
            });
        }, 10);
        return
    }
    request({
        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item.id + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let rstracks = data['tracks']
        let rc = document.createElement('div')
        rc.className = 'seed_tracks card2'
        rc.id = 'st' + item.id
        let r1 = document.createElement('div')
        r1.innerText = 'Recommended songs based on ' + item.name
        rc.appendChild(r1)
        let r2 = document.createElement('div')
        r2.className = 'card2'
        rc.appendChild(r2)
        for await(const rst of rstracks) {
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
            rd.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            rd.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            rd.addEventListener('click', function () {
                deeperTracks(tracks, rst, false, 'seed_tracks')
            })
            rd.appendChild(ra)
            r2.appendChild(rd)
        }
        tracks.appendChild(rc)
    }).catch((error) => {

    })
}

async function seedArtists(tracks, item, sib, child) {
    let alltop = document.querySelectorAll('.rectrack > div.' + sib)
    if (await child) {
        let par = document.getElementById(child).parentElement.nextElementSibling
        // console.log(par)
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    } else if (await sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
        let par = alltop[alltop.length - 1].nextElementSibling
        while (par != null) {
            par.style.display = 'none'
            if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                par = par.nextElementSibling
            } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                par = par.nextElementSibling.nextElementSibling
            } else if (par.nextElementSibling === null) {
                par = null
            }
        }
    }
    if (await document.getElementById('sa' + item.id)) {
        document.getElementById('sa' + item.id).style.display = 'flex'
        setTimeout(() => {
            window.scrollTo({
                top: (document.getElementById('sa' + item.id)).offsetTop,
                behavior: 'smooth'
            });
        }, 10);
        return
    }
    request({
        url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item.id + '&limit=50&offset=0&market=' + localStorage.getItem('country'),
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }).then(async (response) => {
        let data = response.data
        let rstracks = data['tracks']
        let rc = document.createElement('div')
        rc.className = 'seed_artists card2'
        rc.id = 'sa' + item.id
        let r1 = document.createElement('div')
        r1.innerText = 'Recommended songs based on ' + item.name
        rc.appendChild(r1)
        let r2 = document.createElement('div')
        r2.className = 'card2'
        rc.appendChild(r2)
        for await (const rst of rstracks) {
            let rd = document.createElement('div')
            rd.className = 'con3'
            rd.tabIndex = 0
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
            rd.addEventListener('mouseover', function (e) {
                mouseover2play(e)
            })
            rd.addEventListener('mouseleave', function (e) {
                mouseleave2stop(e)
            })
            rd.addEventListener('click', function () {
                deeperTracks(tracks, rst, false, 'seed_artists')
            })
            rd.appendChild(ra)
            r2.appendChild(rd)
        }
        tracks.appendChild(rc)
    })
}

async function thesoundof(pointer, name, num, sib, child) {
    let value = 'The Sound of ' + name.toUpperCase()
    let neww = this.titleCase(name)
    let newvalue = 'The Sound of ' + neww
    console.log(await titleCase(name))
    console.log(newvalue)
    request({
        url: 'https://api.spotify.com/v1/search/?q=' + newvalue + '&type=playlist&limit=5',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
    })
        .then(async (response) => {
            let playlists = response.data['playlists']['items']
            let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
            console.log(first)
            let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
            console.log(second)
            const finded = new Promise(function (resolve, reject) {
                let first = playlists.find(playlists => playlists.name === newvalue && playlists.owner.id === 'thesoundsofspotify')
                let second = playlists.find(playlists => playlists.name === value && playlists.owner.id === 'thesoundsofspotify')
                if (first) {
                    resolve(first)
                } else if (second) {
                    resolve(second)
                } else {
                    reject(null)
                }
            })
            finded.then((finded => {
                let alltop = document.querySelectorAll(' .item-container > .rectrack > div.hcontent > div.' + sib)
                // console.log(child)
                if (child) {
                    let par = document.getElementById(child).parentElement.nextElementSibling
                    // console.log(par)
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                } else if (sib !== false && alltop[alltop.length - 1].nextElementSibling !== null) {
                    let par = alltop[alltop.length - 1].nextElementSibling
                    while (par != null) {
                        par.style.display = 'none'
                        if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none') {
                            par = par.nextElementSibling
                        } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none') {
                            par = par.nextElementSibling.nextElementSibling
                        } else if (par.nextElementSibling === null) {
                            par = null
                        }
                    }
                }
                if (document.getElementById('p' + finded.id)) {
                    document.getElementById('p' + finded.id).style.display = 'flex'
                    return
                }

                let playlist = []
                // console.log('237' + playlists[i].id)
                request({
                    url: 'https://api.spotify.com/v1/playlists/' + finded.id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                })
                    .then((response) => {
                        // console.log(response.data['tracks'])
                        let tracks = response.data['tracks']
                        if (tracks['items'][0]['track']['preview_url']) {
                            finded.preview_url = tracks['items'][0]['track']['preview_url']
                        }
                        finded.tracks = tracks
                        playlist = finded
                        playlist.type = 'deeperplaylist'
                    })
            }))

        }).catch(error => {
    })
}

function titleCase(str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

function filterres(event) {
    let input = event.target
    let filter = input.value.toUpperCase();
    let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.head) > div.pl > div');

    for (let i = 0; i < pl.length; i++) {
        if (pl[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            pl[i].style.display = "block";
        } else {
            pl[i].style.display = "none";
        }
    }
}

function hideall(elem) {
    let all = document.querySelectorAll('.item-container > .rectrack')
    for (let i of all) {
        if (i === elem) {
            i.style.display = 'block'
            i.children[0].style.display = 'block'
        } else {
            i.style.display = 'none'
        }
    }
}

function SpotInit(event) {
    let id = event.currentTarget.id
    request({
        url: 'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
    })
        .then((response) => {
            let data = response.data
        })
}
