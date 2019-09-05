# Basic Login System

Register and Login system

Login using email + password or mobile + OTP

[NodeJS](https://nodejs.org), [KoaJS](https://koajs.com/), [VueJS](https://vuejs.org/), MySQL

Clone repo 

``` git clone https://github.com/parth-smpx/login.git```

and to enable OTP service, create account on [msg91](https://control.msg91.com/signup/) and get the auth key.
replace [xxxxxxx in MSG91_KEY](https://github.com/parth-smpx/login/blob/3e9f365db2069d0ef71b6dffaf22f97b09b9facc/docker-compose.yml#L9) in `docker-compose.yml` with your auth key.

Finally run
```docker-compose up```

and see [this](http://localhost:3000)

Deployed [here](https://pandalogin.herokuapp.com/)
