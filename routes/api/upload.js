module.exports = upload = (req, res) => {
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
                
                urls.push("i/" + randomName + "." + fileEnding)
            }
        });

        if (req.query.info == "1") {
            //Use map
            const alerts = []

            urls.forEach(url => {
                alerts.push({type: "positive", text: `Your image has been uploaded <a target="_blank" href="${serviceUrl}${url}">${serviceUrl}${url}</a>`})
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
}