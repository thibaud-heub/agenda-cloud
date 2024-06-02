const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { router: routeHandler, fetchAdminData } = require('./routeshandler');
const session = require('express-session');
const authMiddleware = require('./authMiddleware');

app.use(session({
    secret: 'zazizazou',
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false } 
}));


app.use(express.json());
app.use(bodyParser.json());
app.use('/api', routeHandler);


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('res', __dirname + '/res');


app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/agenda', authMiddleware, (req, res) => {
    res.render('agenda'); 
});

app.get('/admin', authMiddleware, fetchAdminData, (req, res) => {
    res.render('admin', {
        users: req.adminData.users,
        groups: req.adminData.groups,
        rooms: req.adminData.rooms
    });
});
app.get('/profile', authMiddleware, (req, res) => {
    res.render('profile'); 
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});