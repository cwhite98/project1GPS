const router = require('express').Router();

const io = require('../app');

// Models
const Route = require('../models/Route');
const Point = require('../models/Point');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

//Vars
let lastRouteId = "";

router.get('/maps', isAuthenticated, (req, res) => {
    res.render('maps/maps', {user: req.user.id});
});

//Store point in DB
io.on('connection', function(socket) {
    socket.on('new point', async function (data) {
        const newPoint = new Point({routeId: lastRouteId, lat: data.latitude,
            lon: data.longitude, userId: data.user});//Falta el userID 
        await newPoint.save();
        console.log("Point saved :)");
    });
});

router.post('/addPoint', isAuthenticated, async function(req, res){ 
    console.log("llegue");
    latitude = req.body.lat;
    longitude = req.body.lon;
    route = lastRouteId;
    username = req.user.id;
    const newPoint = new Point({routeId: lastRouteId, lat: latitude, lon: longitude, userId: username}); 
    await newPoint.save();
    req.flash('success', 'Point Added');
    res.redirect('/maps');
});

//Store route in data base
router.post('/addRoute', isAuthenticated, async (req, res) => {
    //console.log(req.user.id);
    console.log(req.body.routeName);
    const newRoute = new Route({ userId: req.user.id, name: req.body.routeName });
    await newRoute.save();
    //console.log(newRoute.id);
    lastRouteId = newRoute.id;
    req.flash('success_msg', 'Route Added Successfully');
    res.redirect('/maps');
});

// Get All Routes
router.get('/allRoutes', isAuthenticated, async (req, res) => {
    const route = await Point.find({ username: req.user.id, routeId: req.body.routeId }).sort({ date: 'desc' });
    res.render('maps/allRoutes', { route });
});

// Delete Route
router.delete('/routes/delete/:id', isAuthenticated, async (req, res) => {
    await Route.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Route Deleted Successfully');
    res.redirect('/allRoutes');
});

router.get('/route', (req, res) => {
    res.render('maps/route');
});

module.exports = router;
