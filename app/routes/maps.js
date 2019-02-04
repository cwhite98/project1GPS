const router = require('express').Router();

const io = require('../app');

// Models
const Route = require('../models/Route');
const Point = require('../models/Point');
const Shared = require('../models/SharedRoute')
const User = require('../models/User');

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
    });
});

io.on('connection', function (socket) {
    socket.on('new route', async function (data) {
        const newRoute = new Route({ userId: data.user, name: data.name });
        await newRoute.save();
        lastRouteId = newRoute.id;
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

//Shared routes with me
router.get('/sharedRoutes', isAuthenticated, async (req, res) => {
    var routeArray = []; //Routes shared with me
    var userArray = []; //The users that shared it
    var pointArray = []; //The points of those routes
    const user = await User.findOne({_id: req.user.id});
    const shared = await Shared.find({viewers: user.username});
    if(shared.length >= 1) {
        //Si han compartido
        for(var i = 0; i < shared.length; i++) {
            const point = await Point.find({route: shared[i].route});
            const route = await Route.find({_id: shared[i].route});
            const user = await User.find({_id: shared[i].owner});
            pointArray.push(point);
            routeArray.push(route);
            userArray.push(user);
        }
    }else{
        req.flash('error_msg', 'Nobody has shared routes with you.');
        res.redirect('/sharedRoutes');
    }
    res.render('maps/sharedRoutes', { title: routeArray, owner: userArray, points: pointArray });
});

//Share route
router.get('/shareRoute/:id', isAuthenticated, async (req, res) => {
    var shared = new Shared();
    const username = req.query.username; 
    const user = await User.findOne({username: username});
    const routeUser = await Route.find({viewers: username});
    const route = await Shared.find({route: req.query.route});
    if (!username) {
        req.flash('error_msg', 'Type a username');
        res.redirect('/allRoutes');
    }else if(username == req.user.username){
        req.flash('error_msg', 'You can not share a route with yourself. ');
        res.redirect('/allRoutes');
    }else if(!user){
        req.flash('error_msg', 'Username does not exist.');
        res.redirect('/allRoutes');
    }else if(!routeUser){
        req.flash('error_msg', 'This route has been already shared with that user.');
        res.redirect('/allRoutes');
    }else{
        if(route.length >= 1){
            //If route was already shared
            Shared.update({$push: {viewers: username}}); //Store new viewer in data base for the route
            req.flash('success_msg', 'Route shared');
            res.redirect('/allRoutes');
        }else{
            //Add new shared route to database
            shared.route = req.query.route;
            shared.owner = req.user.id;
            shared.viewers = username;
            shared.save();
            req.flash('success', 'Route shared');
            res.redirect('/allRoutes');
        }
    }
});

//Show shared routes
router.get('/showSharedRoutes/:id', isAuthenticated, (req, res) => {
    var point = Point.find({route: req.query.route});
    var route = Route.find({_id: req.query.route});
    res.render('maps/showRoute', {title: route[0].name, points: point});
});

module.exports = router;
