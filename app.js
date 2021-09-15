require('dotenv').config()
const express = require('express')
const randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const mime = require('mime-types')
const { Sequelize, Model, DataTypes } = require("sequelize");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session')
const cors = require('cors');

const frontPage = require('./routes/frontPage')
const { loginGet, loginPost } = require('./routes/login')
const { registerGet, registerPost } = require('./routes/register')
const logout = require('./routes/logout')

const upload = require('./routes/api/upload')

const { redirectToFrontPage } = require('./routes/other')

let hcaptchaEnabled = false

if (process.env.HCAPTCHA_SECRET_KEY != "") {
    const {verify} = require('hcaptcha');

    const SECRET = process.env.HCAPTCHA_SECRET_KEY;

    hcaptchaEnabled = true

    console.log('hCaptcha has been enabled.')
}


const app = express()
const port =  process.env.PORT || 8989
const saltRounds = 10;

const serviceUrl = `${(process.env.SSL != "" ? "https" : "http")}://${process.env.HOSTNAME}${["80", "443"].includes(port) ? "" : ":" + port}/${process.env.WEB_PATH}`

const sequelize = new Sequelize('sqlite::memory:') 

app.use(session({
    secret: 'keyboard cat'
}))

const User = sequelize.define("user", {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
});

const Image = sequelize.define("image", {
    filename: DataTypes.TEXT,
    owner: DataTypes.TEXT
});

sequelize.sync();

const allowedMimes = ["image/jpeg", "image/png"]

app.set('view engine', 'ejs');
app.use('/i', express.static('images'))
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/', frontPage);

app.get('/login', loginGet);

app.get('/register', registerGet);

app.get('/logout', logout);

app.post('/login', loginPost);

app.post('/register', registerPost);

app.post('/api/upload', upload);

app.get('*', redirectToFrontPage);

//`${process.cwd()}/images/${files.fileInput.name}`

app.listen(port, () => {
  console.log(`BitGallery listening at ${serviceUrl}`)
})
