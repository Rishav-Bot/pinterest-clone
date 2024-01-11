var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStratergy = require('passport-local');
passport.use(new localStratergy(userModel.authenticate()));
const upload = require('./multer');

/* GET register page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel
  .findOne({
    username: req.session.passport.user
  })
  .populate("posts");
  res.render('profile', { user });
});

//For user display profile image
router.post('/fileupload', isLoggedIn, upload.single('image'), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send('No files uploaded');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  
  user.dp = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

// For adding new posts 
router.get('/add', async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('add', { user });
});

// For post uploading
router.post('/createpost', isLoggedIn, upload.single('postimage'), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send('No files uploaded');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    title: req.body.title,
    description: req.body.description,
    user: user._id,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

router.get('/show/posts', isLoggedIn, async function (req, res, next) {
  const user = await userModel
  .findOne({
    username: req.session.passport.user
  })
  .populate('posts');
  res.render('show', { user });
});

router.get('/feed', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const allPosts = await postModel.find()
  .populate("user");
  res.render('feed', { user, allPosts });
})

router.post('/register', function (req, res) {
  const { username, email, fullname, contact } = req.body;
  const userdata = new userModel({ username, email, fullname, contact });
  userModel.register(userdata, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      })
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}), function (req, res) { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
