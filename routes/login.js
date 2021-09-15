exports.loginGet = (req, res) => {
    if (req.session.username) {
        res.redirect('/');
    } else {
        res.render('login');
    }
}

exports.loginPost = async (req, res) => {
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
                            type: "negative"
                        }
                    ]
                });
            }
        });    
    }
}