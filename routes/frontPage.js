module.exports = frontPage = (req, res) => {
    if (req.session.username) {
        res.render('index', {
            username: req.session.username
        });
    } else {
        res.render('index');
    }
}