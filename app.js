const express = require('express');
const path = require('path');


//Models

const User = require('./models/user');

//Routers
const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const messagesRouter = require('./routes/posts');

//Controllers
const errorController = require('./controllers/error');

//Third pary
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const sassMiddleware = require('node-sass-middleware');
const randomstring = require('randomstring')

const app = express();

const MONGODB_URI = require('./config/keys').mongoURI;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');

app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: randomstring.generate(),
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use(homeRouter);
app.use(messagesRouter)
app.use(authRouter);
app.use(userRouter)

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
});


app.get('/500', errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   res.status(500).render('500', {
//     title: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(result => {
    app.listen(5000);
  })
  .catch(error => {
    throw error
  });