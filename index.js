var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var _ = require("underscore");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dotenv = require('dotenv');
var User = require('./models/User');

dotenv.config();
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'notsosecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/profile/req.session.user.username');
    } else {
        next();
    }
};

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get("/", function(req, res) {
    if (req.session.user) {
        var user = req.session.user;
        console.log(user);
        console.log(user.username);
        console.log(user.anime);
        res.render('home');
    } else {
        res.render('home');
    }
})

app.get("/profile", function(req, res) {
    if (req.session.user) {
        var _user = req.session.user;
        User.findOne({ username: _user.username }, function(err, user) {
            if (err) console.log(error);
            console.log(user);
            if (!user) return res.send('No userfound with ID.');
            res.render('profile', { user: user.username, anime: user.anime, loggedin: true });

        })
    } else {
        res.redirect('/login')
    }

})

app.get("/profile/:user", function(req, res) {
    var _username = req.params.user;
    User.findOne({ username: _username }, function(err, user) {
        if (err) console.log(error);
        if (!user) return res.send('No user found with that name');
        res.render('profile', { user: user.username, anime: user.anime });

    })
})

app.post('/api/addAnime', function(req, res) {
    console.log("Adding");
    var user = req.session.user.username;
    var anime_title = req.body.title;
    var anime_image = req.body.image;
    var anime_url = req.body.url;
    console.log(anime_image);
    console.log(anime_title);
    console.log(anime_url.replace(/\\\//g, "/"));

    User.findOne({ username: user }, function(err, user) {
        if (err) console.log("ERR" + error);
        if (!user) return res.send('No userfound with ID.');
        console.log(anime_url);
        //Creating the review schema
        user.anime.push({
            image: anime_image,
            title: anime_title,
            link: req.body.url
        });
        console.log("Added");
        io.emit('new anime', anime_title);
        //Saving the updated movie
        user.save(function(err) {
            if (err) console.log("ERR" + err);
            else {
                console.log("Added right");
            }
        })

    })
})

app.get('/api/allAnime', function(req, res) {
    var totalAnime = [];
    User.find({}, function(err, users) {
        users.forEach(elem => {
            console.log(elem.anime)
            totalAnime.push(elem.anime);
        })
        res.send(totalAnime);
    })
})



app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup');
    })
    .post((req, res) => {
        console.log("Aadded");
        var username = req.body.username;
        var password = req.body.password;

        var newUser = new User();
        newUser.username = username;
        newUser.password = password;

        newUser.save(function(err, savedUser) {
            if (err) {
                console.log(err)
            }
        })
        req.session.user = newUser;
        res.render('home');
    });

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ username: username, password: password }, function(err, user) {
            if (err) {
                console.log(err);
            }

            if (!user) {
                return res.status(404).send();
            }
            req.session.user = user;
            res.redirect('/');
        })
    });

app.get('/about', function(req, res) {
    res.render('about');
})

http.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!');
});