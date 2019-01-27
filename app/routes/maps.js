const router = require('express').Router();

// Models
const Location = require('../models/Location');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

router.get('/maps', isAuthenticated, (req, res) => {
    res.render('maps/maps');
});

//Store location in data base
router.post('/maps',isAuthenticated, async (req, res) => {
    const { latitude, longitude } = req.body;
    const newLocation = new Location({latitude, longitude});
    newLocation.user = req.user.id;
    await newLocation.save();
    req.flash('success_msg', 'Point Added Successfully');
    res.redirect('/maps');
});

module.exports = router;
