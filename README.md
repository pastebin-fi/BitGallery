# BitGallery
Simple image sharing service.

## Demo

[https://img.pastebin.fi](https://img.pastebin.fi)

## Installation and Configuration

```
git clone https://github.com/kaikkitietokoneista/BitGallery.git
cd BitGallery
```

Configure environment variables to `.env`-file. Please remember that this type of setup is only for development purposes. For production please use Docker. Development setup ENV-variables:

|Name |Value  | Required|
--- | --- | ---
|HCAPTCHA_SECRET_KEY|If leaved as blank no hCaptcha|no|
|APP_SECRET|Set something unique|yes|
|PORT|Defines web server port (default: 8989)|no|
|SSL|If not blank URLs start with https and not http (default: no)|no|
|PORT|Used to build URLs for notifications (default: localhost)|yes|
|WEB_PATH|Used to build URLs for notifications. In most cases this can be left blank. This is only required if ran behind reverse proxy with multiple services under same hostname (example.com/bitgallery and example.com/pastin). Please include a slash at the end if filled. |no|

Example config:

```env
HCAPTCHA_SECRET_KEY=
APP_SECRET=keyboard cat
PORT=
SSL=
HOSTNAME=localhost
WEB_PATH=
```

You also have to make directory `images`.

Finally you can install required dependencies and start the program.

```
npm install
npm start
```
