const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const crypto = require('crypto');
const errorFunc = require('../util/errorFunc')
const { validationResult } = require('express-validator/check');
const sendgridAPIKey = require('../config/keys').sendgridAPIKey;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: sendgridAPIKey
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    title: 'Login',
    signup: false,
    oldInput: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      matchPassword: ''
    },
    errorMessage: message,
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/signup',
    title: 'Signup',
    signup: true,
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      matchPassword: ''
    }
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        title: 'Login',
        errorMessage: errors.array()[0].msg,
        signup: false,
        oldInput: {
          email,
          password
        },
        validationErrors: errors.array()
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        title: 'Login',
        signup: false,
        errorMessage: 'Invalid email or password',
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: []
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err => {
        res.redirect('/');
      });
    }
    return res.status(422).render('auth/login', {
      path: '/login',
      title: 'Login',
      errorMessage: 'Invalid email or password.',
      signup: false,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: []
    });
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.postSignup = async (req, res, next) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    matchPassword
  } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('auth/login', {
        path: '/signup',
        title: 'Signup',
        signup: true,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          firstName,
          lastName,
          matchPassword,
          username
        },
        validationErrors: errors.array()
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      postsData: { posts: [] }
    });
    await user.save();
    transporter.sendMail({
      to: email,
      from: 'socialMailAppTest@gmail.com',
      subject: 'Signup Succseeded',
      html: `<h1>Login Now</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor ipsum, doloremque harum provident in id odio sint rem? Quae laborum harum ipsam esse enim minus porro dolore! Consequatur, delectus omnis!</p>
      `
    });
    res.redirect('/login');
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    title: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'No account found');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    res.redirect('/');
    transporter.sendMail({
      to: req.body.email,
      from: 'auth@mail.com',
      subject: 'Password reset',
      html: `
          <a href="http://localhost:3000/reset/${token}">Reset</a>
          <p>You requested a password reset></p>
      `
    });
  });
};

exports.getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  });
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      title: 'New password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { newPassword, userId, passwordToken } = req.body;
    let resetUser;
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    });
    resetUser = user;
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetTokenExpiration = undefined;
    await resetUser.save();

    res.redirect('/login');
  } catch (err) {
    errorFunc(err, next);
  }
};
