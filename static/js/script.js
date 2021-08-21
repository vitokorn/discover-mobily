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
          console.log('58 ' + id)
          let url = 'https://api.spotify.com/v1/playlists/' + id + '?fields=name,id,description,images,tracks(items(track(name,preview_url,id,artists,album(album_type,artists,id,images,name))))'
          console.log('60 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              console.log('68 ' + data)
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
              playlistdiv.appendChild(plid)
              let names = document.createElement('div')
              names.innerText = name
              names.className = 'con4'
              plid.appendChild(names)
              let descriptions = document.createElement('div')
              descriptions.innerText = description
              descriptions.style.width = '60%'
              descriptions.style.display = 'flex'
              descriptions.style.alignItems = 'center'
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
              trid.id = 't_' + id
              trid.className = 'con2'
              tracks.appendChild(trid)
              let i = 0
              for (const pla of playtrack) {
                let d = document.createElement('div')
                d.setAttribute('data-target',i++)
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
                  if (document.getElementById('expand' + `${pla['track']['id']}`)!= null){
                    document.getElementById('expand' + `${pla['track']['id']}`).style.display = 'block'
                    let allTracks = document.querySelectorAll('[id^=expand]');
                    if (allTracks != null) {
                      for (let i = 0; i < allTracks.length; i++) {
                        if (document.getElementById('expand' + `${pla['track']['id']}`) !=null && allTracks[i].id == document.getElementById('expand' + `${pla['track']['id']}`).id){

                        } else{
                          allTracks[i].style.display = 'none'
                        }
                    }
                    }

                  }
                  else {
                    let allTracks = document.querySelectorAll('[id^=expand]');
                    if (allTracks != null) {
                      for (let i = 0; i < allTracks.length; i++) {
                        if (document.getElementById('expand' + `${pla['track']['id']}`) !=null && allTracks[i].id == document.getElementById('expand' + `${pla['track']['id']}`).id){

                        } else{
                          allTracks[i].style.display = 'none'
                        }


                    }
                      deeper(pla, d, 'playlist',trid,id,`${pla['track']['id']}`)
                    }


                  }

                  // insertAfterf(tracks[tar])
                })

                trid.appendChild(d)
              }

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
              if (tracksid[i].getAttribute("data-target") == ns.getAttribute("data-target")) {
              } else {
                // console.log('282 ' + ns.id)
                ns.classList.remove('con3active')
              }
            });
          });
        }


            } else if (xhr.status === 401) {
              let url = '/spotify/refresh_token/' + localStorage.getItem('username');
              let xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  initElement(id)
                }
              }
            }
          }
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
          let url = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term'
          console.log('308 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
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
                  let info = document.createElement('div')
                  info.style.display = 'flex'
                  info.style.width = '100%'
                  info.style.marginTop = '12px'
                  info.style.marginBottom = '6px'
                  info.className = 'rectrack'
                  deep_artist(artis, it,info)
                })
                artis.appendChild(d)
              }

              console.log('178 ' + data)
            } else if (xhr.status === 401) {
              let url = '/spotify/refresh_token/' + localStorage.getItem('username');
              let xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('187')
                  topartistst()
                }
              }
            }
          }
        }

        function topartistst6() {
          let url = 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term'
          console.log('204 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
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
                artisttrack(`${it['id']}`, 'al', function(e) {
                  if (e != null) {
                    a.src = e
                  } else {
                    d.style.opacity = '.5'
                  }
                  return e
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
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
                })
                artis.appendChild(d)
              }


            }
            document.getElementById('artists').style.display = 'none'
            document.getElementById('artists6').style.display = 'flex'
            document.getElementById('artistsall').style.display = 'none'
          }
        }

        function topartiststall() {
          let url = 'https://api.spotify.com/v1/me/top/artists?time_range=long_term'
          console.log('228 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
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
                artisttrack(`${it['id']}`, 'al', function(e) {
                  if (e != null) {
                    a.src = e
                  } else {
                    d.style.opacity = '.5'
                  }
                  return e
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
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
                })
                artis.appendChild(d)
              }



            }
            document.getElementById('artists').style.display = 'none'
            document.getElementById('artists6').style.display = 'none'
            document.getElementById('artistsall').style.display = 'flex'
          }
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
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {}
              }
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
              let url = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('187')
                  topartistst()
                }
              }
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
          let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term'
          console.log('314 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              let tracks = document.getElementById('toptrack')
              tracks.innerHTML = ''
              let playtrack = data['items']
              console.log('325 ' + playtrack)
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
                  deeper(pla, tracks, 'tt')
                })
                tracks.appendChild(d)
              }
              document.getElementById('toptrack').style.display = 'flex'
              document.getElementById('toptrack6').style.display = 'none'
              document.getElementById('toptrackat').style.display = 'none'
            } else if (xhr.status === 401) {
              let url = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  topttracks()
                }
              }
            }
          }
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
          let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term'
          console.log('361 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
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
                })
                tracks.appendChild(d)
              }
              document.getElementById('toptrack6').style.display = 'flex'
              document.getElementById('toptrack').style.display = 'none'
              document.getElementById('toptrackat').style.display = 'none'
            }
          }
        }

        function topttracksall() {
          let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term'
          console.log('392 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
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
                })
                tracks.appendChild(d)
              }
              document.getElementById('toptrackat').style.display = 'flex'
              document.getElementById('toptrack').style.display = 'none'
              document.getElementById('toptrack6').style.display = 'none'
            }
          }
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
          let url = 'https://api.spotify.com/v1/me/albums'
          console.log('424 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              let albums = document.getElementById('savedalbum')
              albums.innerHTML = ''
              let savedalbum = data['items']
              console.log('435 ' + savedalbum)
              let elem = []
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
                })
                albums.appendChild(d)
              }
              console.log('446 ' + data)
            }
          }
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
          let url = 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50'
          console.log('456 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              console.log('464 ' + data)
              let items = data['items']
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
                })
                document.getElementById('savedtrack').appendChild(d)
              }
              if (items.length > 0) {
                sendRequest(offset + 50)


              }
            } else {
              console.log('xhr status 277 ' + xhr.status)
            }
          }
        }
        document.getElementById('followedartists').addEventListener('click', function() {
          if (document.getElementById('followedartist').hasChildNodes() === true) {
            document.getElementById('followedartist').style.display = 'flex'
          } else {
            getfollowedartist()
          }
        })

        function getfollowedartist() {
          let url = 'https://api.spotify.com/v1/me/following?type=artist&limit=50'
          console.log('228 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              let artis = document.getElementById('followedartist')
              let items = data['artists']['items']
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
                followedartist(`${it['id']}`, function(e) {
                  if (e != null) {
                    a.src = e
                  } else {
                    d.style.opacity = '.5'
                  }
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
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
                })
                artis.appendChild(d)

              }
              console.log('243 ' + data)

            }
          }
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
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  followedartist(id)
                }
              }
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
          let url = 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset
          console.log('738 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              let items = data['albums']['items']
              let elem = []
              for (const it of items) {
                elem.push(`${it['id']}`)
                // elem.push(`<div class="con3" tabindex="0" id=nr_${it['id']} onclick="playtrackat('${it['id']}','nr')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="nra_${it['id']}">${newrelease(it['id'])}</audio></div>`)
              }
              newrelease(elem, offset)
              console.log('766 ' + elem)
              //   nr.innerHTML = elem.join(' ')
              // console.log('753 ' + data)

            }
          }
        }

        function newrelease(elem, offset) {
          let url = 'https://api.spotify.com/v1/albums?ids=' + elem
          let nr = document.getElementById('newrelease')
          console.log('712 ' + url)
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(this.response)
              let items = data['albums']
              for (const it of items) {
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
                })
                nr.appendChild(d)
              }
              if (items.length > 0) {
                getnewrelease(offset + 20)
              } else if (offset == 100) {}
            } else if (xhr.status === 401) {
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  followedartist(id)
                }
              }
            }
          }
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
            let url = 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5'
            console.log('712 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function() {
              if (xhr.status === 200) {
                let songs = document.getElementById('s1')
                let arti = document.getElementById('ar1')
                let albu = document.getElementById('al1')
                let play = document.getElementById('p1')
                let data = JSON.parse(this.response)
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
                    let target = e.target
                    let audios = target.firstChild.lastChild
                    for (let i = 0; i < allaudio.length; i++) {
                      if (allaudio[i] == e.target.firstChild.lastChild) {

                      } else {
                        allaudio[i].pause()
                      }
                    }

                    if (audios.paused == false) {
                      audios.pause()
                    } else {
                      audios.play()
                    }
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
                    let target = e.target
                    let audios = target.firstChild.lastChild
                    for (let i = 0; i < allaudio.length; i++) {
                      if (allaudio[i] == e.target.firstChild.lastChild) {

                      } else {
                        allaudio[i].pause()
                      }
                    }

                    if (audios.paused == false) {
                      audios.pause()
                    } else {
                      audios.play()
                    }
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
                    let target = e.target
                    let audios = target.firstChild.lastChild
                    for (let i = 0; i < allaudio.length; i++) {
                      if (allaudio[i] == e.target.firstChild.lastChild) {

                      } else {
                        allaudio[i].pause()
                      }
                    }

                    if (audios.paused == false) {
                      audios.pause()
                    } else {
                      audios.play()
                    }
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
                    let target = e.target
                    let audios = target.firstChild.lastChild
                    for (let i = 0; i < allaudio.length; i++) {
                      if (allaudio[i] == e.target.firstChild.lastChild) {

                      } else {
                        allaudio[i].pause()
                      }
                    }

                    if (audios.paused == false) {
                      audios.pause()
                    } else {
                      audios.play()
                    }
                  })
                  main.appendChild(d)
                  d1.appendChild(d2)
                  main.appendChild(d1)
                  songs.appendChild(main)
                }
              } else if (xhr.status === 401) {
                let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                let xhr = new XMLHttpRequest()
                xhr.open('GET', curl, true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function() {
                  if (xhr.status === 200) {
                    console.log('errr')
                  }
                }
              }
            }
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
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('967 errr')
                }
              }
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
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('1001 errr')
                }
              }
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
              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', curl, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  console.log('1001 errr')
                }
              }
            }
          }

        }
