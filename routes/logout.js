// TODO: fix sending the logout to people and logging them by that way out
// FIX: add csrf tokens
module.exports = logout = (req, res) => {
    if (req.session.username) {
        req.session.destroy(function(err) {
            res.render('login', {
                alerts: [
                    {
                        text: "You have been succesfully logged out. You can login below.",
                        type: "positive"
                    }
                ]
            });
        })
    } else {
        res.redirect('/');
    }
}