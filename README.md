<div align=center>
<h1>cliplist-ttv</h1>
<p>Web app for easy to find and watch twitch clips</p>
</div>

[cliphype.netlify.app](https://cliphype.netlify.app/)

## Setup
### Environment
- Ubuntu-20.04 (any OS which can execute Docker)
- Docker v20.10.16
- docker-compose v1.29.2


### Create and Start the container
```
$ docker-compose up -d
$ docker-compose exec app /bin/sh
/cliplist-ttv # 
```

After you enter the container, read each `README.md` in frontend and backend dirs.


## Features
- [x] Show streamer's clips
- [x] Get clips by calendar picking datetime range
- [x] Get clips by a streamer's video picking datetime range
- [x] Create a playlist consisting of selected clips
- [ ] Login with Twitch account
- [ ] Publish and share playlists
- [ ] Manage playlists
- [ ] Create clips automatically by Machine Learning
- [ ] Create playlists automatically from autoclips

