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
    res.render('maps/maps', { user: req.user.id });
});

//Store point in DB
io.on('connection', function (socket) {
    socket.on('new point', async function (data) {
        const newPoint = new Point({
            routeId: lastRouteId, lat: data.latitude, lon: data.longitude, userId: data.user
        });
        await newPoint.save();
        console.log("Point saved :)");
    });
});

io.on('connection', function (socket) {
    socket.on('new route', async function (data) {
        const newRoute = new Route({ userId: data.user, name: data.name });
        await newRoute.save();
        lastRouteId = newRoute.id;
        console.log("Route saved :)");
    });
});

// Get All Routes
router.get('/allRoutes', isAuthenticated, async (req, res) => {
    const route = await Route.find({ userId: req.user.id}).sort({ date: 'desc' });
    res.render('maps/allRoutes', { route });
});

// Delete Route
router.delete('/routes/delete/:id', isAuthenticated, async (req, res) => {
    await Route.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Route Deleted Successfully');
    res.redirect('/allRoutes');
});

//Show route
router.get('/route/:id', isAuthenticated, async (req, res) => {
  var points = await Point.find({routeId: req.params.id}).sort({ date: 'desc' });
  res.render('maps/route', {pointArray: JSON.stringify(points)});
});

//Stop route
router.get('/stop', isAuthenticated, async (req, res) => {
    req.flash('success_msg', 'Route Created Successfully');
    res.redirect('/allRoutes');
});
module.exports = router;