function deeper(pla, tracks, type,trid,id,tid) {
          let block = document.createElement('div')
  block.className = 'expanded'
          block.style.display = 'block'
          block.style.width = '100%'
          if (type == 'playlist') {
            let info = document.createElement('div')
            info.style.width = '100%'
            block.id = 'expand' + tid
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
            })
            let trackinfo = document.createElement('div')
            trackinfo.style.width = '50%'
            trackinfo.style.marginLeft = '10px'
            trackinfo.innerText = `${pla['track']['name']}`
            let tracktype = document.createElement('div')
            tracktype.style.color = 'white'
            tracktype.innerText = 'From the ' + `${pla['track']['album']['album_type']}` + ' ' + `${pla['track']['album']['name']}`
            let trackartist = document.createElement('div')
            // let arrr = []
            let pta = pla['track']['artists']
            for (const ar of pla['track']['artists']) {
              let last = pta[pta.length - 1]
              let first = pta[0]
              let second = pta[1]
              console.log('1610 ' + last)
              if (first['name'] == last['name']){
                let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else if (second['name'] == last['name']) {
              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
}} else {
                              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name'] + ', '
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)}
              }
            }
            // trackartist.innerText = 'By ' + `${list2(arrr)}`
            let recomend = document.createElement('span')
            recomend.innerText = 'Recomended songs based on this'
            recomend.style.color = '#f037a5'
            recomend.addEventListener('click', function() {
              if (document.getElementById('rec_' + pla['track']['id'])) {
                document.getElementById('rec_' + pla['track']['id']).style.display = 'flex'
              } else {
                let url = 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['track']['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country')
                let xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function() {
                  if (xhr.status === 200) {
                    let data = JSON.parse(xhr.response)
                    let rstracks = data['tracks']
                    let rc = document.createElement('div')
                    rc.className = 'con2'
                    rc.id = 'rec_' + pla['track']['id']
                    let i = 0
                    for (const rst of rstracks) {
                      let rd = document.createElement('div')
                      rd.tabIndex = 0
                      rd.setAttribute('data-target',i++)
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
                })
                      rd.appendChild(ra)
                      rc.appendChild(rd)
                      block.after(block,rc)
                      // tracks.appendChild(rc)
                    }
                  }
                }
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
            block.appendChild(info)

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
              t.after(t,block)
            } else if (allFlexItems[insertAfter] !== undefined) {
              let t = document.querySelector('div[data-target="' + insertAfter + '"]')
              if (t == null){
                let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
                t.after(t,block)
              } else {
                t.after(t, block)
              }

            }
            window.addEventListener('resize',function (event){
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
              t.after(t,block)
            } else if (allFlexItems[insertAfter] !== undefined) {
              let t = document.querySelector('div[data-target="' + insertAfter + '"]')
              if (t == null){
                let t = document.querySelectorAll(`#t_${id} > div:last-child`)[0]
                t.after(t,block)
              } else {
                t.after(t, block)
              }

            }

            })
            // info.scrollIntoView()
          } else if (type == 'tt') {
            console.log('1496 pla ' + pla)
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
            playable.addEventListener('mouseover', function(e) {
              let target = e.target
              let audios = target.lastChild
              audios.play()
            })
            playable.addEventListener('mouseleave', function(e) {
              let target = e.target
              let audios = target.lastChild
              audios.pause()
            })
            let trackinfo = document.createElement('div')
            trackinfo.style.width = '50%'
            trackinfo.style.marginLeft = '10px'
            trackinfo.innerText = `${pla['name']}`
            let tracktype = document.createElement('div')
            tracktype.innerText = 'From the ' + `${pla['album']['album_type']}` + ' ' + `${pla['album']['name']}`
            let trackartist = document.createElement('div')
            // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
            let pta = pla['artists']
            for (const ar of pla['artists']) {
              let last = pta[pta.length - 1]
              let first = pta[0]
              let second = pta[1]
              console.log('1610 ' + last)
              if (first['name'] == last['name']){
                let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else if (second['name'] == last['name']) {
              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
}} else {
                              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name'] + ', '
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)}
              }
            }
            let recomend = document.createElement('span')
            recomend.innerText = 'Recomended songs based on this'
            recomend.style.color = '#f037a5'
            recomend.addEventListener('click', function() {
              if (document.getElementById('rec_' + pla['id'])) {
                document.getElementById('rec_' + pla['id']).style.display = 'flex'
              } else {
                let url = 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country')
                let xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function() {
                  if (xhr.status === 200) {
                    let data = JSON.parse(xhr.response)
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
                })
                      rd.appendChild(ra)
                      rc.appendChild(rd)
                      tracks.appendChild(rc)
                    }
                  }
                }
              }
            })
            let artistcirle = document.createElement('div')
            for (const ar of pla['artists']) {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
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
            tracks.appendChild(info)
            info.scrollIntoView()
          } else if (type == 'nr') {
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
            playable.addEventListener('mouseover', function(e) {
              let target = e.target
              let audios = target.lastChild
              audios.play()
            })
            playable.addEventListener('mouseleave', function(e) {
              let target = e.target
              let audios = target.lastChild
              audios.pause()
            })
            let trackinfo = document.createElement('div')
            trackinfo.style.width = '50%'
            trackinfo.style.marginLeft = '10px'
            trackinfo.innerText = `${pla['name']}`
            let tracktype = document.createElement('div')
            tracktype.innerText = 'From the ' + `${pla['album_type']}` + ' ' + `${pla['name']}`
            let trackartist = document.createElement('div')
            // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
                        let pta = pla['artists']
            for (const ar of pla['track']['artists']) {
              let last = pta[pta.length - 1]
              let first = pta[0]
              let second = pta[1]
              console.log('1610 ' + last)
              if (first['name'] == last['name']){
                let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else if (second['name'] == last['name']) {
              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
}} else {
                              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name'] + ', '
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)}
              }
            }
            let recomend = document.createElement('span')
            recomend.innerText = 'Recomended songs based on this'
            recomend.style.color = '#f037a5'
            recomend.addEventListener('click', function() {
              if (document.getElementById('rec_' + pla['id'])) {
                document.getElementById('rec_' + pla['id']).style.display = 'flex'
              } else {
                let url = 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country')
                let xhr = new XMLHttpRequest()
                xhr.open('GET', url, true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function() {
                  if (xhr.status === 200) {
                    let data = JSON.parse(xhr.response)
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
                })
                      rd.appendChild(ra)
                      rc.appendChild(rd)
                      tracks.appendChild(rc)
                    }
                  }
                }
              }
            })
            let artistcirle = document.createElement('div')
            for (const ar of pla['artists']) {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
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
            tracks.appendChild(info)
            info.scrollIntoView()
          }
        }

        function deeperalbum(pla, tracks, el) {
          let info = document.createElement('div')
          info.style.display = 'flex'
          info.style.width = '100%'
          info.style.marginTop = '12px'
          info.style.marginBottom = '6px'
          info.className = 'rectrack'
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
          playable.addEventListener('mouseover', function(e) {
            let target = e.target
            let audios = target.lastChild
            audios.play()
          })
          playable.addEventListener('mouseleave', function(e) {
            let target = e.target
            let audios = target.lastChild
            audios.pause()
          })
          let trackinfo = document.createElement('div')
          trackinfo.style.width = '50%'
          trackinfo.style.marginLeft = '10px'
          trackinfo.innerText = `${el['name']}`
          let tracktype = document.createElement('div')
          if (pla['album']) {
            tracktype.innerText = 'From the ' + `${pla['album']['album_type']}` + ' ' + `${pla['album']['name']}`
          } else {
            tracktype.innerText = 'From the ' + `${pla['album_type']}` + ' ' + `${pla['name']}`
          }

          let trackartist = document.createElement('div')
          if (pla['album']) {
            // trackartist.innerText = 'By ' + `${list(pla['album']['artists'])}`
            let pta = pla['album']['artists']
            for (const ar of pla['album']['artists']) {
              let last = pta[pta.length - 1]
              let first = pta[0]
              let second = pta[1]
              console.log('1610 ' + last)
              if (first['name'] == last['name']){
                let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else if (second['name'] == last['name']) {
              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
}} else {
                              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name'] + ', '
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)}
              }
            }
          } else {
            // trackartist.innerText = 'By ' + `${list(pla['artists'])}`
            let pta = pla['artists']
            for (const ar of pla['artists']) {
              let last = pta[pta.length - 1]
              let first = pta[0]
              let second = pta[1]
              console.log('1610 ' + last)
              if (first['name'] == last['name']){
                let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else if (second['name'] == last['name']) {
              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
}} else {
                              if (ar['name'] == last['name']) {
                let artst = document.createElement('div')
              artst.innerText = ' & ' + ar['name']
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)
              } else {
              let artst = document.createElement('div')
              artst.innerText = ar['name'] + ', '
              artst.style.cursor = 'pointer'
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
                trackartist.appendChild(artst)}
              }
            }
          }

          let recomend = document.createElement('span')
          recomend.innerText = 'Recomended songs based on this'
          recomend.style.color = '#f037a5'
          recomend.addEventListener('click', function() {
            if (document.getElementById('rec_' + pla['id'])) {
              document.getElementById('rec_' + pla['id']).style.display = 'flex'
            } else {
              let url = 'https://api.spotify.com/v1/recommendations?seed_tracks=' + `${pla['id']}` + '&limit=50&offset=0&market=' + localStorage.getItem('country')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', url, true)
              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
              xhr.send()
              xhr.onload = function() {
                if (xhr.status === 200) {
                  let data = JSON.parse(xhr.response)
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
                    rd.addEventListener('mouseover', function(e) {
                      let target = e.target
                      let audios = target.lastChild
                      audios.play()
                    })
                    rd.addEventListener('mouseleave', function(e) {
                      let target = e.target
                      let audios = target.lastChild
                      audios.pause()
                    })
                    rd.appendChild(ra)
                    rc.appendChild(rd)
                    tracks.appendChild(rc)
                  }
                }
              }
            }
          })
          let artistcirle = document.createElement('div')
          if (pla['artist']) {
            for (const ar of pla['album']['artists']) {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
              artistcirle.appendChild(artst)
            }
          } else {
            for (const ar of pla['artists']) {
              let artst = document.createElement('div')
              artst.innerText = ar['name']
              artst.addEventListener('click', function() {
                deep_artist(tracks, ar,info)
              })
              artistcirle.appendChild(artst)
            }
          }

          playable.appendChild(playaudio)
          info.appendChild(playable)
          info.appendChild(trackinfo)
          info.appendChild(artistcirle)
          trackinfo.appendChild(tracktype)
          trackinfo.appendChild(trackartist)
          trackinfo.appendChild(recomend)
          tracks.after(tracks, info)

        }

        function deep_artist(tracks, ar,info) {
          const ab = document.createElement('div')
          let artinfo = document.createElement('div')
          artinfo.style.gridColumn = '3 / 8'
          ab.style.display = 'grid'
          ab.style.gridGap = '16px'
          ab.className = 'recartist'

          let arurl = 'https://api.spotify.com/v1/artists/' + ar['id']
          let arxhr = new XMLHttpRequest()
          arxhr.open('GET', arurl, true)
          arxhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          arxhr.send()
          arxhr.onload = function() {
            if (arxhr.status === 200) {
              let data = JSON.parse(arxhr.response)
              console.log('202' + data)
              let dv = document.createElement('div')
              dv.className = 'con3'
              dv.style.gridColumn = '1 / 3'
              dv.id = ar['id']
              dv.style.backgroundImage = `url(${data['images'][0]['url']})`
              dv.style.backgroundRepeat = 'no-repeat'
              dv.style.backgroundSize = 'cover'
              dv.addEventListener('click', function(e) {
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
              })

              artinfo.innerText = data['name']
              let af = document.createElement('div')
              af.innerText = data['followers']['total'] + ' followers'
              let ag = document.createElement('div')
              ag.innerText = data['genres']
              let arr = document.createElement('div')
              arr.innerText = 'Recomended songs based on this'
              arr.style.color = '#f037a5'
              arr.addEventListener('click', function() {

                  let url = 'https://api.spotify.com/v1/recommendations?seed_artists=' + data['id'] + '&limit=50&offset=0&market=' + localStorage.getItem('country')
                  let xhr = new XMLHttpRequest()
                  xhr.open('GET', url, true)
                  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                  xhr.send()
                  xhr.onload = function() {
                    if (xhr.status === 200) {
                      let data = JSON.parse(xhr.response)
                      let rstracks = data['tracks']
                      let rc = document.createElement('div')
                      rc.className = 'con2'
                      console.log('232' + ar['id'])
                      rc.id = 'recart_' + ar['id']
                      for (const rst of rstracks) {
                        let rd = document.createElement('div')
                        rd.tabIndex = 0
                        rd.style.display = 'inline-block'
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
                  }})
                        rd.appendChild(ra)
                        rc.appendChild(rd)
                        tracks.appendChild(rc)
                      }
                    }
                  }

              })
              ab.appendChild(dv)
              artinfo.appendChild(af)
              artinfo.appendChild(ag)
              artinfo.appendChild(arr)
              ab.appendChild(artinfo)
              console.log(JSON.stringify('204 ' + data['images'][0]['url']))
            }
          }
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
          let url = 'https://api.spotify.com/v1/artists/' + ar['id'] + '/top-tracks?limit=10&market=' + localStorage.getItem('country')
          let xhr = new XMLHttpRequest()
          xhr.open('GET', url, true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          xhr.send()
          xhr.onload = function() {
            if (xhr.status === 200) {
              let data = JSON.parse(xhr.response)
              let tt = document.createElement('audio')
              tt.src = data['tracks'][0]['preview_url']
              document.getElementById(ar['id']).appendChild(tt)

              let con = document.createElement('div')
              // con.style.display = 'flex'
              con.className = 'att col2'
              let i = 0
              for (const topt of data['tracks']) {
                let d = document.createElement('div')
                d.tabIndex = 0
                d.className = 'con3'
                d.setAttribute('data-target',i++)
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
                        // deeper(topt, tracks, 'tt')
                })
                con.appendChild(d)
                name.after(name, con)
                // grid.appendChild(con)
                ab.appendChild(grid)
              }
            }
          }
          let aurl = 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=album&limit=10'
          let axhr = new XMLHttpRequest()
          axhr.open('GET', aurl, true)
          axhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          axhr.send()
          axhr.onload = function() {
            if (axhr.status === 200) {
              let data = JSON.parse(axhr.response)
              if (data['items'].length == 0) {
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
                      deeperalbum(albus, tracks, fnn)
                    })
                  })
                  d.appendChild(a)
                  d.addEventListener('click', function(e) {
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
                  })
                  con.appendChild(d)
                  nme.after(nme, con)
                  // grid.appendChild(con)
                  ab.appendChild(grid)
                }
              }



              console.log(JSON.stringify(axhr.response))
            }
          }
          let turl = 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=single,compilation'
          let txhr = new XMLHttpRequest()
          txhr.open('GET', turl, true)
          txhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          txhr.send()
          txhr.onload = function() {
            if (txhr.status === 200) {
              let data = JSON.parse(txhr.response)
              if (data['items'].length == 0) {
                nm.remove()
              } else {
                let con = document.createElement('div')
                // con.style.display = 'flex'
                con.className = 'col2'

                for (const sing of data['items']) {
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
                  albumtracks(`${(sing['href'])}`, function(items) {
                    let fnn = (items.find(e => e.preview_url))
                    if (fnn != null) {
                      a.src = fnn.preview_url
                    } else {
                      d.style.opacity = '.5'
                    }
                    d.addEventListener('click', function() {
                      deeper(sing, tracks, 'nr')
                    })
                  })
                  d.appendChild(a)
                  d.addEventListener('click', function(e) {
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
                  })
                  con.appendChild(d)
                  nm.after(nm, con)
                  // grid.appendChild(con)
                  ab.appendChild(grid)
                }
              }

              console.log(JSON.stringify(txhr.response))
            }
          }
          let aourl = 'https://api.spotify.com/v1/artists/' + ar['id'] + '/albums?include_groups=appears_on'
          let aoxhr = new XMLHttpRequest()
          aoxhr.open('GET', aourl, true)
          aoxhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          aoxhr.send()
          aoxhr.onload = function() {
            if (aoxhr.status === 200) {
              let data = JSON.parse(aoxhr.response)
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
                      deeper(appear, tracks, 'nr')
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
              console.log(JSON.stringify(aoxhr.response))
            }
          }
          let rurl = 'https://api.spotify.com/v1/artists/' + ar['id'] + '/related-artists'
          let rxhr = new XMLHttpRequest()
          rxhr.open('GET', rurl, true)
          rxhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          rxhr.send()
          rxhr.onload = function() {
            if (rxhr.status === 200) {
              let data = JSON.parse(rxhr.response)
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
                artisttrack(`${ra['id']}`, function(e) {
                  if (e != null) {
                    a.src = e
                  } else {
                    d.style.opacity = '.5'
                  }
                  return e
                })
                d.appendChild(a)
                d.addEventListener('click', function(e) {
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
                  deep_artist(tracks, ra,info)
                })


                con.appendChild(d)
                area.appendChild(con)
                // grid.appendChild(con)
                ab.appendChild(area)
                console.log(JSON.stringify(rxhr.response))
              }
            }
          }
          let thurl = 'https://api.spotify.com/v1/search?q="this is ' + ar['name'] + '"&type=playlist&limit=50&offset=0&market=' + localStorage.getItem('country')
          let thxhr = new XMLHttpRequest()
          thxhr.open('GET', thurl, true)
          thxhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
          thxhr.send()
          thxhr.onload = function() {
            if (thxhr.status === 200) {
              let data = JSON.parse(thxhr.response)

              console.log(JSON.stringify(thxhr.response))
            }
          }
          info.after(info,ab)
          ab.scrollIntoView()
        }