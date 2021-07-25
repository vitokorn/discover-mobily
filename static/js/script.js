        let trlist = document.querySelectorAll("#tracks > div");
        for (let i = 0; i < trlist.length; i++) {
            trlist[i].addEventListener("click", function() {
                if (document.getElementById(trlist[i].id)){
                    document.getElementById(trlist[i].id).style.display = 'flex'
                    document.getElementById(trlist[i].id.replace('t_','p_')).style.display = 'flex'
                } else {
                    initElement(id)
                }
                trlist.forEach(function(ns) {
                    if (trlist[i] == ns){
                         console.log('test')
                    } else{
                        console.log('69 ' + ns.id)
                        document.getElementById('t_' + ns.id).style.display = 'none'
                        document.getElementById(ns.id.replace('t_','p_')).style.display = 'none'
                        ns.style.display = 'none'
                    }
                });
            });
        }
        function initElement(id) {
            console.log('58 ' + id)
            let url = 'https://api.spotify.com/v1/playlists/' + id + '?fields=name,id,description,images,tracks(items(track(name,preview_url,id,artists,album(artists,id,images))))'
            console.log('60 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
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
                    descriptions.className = 'con4'
                    plid.appendChild(descriptions)
                    let cover = document.createElement('div')
                    cover.className = 'con4'
                    cover.style.backgroundImage = "url('"+image+"')"
                    cover.style.backgroundRepeat = 'no-repeat'
                    cover.style.backgroundSize = 'cover'
                    plid.appendChild(cover)
                    let refresh = document.createElement('button')
                    refresh.id = 'refresh_' + id
                    refresh.className = 'refresh-end'
                    refresh.setAttribute("onclick","test('refresh_" + id + "')")
                    plid.appendChild(refresh)
                    let img = document.createElement('img')
                    img.id = 'icon_' + id
                    img.src = '../static/images/refresh-icon.svg'
                    img.height = 12
                    refresh.appendChild(img)
                    let elem = []
                    for (const pla of playtrack){
                        elem.push(`<div tabindex="0" class="con3" id=${pla['track']['id']} style="background-image: url(${pla['track']['album']['images'][0]['url']});background-repeat: no-repeat;background-size: cover" onclick="playtrack('${pla['track']['id']}')">${list(pla['track']['artists'])} -  ${pla['track']['name']}<audio type="audio/mpeg" preload="none" id="a_${pla['track']['id']}" src="${pla['track']['preview_url']}"></div>`)
                    }
                    let trid = document.createElement('div')
                    trid.id = 't_' + id
                    trid.className = 'con2'
                    tracks.appendChild(trid)
                    trid.innerHTML = elem.join(' ')
                    let zerosrc = document.querySelectorAll('[src=null]')
                    for (let z of zerosrc) {
                        let curr = z.id.replace('a_','')
                        document.getElementById(curr).style.opacity = '.5'
                    }

                } else if(xhr.status === 401){
                    let url = '/spotify/refresh_token/' + localStorage.getItem('username');
                    let xhr = new XMLHttpRequest()
                    xhr.open('GET',url,true)
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                    xhr.send()
                    xhr.onload = function (){
                        if (xhr.status === 200){
                            initElement(id)
                        }
                    }
                }
            }}

        function playtrack(id) {
              let all = document.querySelectorAll('[id^="a_"]');
              for (let elem of all) {
                  if (elem.id == 'a_' + id){

                  } else
                  elem.pause()
              }
              let lm = document.querySelectorAll('[id^="at_"]');
              for (let el of lm) {
                  el.pause()
              }
              let ls = document.querySelectorAll('[id^="ats_"]');
              for (let el of ls) {
                  el.pause()
              }
              let al = document.querySelectorAll('[id^="ata_"]');
              for (let el of al) {
                  el.pause()
              }
              let sa = document.querySelectorAll('[id^="sa_"]');
              for (let el of sa) {
                  el.pause()
              }

              let audiop = document.getElementById('a_' + id)
              if (audiop.paused == false){
                  audiop.pause()
              } else
                audiop.play();
          }
        function playtracksa(id) {
              let rt = document.querySelectorAll('[id^="a_"]');
              for (let el of rt) {
                  el.pause()
              }
              let lm = document.querySelectorAll('[id^="at_"]');
              for (let el of lm) {
                  el.pause()
              }
              let ls = document.querySelectorAll('[id^="ats_"]');
              for (let el of ls) {
                  el.pause()
              }
              let al = document.querySelectorAll('[id^="ata_"]');
              for (let el of al) {
                  el.pause()
              }
              let all = document.querySelectorAll('[id^="sa_"]');
              for (let elem of all) {
                  if (elem.id == 'sa_' + id){

                  } else
                  elem.pause()
              }
              let audiop = document.getElementById('sa_' + id)
              if (audiop.paused == false){
                  audiop.pause()
              } else
                audiop.play();
          }
        function playtrackat(id,type) {
              console.log('133 ' + id)
              let rt = document.querySelectorAll('[id^="a_"]');
              for (let elem of rt) {
                  elem.pause()
              }
              let sa = document.querySelectorAll('[id^="sa_"]');
              for (let elem of sa) {
                  elem.pause()
              }
              if (type == 'lm'){
              let all = document.querySelectorAll('[id^="at_"]');
              for (let elem of all) {
                  if (elem.id == 'at_' + id){

                  } else
                  elem.pause()
              }
              let audiop = document.getElementById('at_' + id)
              if (audiop.paused == false){
                  audiop.pause()
              } else
                audiop.play();
          } else if(type == 'ls') {
                  let all = document.querySelectorAll('[id^="ats_"]');
                  for (let elem of all) {
                      if (elem.id == 'at_' + id){

                      } else
                      elem.pause()
                  }
              let audiop = document.getElementById('ats_' + id)
              if (audiop.paused == false){
                  audiop.pause()
              } else
                audiop.play(); }
                else if (type == 'ata'){
                  let all = document.querySelectorAll('[id^="ata_"]');
                  for (let elem of all) {
                      if (elem.id == 'al_' + id){

                      } else
                      elem.pause()
                  }
                  let audiop = document.getElementById('ata_' + id)
                  if (audiop.paused == false){
                      audiop.pause()
                  } else
                    audiop.play();
                  }
          }
        function list(artists){
          const names = artists.map(({ name }) => name);
          const finalName = names.pop();
          return names.length
          ? names.join(', ') + ' & ' + finalName
          : finalName;
        }
        let pllist = document.querySelectorAll("#playlistlist > div");
            for (let i = 0; i < pllist.length; i++) {
             pllist[i].addEventListener("click", function() {
                 console.log('262 ' + pllist[i].id)
                 if (document.getElementById('t_' + pllist[i].id)){
                        console.log('258')
                    } else {
                     console.log(pllist[i].id)
                        initElement(pllist[i].id)
                    }
                 if (pllist[i].classList.contains("activetab")){

                 } else {
                     pllist[i].classList.toggle("activetab");
                 }
                 pllist.forEach(function(ns) {
                     console.log('279 ' + ns)
                     if (pllist[i].id == ns.id){
                        console.log('test')
                         if (document.getElementById('t_' + ns.id)){
                         document.getElementById('t_' + ns.id).style.display = 'flex'
                         document.getElementById('p_' + ns.id).style.display = 'flex'
                     }} else{
                         console.log('282 ' + ns.id)
                         ns.classList.remove('activetab')
                         if (document.getElementById('t_' + ns.id)){
                             document.getElementById('t_' + ns.id).style.display = 'none'
                             document.getElementById('p_' + ns.id).style.display = 'none'
                         }
                     }
            });
             });
         }
          document.getElementById('topartists').addEventListener('click',function (){
             document.getElementById('artists').style.display = 'flex'
             document.getElementById('artists6').style.display = 'none'
             document.getElementById('artistsall').style.display = 'none'
         })
        function topartistst () {
             if (document.getElementById('topartists').classList.contains("activetab")){

             } else{
                 document.getElementById('topartists').classList.toggle("activetab")
             }
            let url = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term'
            console.log('165 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let artis = document.getElementById('artists')
                    let items = data['items']
                    let elem = []
                      for (const it of items){
                          elem.push(`<div class="con3" tabindex="0" id=${it['id']} onclick="playtrackat('${it['id']}','lm')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="at_${it['id']}">${artisttrack(it['id'],'lm')}</audio></div>`)
                      }
                      artis.innerHTML = elem.join(' ')

                    console.log('178 ' + data)
                } else if(xhr.status === 401){
                      let url = '/spotify/refresh_token/' + localStorage.getItem('username');
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',url,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
                            console.log('187')
                            topartistst()
                }
            }
                  }
            }
        }
        document.getElementById('topartists6').addEventListener('click', function () {
            let url = 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term'
            console.log('204 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let artis = document.getElementById('artists6')
                    let items = data['items']
                    let elem = []
                      for (const it of items){
                          elem.push(`<div class="con3" tabindex="0" id=ls_${it['id']} onclick="playtrackat('${it['id']}','ls')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="ats_${it['id']}">${artisttrack(it['id'],'ls')}</audio></div>`)
                      }
                      artis.innerHTML = elem.join(' ')
                    console.log('219 ' + data)

                }    document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'flex'
                     document.getElementById('artistsall').style.display = 'none'
            }
        })
        document.getElementById('topartistsall').addEventListener('click', function () {
            let url = 'https://api.spotify.com/v1/me/top/artists?time_range=long_term'
            console.log('228 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let artis = document.getElementById('artistsall')
                    let items = data['items']
                    let elem = []
                      for (const it of items){
                          elem.push(`<div class="con3" tabindex="0" id=al_${it['id']} onclick="playtrackat('${it['id']}','al')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="ata_${it['id']}">${artisttrack(it['id'],'al')}</audio></div>`)
                      }
                      artis.innerHTML = elem.join(' ')
                    console.log('243 ' + data)

                }document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'none'
                     document.getElementById('artistsall').style.display = 'flex'
            }
        })
          const ta = document.querySelectorAll('[id^=topartists]');

         for (let i = 0; i < ta.length; i++) {
             ta[i].addEventListener("click", function() {
                 if (ta[i].classList.contains("activetab")){

                 } else {
                     ta[i].classList.toggle("activetab");
                 }
                 ta.forEach(function(ns) {
                     if (ta[i] == ns){
                        console.log('test')
                     } else{
                         ns.classList.remove('activetab')
                     }
            });
             });
         }
        function artisttrack(id,type){
             let url = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=' + localStorage.getItem('country')
            console.log('267 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let tracks = data['tracks']
                    let fnn = (tracks.find(e =>e.preview_url))
                    if (type == 'lm'){
                        if (fnn != null) {
                            console.log('270')
                            document.getElementById('at_' + id).setAttribute("type","audio/mpeg")
                            document.getElementById('at_' + id).setAttribute("sid",`${fnn['id']}`)
                            document.getElementById('at_' + id).setAttribute("src",`${fnn['preview_url']}`)
                        } else {
                            console.log(id)
                            document.getElementById(id).style.opacity = '.5'
                            document.getElementById('at_' + id).setAttribute("src","null")
                            document.getElementById(id).removeAttribute('onclick')
                            document.getElementById('at_' + id).innerText = ''}}
                    else if (type == 'ls'){
                        if (fnn != null) {
                        console.log('376')
                        document.getElementById('ats_' + id).setAttribute("type","audio/mpeg")
                        document.getElementById('ats_' + id).setAttribute("sid",`${fnn['id']}`)
                        document.getElementById('ats_' + id).setAttribute("src",`${fnn['preview_url']}`)
                    } else  {
                        console.log(id)
                        document.getElementById('ls_' + id).style.opacity = '.5'
                        document.getElementById('ats_' + id).setAttribute("src","null")
                        document.getElementById('ls_' + id).removeAttribute('onclick')
                        document.getElementById('ats_' + id).innerText = ''}}
                    else if (type == 'al'){
                    if (fnn != null) {
                        console.log('389')
                        document.getElementById('ata_' + id).setAttribute("type","audio/mpeg")
                        document.getElementById('ata_' + id).setAttribute("sid",`${fnn['id']}`)
                        document.getElementById('ata_' + id).setAttribute("src",`${fnn['preview_url']}`)
                    } else {
                        console.log(id)
                        document.getElementById('al_' + id).style.opacity = '.5'
                        document.getElementById('ata_' + id).setAttribute("src","null")
                        document.getElementById('al_' + id).removeAttribute('onclick')
                        document.getElementById('ata_' + id).innerText = ''}}}

                else if(xhr.status === 401){
                      let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',curl,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
                }
            }
                  }
            }
}
        function savedalbums(id){
              let url = 'https://api.spotify.com/v1/albums/' + id + '/tracks?market=' + localStorage.getItem('country') + '&limit=10'
            console.log('267 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let items = data['items']
                    let fnn = (items.find(e =>e.preview_url))
                        if (fnn != null) {
                            console.log('270')
                            document.getElementById('sa_' + id).setAttribute("type","audio/mpeg")
                            document.getElementById('sa_' + id).setAttribute("aid",`${fnn['id']}`)
                            document.getElementById('sa_' + id).setAttribute("src",`${fnn['preview_url']}`)
                        } else {
                            console.log(id)
                            document.getElementById(id).style.opacity = '.5'
                            document.getElementById('sa_' + id).setAttribute("src","null")
                            document.getElementById(id).removeAttribute('onclick')
                            document.getElementById('sa_' + id).innerText = ''}

                    console.log('178 ' + data)
                } else if(xhr.status === 401){
                      let url = '/spotify/refresh_token/' + localStorage.getItem('username')
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',url,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
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
                                  if (tt[i].classList.contains("activetab")){
                 } else {
                     tt[i].classList.toggle("activetab");
                 }
                 tt.forEach(function(nst) {
                     if (tt[i] == nst){
                        console.log('test')
                     } else{
                         nst.classList.remove('activetab')
                     }
            });
             });
         }
        function topttracks () {
            document.getElementById('toptracks').classList.toggle("activetab")
            let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term'
            console.log('314 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let tracks = document.getElementById('toptrack')
                      tracks.innerHTML = ''
                      let playtrack = data['items']
                      console.log('325 ' + playtrack)
                      let elem = []
                      for (const pla of playtrack){
                          elem.push(`<div class="con3" tabindex="0" id=${pla['id']} style="background-image: url(${pla['album']['images'][1]['url']});background-repeat: no-repeat;background-size: cover" onclick="playtrack('${pla['id']}')">${list(pla['artists'])} -  ${pla['name']}<audio type="audio/mpeg" preload="none" id="a_${pla['id']}" src="${pla['preview_url']}"></div>`)
                      }
                      tracks.innerHTML = elem.join(' ')
                    document.getElementById('toptrack').style.display = 'flex'
                    document.getElementById('toptrack6').style.display = 'none'
                    document.getElementById('toptrackat').style.display = 'none'
                      let zerosrc = document.querySelectorAll('[src=null]')
                      for (let z of zerosrc) {
                          let curr = z.id.replace('a_','')
                          document.getElementById(curr).style.opacity = '.5'
                      }
                    console.log('339' + data)
                } else if(xhr.status === 401){
                      let url = '/spotify/refresh_token/' + localStorage.getItem('username')
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',url,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
                            topttracks()
                }
            }
                  }
            }
        }
         document.getElementById('toptracks').addEventListener('click',function (){
             document.getElementById('toptrack').style.display = 'flex'
             document.getElementById('toptrack6').style.display = 'none'
             document.getElementById('toptrackat').style.display = 'none'
         })
        document.getElementById('toptrackssix').addEventListener('click', function () {
            let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term'
            console.log('361 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let tracks = document.getElementById('toptrack6')
                      tracks.innerHTML = ''
                      let playtrack = data['items']
                      console.log('372 ' + playtrack)
                      let elem = []
                      for (const pla of playtrack){
                          elem.push(`<div class="con3" tabindex="0" id=${pla['id']} style="background-image: url(${pla['album']['images'][1]['url']});background-repeat: no-repeat;background-size: cover" onclick="playtrack('${pla['id']}')"> ${list(pla['artists'])} -  ${pla['name']}<audio type="audio/mpeg" preload="none" id="a_${pla['id']}" src="${pla['preview_url']}"></div>`)
                      }
                      tracks.innerHTML = elem.join(' ')
                    document.getElementById('toptrack6').style.display = 'flex'
                    document.getElementById('toptrack').style.display = 'none'
                    document.getElementById('toptrackat').style.display = 'none'
                      let zerosrc = document.querySelectorAll('[src=null]')
                      for (let z of zerosrc) {
                          let curr = z.id.replace('a_','')
                          document.getElementById(curr).style.opacity = '.5'
                      }
                    console.log('386 ' + data)
                }
            }
        })
        document.getElementById('toptracksall').addEventListener('click', function () {
            let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term'
            console.log('392 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let tracks = document.getElementById('toptrackat')
                      tracks.innerHTML = ''
                      let playtrack = data['items']
                      console.log('403' + playtrack)
                      let elem = []
                      for (const pla of playtrack){
                          elem.push(`<div class="con3" id=${pla['id']} style="background-image: url(${pla['album']['images'][1]['url']});background-repeat: no-repeat;background-size: cover" onclick="playtrack('${pla['id']}')"><div tabindex="0" class="text"> ${list(pla['artists'])} -  ${pla['name']}</div><audio type="audio/mpeg" preload="none" id="a_${pla['id']}" src="${pla['preview_url']}"></div>`)
                      }
                      tracks.innerHTML = elem.join(' ')
                    document.getElementById('toptrackat').style.display = 'flex'
                    document.getElementById('toptrack').style.display = 'none'
                    document.getElementById('toptrack6').style.display = 'none'
                      let zerosrc = document.querySelectorAll('[src=null]')
                    console.log('413' + zerosrc)
                      for (let z of zerosrc) {
                          console.log('509 ' + z.id)
                          let curr = z.id.replace('a_','')
                          document.getElementById(curr).style.opacity = '.5'
                      }
                    console.log('418 ' + data)
                }
            }
        })
        function saved_albums () {
            let url = 'https://api.spotify.com/v1/me/albums'
            console.log('424 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let albums = document.getElementById('savedalbum')
                    albums.innerHTML = ''
                    let savedalbum = data['items']
                    console.log('435 ' + savedalbum)
                    let elem = []
                    for (const sa of savedalbum){
                          elem.push(`<div class="con3" tabindex="0" id=${sa['album']['id']} onclick="playtracksa('${sa['album']['id']}')" style="background-image: url(${sa['album']['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${sa['album']['name']}<audio id="sa_${sa['album']['id']}">${savedalbums(sa['album']['id'])})</audio></div>`)
                      }
                    albums.innerHTML = elem.join(' ')
                    console.log('446 ' + data)
                }
            }
        }
        function savedtracks () {
            document.getElementById('savedtrack').innerHTML = ''
            sendRequest(0)
        }
        function sendRequest(offset){
            let url = 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50'
            console.log('456 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    console.log('464 ' + data)
                    let items = data['items']
                    let elem = []
                    for (const pla of items){
                        elem.push(`<div class="con3" tabindex="0" id=${pla['track']['id']} style="background-image: url(${pla['track']['album']['images'][1]['url']});background-repeat: no-repeat;background-size: cover" onclick="playtrack('${pla['track']['id']}')">${list(pla['track']['artists'])} -  ${pla['track']['name']}<audio type="audio/mpeg" preload="none" id="a_${pla['track']['id']}" src="${pla['track']['preview_url']}"></div>`)
                    }
                    document.getElementById('savedtrack').innerHTML += elem.join(' ')
                    if (items.length > 0){
                        sendRequest(offset+50)


                    }
                } else {
                    console.log('xhr status 277 ' + xhr.status)
                }
            }
          }
         function test(id){
             let refreshIcon = document.getElementById(id.replace('refresh_','icon_'))
             let refreshButton = document.getElementById(id)
             refreshIcon.setAttribute("class", "refresh-start")
             refreshButton.removeAttribute("class")
             refreshButton.disabled = true
             setTimeout(function () {
                 refreshIcon.addEventListener('animationiteration',function (){
                     initElement(id.replace('refresh_',''))
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