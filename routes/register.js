exports.registerGet = (req, res) => {
    if (req.session.username) {
        res.redirect('/');
    } else {
        res.render('register', {
            hcaptcha: hcaptchaEnabled
        });
    }
}

exports.registerPost = (req, res) => {
    if (req.session.username) {
        res.redirect('/')
    } else { 
        console.log(req.body)
        if (hcaptchaEnabled) {
            if (req["body"]["h-captcha-response"]) {
                verify(SECRET, req["body"]["h-captcha-response"])
                .then(() => {
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
                                        type: "positive"
                                    }
                                ],
                                hcaptcha: hcaptchaEnabled
                            });
                        });
                    });
                })
                .catch(() => {
                    res.render('register',  { 
                        alerts: [
                            {
                                text: "hCaptcha failed.",
                                type: "information"
                            }
                        ],
                        hcaptcha: hcaptchaEnabled
                    });
                });
            } else {
                res.render('register',  { 
                    alerts: [
                        {
                            text: "hCaptcha failed.",
                            type: "information"
                        }
                    ],
                    hcaptcha: hcaptchaEnabled
                });
            }
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
                                type: "positive"
                            }
                        ]
                    });
                });
            });
        }
    }
}
