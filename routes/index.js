var express = require('express');
var router = express.Router();
var session = require('express-session');
var bcrypt = require('bcrypt');
var User = require('../models').User;
var Event = require('../models').Event;

function sanitize(input) {
	var output = input;

	return output.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
}

// Index Route
router.get('/', function(req, res, next) {
	if (req.session.admin) {
		res.render('index', { title: 'Home - Balloonatic', session: req.session });
	} else {
		res.render('index', { title: 'Home - Balloonatic' });
	}
});

// Schedule Route
router.get('/schedule', function(req, res, next) {
	Event.findAll({
		order: 'createdAt ASC',
	}).then((events) => {
		if (req.session.admin) {
			res.render('schedule', { title: 'Schedule - Balloonatic', session: req.session, events: events });
		} else {
			res.render('schedule', { title: 'Schedule - Balloonatic', events: events });
		}
	});
});

// Add Schedule Event Route
router.get('/schedule/add', function(req, res, next) {
	if (req.session.admin) {
		res.render('addSchedule', { title: 'Schedule Add - Balloonatic', session: req.session });
	} else {
		res.redirect('/');
	}
});

// Create Schedule Event
router.post('/schedule/add', function(req, res, next) {
	if (req.session.admin) {
		Event.create({
			location: sanitize(req.body.location),
			date: sanitize(req.body.date),
			status: req.body.status
		}).then(() => {
			res.redirect('/schedule');
		});
	} else {
		res.redirect('/schedule');
	}
});

// Delete Schedule Event
router.get('/schedule/delete/:id', function(req, res, next) {
	if (req.session.admin) {
		Event.destroy({
			where: {
				id: req.params.id
			}
		});
	}
	res.redirect('/schedule');
});

// Edit Schedule Event Route
router.get('/schedule/edit/:id', function(req, res, next) {
	if (req.session.admin) {
		Event.findOne({
			where: {
				id: req.params.id
			}
		}).then((event) => {
			res.render('editSchedule', { title: 'Schedule Edit - Balloonatic', session: req.session, event: event });
		}).catch(() => {
			res.redirect('/schedule');
		});
	} else {
		res.redirect('/schedule');
	}
});

// Edit Schedule Event
router.post('/schedule/edit', function(req, res, next) {
	if (req.session.admin) {
		Event.update({
			location: sanitize(req.body.location),
			date: sanitize(req.body.date),
			status: req.body.status
		},
		{where:{
			id: req.body.id
		}});
	}
	res.redirect('/schedule');
});

// Login Route
router.get('/login', function(req, res, next) {
	if (req.session.admin) {
		res.render('auth/login', { title: 'Login - Balloonatic', session: req.session  });
	} else {
		res.render('auth/login', { title: 'Login - Balloonatic' });
	}
});

// Login
router.post('/login', function(req, res, next) {
	User.findOne({
		where: {
			username: sanitize(req.body.username)
		}
	}).then((user) => {
		bcrypt.compare(sanitize(req.body.password), user.password, function(err, match) {
		    if (match) {
		    	req.session.admin = true;
				res.redirect('/schedule/add');
		    } else {
		    	res.redirect('/login');
		    }
		});
	}).catch(() => {
		res.redirect('/login');
	});

});

// Register DELETE AFTER ADMIN SETUP
router.post('/register', function(req, res, next) {
	bcrypt.hash(sanitize(req.body.password), 10, function(err, hash) {
		User.create({
			username: sanitize(req.body.username),
			password: hash
		});
	});
	res.redirect('/');
})

// Logout
router.get('/logout', function(req, res, next) {
	if (req.session.admin) {
		req.session.destroy();
	}
	res.redirect('/');
});

module.exports = router;
