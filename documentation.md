
# Final Proj

---

Name: Dylan Goonewardene

Date: 4/10/20

Project Topic: Anime Watch List

URL: https://localgaragesales.herokuapp.com/

---


### 1. Data Format and Storage

Data point fields:
- `User`:     ...       `Type: Scheme`
- `anime`:     ...       `Type: Schema`
- `username`:     ...       `Type: String`
- `password`:     ...       `Type: String`
- `title`:     ...       `Type: String`

Schema: 
```javascript
var animeSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
    },
    other: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    anime: [animeSchema]
});

### 2. Add New Data

HTML form route: `/signup`

POST endpoint route: `/signup`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/signup',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       "username" : 'name',
       "Password" : 'password'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

HTML form route: `/login`

POST endpoint route: `/login`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/login',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       "username" : 'name',
       "Password" : 'password'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getAnime`

Get endpoint route: `/profile/:user`

### 4. Search Data

Search Field: 

Search by user on '/' home page

### 5. Navigation Pages

Navigation Filters
1. Home -> `  /  `
2. About -> `/about`
2. Sign-Up -> `  /signup  `
3. Login -> `  /login  `
4. Profile -> `  /profile  `

Live Updates

When a user adds an anime to their list, that gets sent to a socket on the home page that adds to the 'most recent anime' list

Users should be able to view all data in two ways:
(10 pt) At least 2 post endpoints
(10 pt) At least 2 delete endpoints

See endpoints above

Modules

Create at least 1 module (to separate functionality from backend API functionality)

User module made

(15 pt) Use 2 new npm packages that we have not used before
express-session
cookie-parser

(10 pt) Make it look nice
Tried my best

(5 pt) Deploy to the web (either Heroku or Now) - If you can't figure out deployment, email us and we'll figure something out
README

(5 pt) Create a README with all the specifications

