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
        let allaudio = document.getElementsByTagName('audio')
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
                    descriptions.style.width = '60%'
                    descriptions.style.display = 'flex'
                    descriptions.style.alignItems = 'center'
              // descriptions.className = 'con4'
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
                    refresh.setAttribute("onclick","refr('refresh_" + id + "')")
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
                    for (const pla of playtrack){
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
                        else{
                            d.style.opacity = '.5'
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        trid.appendChild(d)
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
        document.getElementById('ta').addEventListener("click", function () {
            console.log('294')
             if (Array.from(ta).find(ta => ta.className === 'activetab') == undefined){
                 if (document.getElementById('artists').hasChildNodes()==true){
                     document.getElementById('artists').style.display = 'flex'
                     document.getElementById('artists6').style.display = 'none'
                     document.getElementById('artistsall').style.display = 'none'
                 } else {
                     topartistst()
                 }
             } else {
                 if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'artists'){
                     document.getElementById('artists').style.display = 'flex'
                     document.getElementById('artists6').style.display = 'none'
                     document.getElementById('artistsall').style.display = 'none'
                 } else if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'artists6'){
                     document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'flex'
                     document.getElementById('artistsall').style.display = 'none'
                 } else if (Array.from(ta).find(ta => ta.className === 'activetab').id == 'toptrackat'){
                     document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'none'
                     document.getElementById('artistsall').style.display = 'flex'
             }

         }})
        function topartistst(){
                if (document.getElementById('topartists').classList.contains("activetab")){

             } else{
                 document.getElementById('topartists').classList.toggle("activetab")
             }
                let url = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term'
            console.log('308 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let artis = document.getElementById('artists')
                    let items = data['items']
                      for (const it of items){
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
                        artisttrack(`${it['id']}`,'al',function (e) {
                            if (e!=null){
                                a.src = e
                            } else{
                                d.style.opacity = '.5'
                            }
                            return e
                        })
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        artis.appendChild(d)
                      }

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
            function topartistst6(){
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
                        artisttrack(`${it['id']}`,'al',function (e) {
                            if (e!=null){
                                a.src = e
                            } else{
                                d.style.opacity = '.5'
                            }
                            return e
                        })
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        artis.appendChild(d)
                      }


                }    document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'flex'
                     document.getElementById('artistsall').style.display = 'none'
            }
            }
            function topartiststall(){
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
                      for (const it of items){
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
                        artisttrack(`${it['id']}`,'al',function (e) {
                            if (e!=null){
                                a.src = e
                            } else{
                                d.style.opacity = '.5'
                            }
                            return e
                        })
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        artis.appendChild(d)
                      }



                }document.getElementById('artists').style.display = 'none'
                     document.getElementById('artists6').style.display = 'none'
                     document.getElementById('artistsall').style.display = 'flex'
            }
            }
        document.getElementById('topartists6').addEventListener('click', function () {
            if (document.getElementById('artists6').hasChildNodes() == true){
                document.getElementById('artists').style.display = 'none'
                document.getElementById('artists6').style.display = 'flex'
                document.getElementById('artistsall').style.display = 'none'
            } else{
                topartistst6()
            }
        })
        document.getElementById('topartistsall').addEventListener('click', function () {
            if (document.getElementById('artistsall').hasChildNodes() == true){
                document.getElementById('artists').style.display = 'none'
                document.getElementById('artists6').style.display = 'none'
                document.getElementById('artistsall').style.display = 'flex'
            } else{
                topartiststall()
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
        function artisttrack(id,type,callback){
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
                            callback(fnn['preview_url'])
                        } else{
                            callback(null)
                        } }
                    else if (type == 'ls'){
                        if (fnn != null) {
                            callback(fnn['preview_url'])
                    } else  {
                            callback(null)}
                        }
                    else if (type == 'al'){
                    if (fnn != null) {
                        callback(fnn['preview_url'])
                    } else {
                        callback(null)
                    }
                        }}

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
        function savedalbums(id,callback){
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
                            callback(`${fnn['preview_url']}`)
                        } else {
                            callback(null)
                        }}
                else if(xhr.status === 401){
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
         document.getElementById('tt').addEventListener("click", function (){
             console.log('544')
             if (Array.from(tt).find(tt => tt.className === 'activetab') == undefined){
                 if (document.getElementById('toptrack').hasChildNodes()==true){
                     document.getElementById('toptrack').style.display = 'flex'
                     document.getElementById('toptrack6').style.display = 'none'
                     document.getElementById('toptrackat').style.display = 'none'
                 } else {
                     topttracks()
                 }
             } else {
                 if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrack'){
                     document.getElementById('toptrack').style.display = 'flex'
                     document.getElementById('toptrack6').style.display = 'none'
                     document.getElementById('toptrackat').style.display = 'none'
                 } else if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrack6'){
                     document.getElementById('toptrack').style.display = 'none'
                     document.getElementById('toptrack6').style.display = 'flex'
                     document.getElementById('toptrackat').style.display = 'none'
                 } else if (Array.from(tt).find(tt => tt.className === 'activetab').id == 'toptrackat'){
                     document.getElementById('toptrack').style.display = 'none'
                     document.getElementById('toptrack6').style.display = 'none'
                     document.getElementById('toptrackat').style.display = 'flex'
             }

         }})
        function topttracks () {
             if (document.getElementById('toptracks').classList.contains("activetab")){

             } else{
                 document.getElementById('toptracks').classList.toggle("activetab")
             }
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
                      for (const pla of playtrack){
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
                        else{
                            d.style.opacity = '.5'
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        tracks.appendChild(d)
                      }
                    document.getElementById('toptrack').style.display = 'flex'
                    document.getElementById('toptrack6').style.display = 'none'
                    document.getElementById('toptrackat').style.display = 'none'
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
             if (document.getElementById('toptrack').hasChildNodes()== true){
                 document.getElementById('toptrack').style.display = 'flex'
                 document.getElementById('toptrack6').style.display = 'none'
                 document.getElementById('toptrackat').style.display = 'none'
             } else {
                 topttracks()
             }

         })
        document.getElementById('toptrackssix').addEventListener('click', function () {
            if (document.getElementById('toptrack6').hasChildNodes()== true){
             document.getElementById('toptrack').style.display = 'none'
             document.getElementById('toptrack6').style.display = 'flex'
             document.getElementById('toptrackat').style.display = 'none'}
            else {
                topttracks6()
            }
        })
        function topttracks6(){
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
                        else{
                            d.style.opacity = '.5'
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
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
         function topttracksall(){
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
                        else{
                            d.style.opacity = '.5'
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
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
        document.getElementById('toptracksall').addEventListener('click', function () {
            if (document.getElementById('toptrackat').hasChildNodes()== true){
             document.getElementById('toptrack').style.display = 'none'
             document.getElementById('toptrack6').style.display = 'none'
             document.getElementById('toptrackat').style.display = 'flex'
            } else {
                topttracksall()
            }
        })
        document.getElementById('sva').addEventListener("click", function (){
            if (document.getElementById('savedalbum').hasChildNodes()==true){
                document.getElementById('savedalbum').style.display = 'flex'
            } else {
                saved_albums()
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
                        savedalbums(sa['album']['id'],function (e) {
                            if (e!=null){
                                a.src = e
                            } else{
                                d.style.opacity = '.5'
                            }
                        })
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        albums.appendChild(d)
                      }
                    console.log('446 ' + data)
                }
            }
        }
         document.getElementById('svt').addEventListener("click", function (){
            if (document.getElementById('savedtrack').hasChildNodes()==true){
                document.getElementById('savedtrack').style.display = 'flex'
            } else {
                savedtracks()
            }
        })
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
                    for (const pla of items){
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
                        else{
                            d.style.opacity = '.5'
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        document.getElementById('savedtrack').appendChild(d)
                    }
                    if (items.length > 0){
                        sendRequest(offset+50)


                    }
                } else {
                    console.log('xhr status 277 ' + xhr.status)
                }
            }
          }
         document.getElementById('followedartists').addEventListener('click', function () {
             if (document.getElementById('followedartist').hasChildNodes() === true){
                 document.getElementById('followedartist').style.display = 'flex'
             } else{
                 getfollowedartist()
        }
             })
        function getfollowedartist(){
             let url = 'https://api.spotify.com/v1/me/following?type=artist&limit=50'
            console.log('228 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let artis = document.getElementById('followedartist')
                    let items = data['artists']['items']
                    let elem = []
                      for (const it of items){
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
                        followedartist(`${it['id']}`,function (e) {
                            if (e!=null){
                                a.src = e
                            } else{
                                d.style.opacity = '.5'
                            }
                        })
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                          artis.appendChild(d)

                      }
                    console.log('243 ' + data)

                }
            }
        }
         function followedartist(id,callback){
             let url = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?market=' + localStorage.getItem('country')
            console.log('712 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let tracks = data['tracks']
                    let fnn = (tracks.find(e =>e.preview_url))
                    if (fnn != null) {
                        callback(`${fnn['preview_url']}`)
                    } else {
                        callback(null)
                        }
                    }

                else if(xhr.status === 401){
                      let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',curl,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
                            followedartist(id)
                }
            }
                  }
            }
}
         document.getElementById('newreleases').addEventListener('click', function () {
             if (document.getElementById('newrelease').hasChildNodes() === true){
                 document.getElementById('newrelease').style.display = 'flex'
             } else{
                 document.getElementById('newrelease').innerHTML = ''
                 getnewrelease(0)
        }
             })
        function getnewrelease(offset){
             let url = 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset
            console.log('738 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200){
                    let data = JSON.parse(this.response)
                    let items = data['albums']['items']
                    let elem = []
                      for (const it of items){
                          elem.push(`${it['id']}`)
                          // elem.push(`<div class="con3" tabindex="0" id=nr_${it['id']} onclick="playtrackat('${it['id']}','nr')" style="background-image: url(${it['images'][1]['url']});background-repeat: no-repeat;background-size: cover">${it['name']}<audio id="nra_${it['id']}">${newrelease(it['id'])}</audio></div>`)
                      }
                      newrelease(elem,offset)
                      console.log('766 ' + elem)
                    //   nr.innerHTML = elem.join(' ')
                    // console.log('753 ' + data)

                }
            }
        }
         function newrelease(elem,offset){
             let url = 'https://api.spotify.com/v1/albums?ids=' + elem
             let nr = document.getElementById('newrelease')
            console.log('712 ' + url)
            let xhr = new XMLHttpRequest()
            xhr.open('GET',url,true)
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
            xhr.send()
            xhr.onload = function (){
                if (xhr.status === 200) {
                    let data = JSON.parse(this.response)
                    let items = data['albums']
                    for (const it of items){
                        let tracks = it['tracks']['items']
                        let fnn = (tracks.find(e =>e.preview_url))
                        let d = document.createElement('div')
                        d.tabIndex = 0
                        d.className = 'con3'
                        d.style.backgroundImage = `url(${it['images'][0]['url']})`
                        d.style.backgroundRepeat = 'no-repeat'
                        d.style.backgroundSize = 'cover'
                        let a = document.createElement('audio')
                        a.type = "audio/mpeg"
                        a.preload = 'none'
                        if (fnn && fnn['preview_url']){
                            a.src = `${fnn['preview_url']}`
                            d.innerText = `${list(fnn['artists'])} -  ${fnn['name']}`
                        }
                        else{
                            d.style.opacity = '.5'
                            d.innerText = `${list(it['artists'])} -  ${it['name']}`
                        }
                        d.appendChild(a)
                        d.addEventListener('click',function (e) {
                            let target = e.target
                            let audios = target.lastChild
                            for (let i = 0; i < allaudio.length; i++) {
                                 if (allaudio[i] == e.target.lastChild){

                                 } else {
                                     allaudio[i].pause()
                                 }
                         }

                            if (audios.paused == false){
                                audios.pause()
                            } else{
                                audios.play()
                            }
                            })
                        nr.appendChild(d)
                    }
                    if (items.length > 0){
                        getnewrelease(offset+20)
                } else if (offset == 100) {
                    }
                }


                else if(xhr.status === 401){
                      let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                      let xhr = new XMLHttpRequest()
                      xhr.open('GET',curl,true)
                      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                      xhr.send()
                      xhr.onload = function (){
                        if (xhr.status === 200){
                            followedartist(id)
                }
            }
                  }
            }
}
         function refr(id){
             let refreshIcon = document.getElementById(id.replace('refresh_','icon_'))
             let refreshButton = document.getElementById(id)
             refreshIcon.setAttribute("class", "refresh-start")
             refreshButton.removeAttribute("class")
             refreshButton.disabled = true
             let type = id.replace('refresh_','')
             setTimeout(function () {
                 refreshIcon.addEventListener('animationiteration',function (){
                     if (type == 'topartist'){
                        topartistst()
                     } else if (type == 'topartists6'){
                        topartistst6()
                     } else if (type == 'topartistsall'){
                         topartiststall()
                     } else if (type == 'toptracks') {
                         topttracks()
                     } else if (type == 'toptrackssix'){
                         topttracks6()
                     } else if (type == 'toptracksall'){
                         topttracksall()
                     } else if (type == 'savedalbum'){
                         saved_albums()
                     } else if (type == 'savetrack'){
                         savedtracks()
                     } else if (type == 'followedartist'){
                         getfollowedartist()
                     }
                     else if (type == 'newrelease'){
                         getnewrelease(0)
                     }
                     else{
                     initElement(id.replace('refresh_',''))
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

            document.getElementById('srch').addEventListener('input',delay(function (e) {
                if (document.getElementById('srch').value){
                    let value = document.getElementById('srch').value
                    let url = 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5'
                    console.log('712 ' + url)
                    let xhr = new XMLHttpRequest()
                    xhr.open('GET',url,true)
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                    xhr.send()
                    xhr.onload = function (){
                        if (xhr.status === 200){
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
                            for (const alb of albums){
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
                                albumtracks(`${(alb['href'])}`,function (e) {
                                    if (e!=null){
                                        a.src = e
                                    } else{
                                        d.style.opacity = '.5'
                                    }
                                })
                                d.appendChild(a)
                                main.addEventListener('click',function (e) {
                                let target = e.target
                                let audios = target.firstChild.lastChild
                                for (let i = 0; i < allaudio.length; i++) {
                                     if (allaudio[i] == e.target.firstChild.lastChild){

                                     } else {
                                         allaudio[i].pause()
                                     }
                             }

                                if (audios.paused == false){
                                    audios.pause()
                                } else{
                                    audios.play()
                                }
                                })
                                main.appendChild(d)
                                d1.appendChild(d2)
                                main.appendChild(d1)
                                albu.appendChild(main)
                            }
                            for (const art of artists){
                                let main = document.createElement('div')
                                main.className = 'playable-search'
                                let d = document.createElement('div')
                                d.tabIndex = 0
                                d.className = 'con3'
                                if ((art['images']).length != 0){
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
                                artisttracks(`${(art['href'])}`,function (e) {
                                    if (e!=null){
                                        a.src = e
                                    } else{
                                        d.style.opacity = '.5'
                                    }
                                })
                                d.appendChild(a)
                                main.addEventListener('click',function (e) {
                                let target = e.target
                                let audios = target.firstChild.lastChild
                                for (let i = 0; i < allaudio.length; i++) {
                                     if (allaudio[i] == e.target.firstChild.lastChild){

                                     } else {
                                         allaudio[i].pause()
                                     }
                             }

                                if (audios.paused == false){
                                    audios.pause()
                                } else{
                                    audios.play()
                                }
                                })
                                main.appendChild(d)
                                d1.appendChild(d2)
                                main.appendChild(d1)
                                arti.appendChild(main)
                            }
                            for (const pls of playlists){
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
                                pltracks(`${(pls['tracks']['href'])}`,function (e) {
                                    if (e!=null){
                                        a.src = e
                                    } else{
                                        d.style.opacity = '.5'
                                    }
                                })
                                d.appendChild(a)
                                main.addEventListener('click',function (e) {
                                let target = e.target
                                let audios = target.firstChild.lastChild
                                for (let i = 0; i < allaudio.length; i++) {
                                     if (allaudio[i] == e.target.firstChild.lastChild){

                                     } else {
                                         allaudio[i].pause()
                                     }
                             }

                                if (audios.paused == false){
                                    audios.pause()
                                } else{
                                    audios.play()
                                }
                                })
                                main.appendChild(d)
                                d1.appendChild(d2)
                                main.appendChild(d1)
                                play.appendChild(main)
                            }
                            for (const pla of tracks){
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
                                else{
                                    d.style.opacity = '.5'
                                }
                                d.appendChild(a)
                                main.addEventListener('click',function (e) {
                                let target = e.target
                                let audios = target.firstChild.lastChild
                                for (let i = 0; i < allaudio.length; i++) {
                                     if (allaudio[i] == e.target.firstChild.lastChild){

                                     } else {
                                         allaudio[i].pause()
                                     }
                             }

                                if (audios.paused == false){
                                    audios.pause()
                                } else{
                                    audios.play()
                                }
                                })
                                main.appendChild(d)
                                d1.appendChild(d2)
                                main.appendChild(d1)
                                songs.appendChild(main)
                                }
                        }


                        else if(xhr.status === 401){
                              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                              let xhr = new XMLHttpRequest()
                              xhr.open('GET',curl,true)
                              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                              xhr.send()
                              xhr.onload = function (){
                                if (xhr.status === 200){
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
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                  callback.apply(context, args);
                }, ms || 0);
              }}

            function pltracks(href,callback) {
                let url = href
                console.log('994' + url)
                let xhr = new XMLHttpRequest()
                xhr.open('GET',url,true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function (){
                    if (xhr.status === 200) {
                        let data = JSON.parse(this.response)
                        let playtrack = data['items']
                        if (playtrack[0]['track']["preview_url"]){
                            callback(playtrack[0]['track']["preview_url"])
                        }
                         else {
                             callback(null)
                         }
                    }



                    else if(xhr.status === 401){
                              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                              let xhr = new XMLHttpRequest()
                              xhr.open('GET',curl,true)
                              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                              xhr.send()
                              xhr.onload = function (){
                                if (xhr.status === 200){
                                    console.log('967 errr')
                        }
                    }
                          }
                    }

        }
        function albumtracks(href,callback) {
                let url = href + '/tracks'
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
                            callback(`${fnn['preview_url']}`)
                        } else {
                            callback(null)
                        }
                    }


                    else if(xhr.status === 401){
                              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                              let xhr = new XMLHttpRequest()
                              xhr.open('GET',curl,true)
                              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                              xhr.send()
                              xhr.onload = function (){
                                if (xhr.status === 200){
                                    console.log('1001 errr')
                        }
                    }
                          }
                    }

        }
        function artisttracks(href,callback) {
                let url = href + '/top-tracks?market=' + localStorage.getItem('country')
                let xhr = new XMLHttpRequest()
                xhr.open('GET',url,true)
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                xhr.send()
                xhr.onload = function (){
                    if (xhr.status === 200){
                        let data = JSON.parse(this.response)
                        console.log('1061' + data)
                        let items = data['tracks']
                        let fnn = (items.find(e =>e.preview_url))
                        if (fnn != null) {
                            callback(`${fnn['preview_url']}`)
                        } else {
                            callback(null)
                        }
                    }
                    else if(xhr.status === 401){
                              let curl = '/spotify/refresh_token/' + localStorage.getItem('username')
                              let xhr = new XMLHttpRequest()
                              xhr.open('GET',curl,true)
                              xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
                              xhr.send()
                              xhr.onload = function (){
                                if (xhr.status === 200){
                                    console.log('1001 errr')
                        }
                    }
                          }
                    }

        }