const express = require('express')
const randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const mime = require('mime-types')
const { Sequelize, Model, DataTypes } = require("sequelize");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session')

const app = express()
const port = 8989
const saltRounds = 10;

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


app.get('/', function(req, res) {
    if (req.session.username) {
        res.render('index', {
            username: req.session.username
        });
    } else {
        res.render('index');
    }
});

app.get('/login', function (req, res) {
    if (req.session.username) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.get('/register', function (req, res) {
    if (req.session.username) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

app.post('/login', async function (req, res) {
    if (req.session.username) {
        res.redirect('/');
    } else {
        const user = await User.findOne({ where: { username: req.body.username } });

        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) throw err;
            if (result) {
                req.session.username = req.body.username;
                res.redirect('/');
            } else {
                res.render('login',  { 
                    alerts: [
                        {
                            text: "Invalid username or password.",
                            type: "danger"
                        }
                    ]
                });
            }
        });    
    }
});

app.post('/register', function (req, res) {
    if (req.session.username) {
        res.redirect('/')
    } else { 
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, async function(err, hash) {
                await User.create({
                    username: req.body.username,
                    password: hash
                });
                res.render('login',  { 
                    alerts: [
                        {
                            text: "Your account has been created. You can login below.",
                            type: "success"
                        }
                    ]
                });
            });
        });
    }
});

app.post('/api/upload', function (req, res) {
    if (req.session.username) {
        let urls = []

        if (typeof req.files.fileInput.length === "undefined") {
            req.files.fileInput = [req.files.fileInput]
        }

        req.files.fileInput.forEach(file => {
            if (allowedMimes.includes(file.mimetype)) {
                const randomName = randomstring.generate(7);
                const fileEnding = mime.extension(file.mimetype);

                file.mv(process.cwd() + "/images/" + randomName + "." + fileEnding)
                
                urls.push("/i/" + randomName + "." + fileEnding)
            }
        });

        if (req.query.info == "1") {
            //Use map
            alerts = []

            urls.forEach(url => {
                alerts.push({type: "success", text: `Your image has been uploaded <a target="_blank" href="https://img.pastebin.fi${url}">https://img.pastebin.fi${url}</a>`})
            });

            res.render('index', {
                alerts: alerts,
                username: req.session.username
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: 201,
                urls: urls
            }));    
        }
    } else { 
        res.redirect('/')
    }
});

app.get('*', function(req, res) {
    res.redirect('/');
});

//`${process.cwd()}/images/${files.fileInput.name}`

app.listen(port, () => {
  console.log(`BitGallery listening at http://localhost:${port}`)
})
