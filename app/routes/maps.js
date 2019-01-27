const router = require('express').Router();

// Models
const Route = require('../models/Route');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

router.get('/maps', isAuthenticated, (req, res) => {
    res.render('maps/maps');
});

//Store location in data base
router.post('/addRoute',isAuthenticated, async (req, res) => {
    const latitudes = JSON.parse(req.body.latitudes);
    const longitudes = JSON.parse(req.body.longitudes);
    const newRoute = new Route({username: req.user.id, lats: latitudes, lons: longitudes});
    newRoute.user = req.user.id;
    await newRoute.save();
    req.flash('success_msg', 'Route Added Successfully');
    res.redirect('/allRoutes');
});

// Get All Routes
router.get('/allRoutes', isAuthenticated, async (req, res) => {
    const route = await Route.find({username: req.user.id}).sort({date: 'desc'});
    console.log(route);
    res.render('maps/allRoutes', { route });
});

// Delete Routes
router.delete('/routes/delete/:id', isAuthenticated, async (req, res) => {
    await Route.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Route Deleted Successfully');
    res.redirect('/allRoutes');
});

module.exports = router;
