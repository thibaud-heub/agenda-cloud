const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events'); // Assurez-vous que le chemin est correct
const profileRoutes = require('./routes/profileRoutes'); // Assurez-vous que le chemin est correct
const session = require('express-session');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/', eventRoutes); // Montez le routeur sur le chemin '/api'


app.use(session({
    secret: 'votre_secret_unique', // Une clé secrète pour signer le cookie de session
    resave: false,  // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: false,  // Ne pas créer de session jusqu'à ce que quelque chose soit stocké
    cookie: { secure: false, maxAge: 3600000 } // Paramètres du cookie, `secure` doit être vrai en production si vous utilisez HTTPS
}));


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('res', __dirname + '/res');

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticate(username, password); // Une fonction fictive pour vérifier l'utilisateur

    if (user) {
        req.session.userId = user.id; // Stockage de l'ID utilisateur dans la session
        req.session.username = user.username; // Stockage du nom d'utilisateur
        res.redirect('/profile');
    } else {
        res.redirect('/login?error=Invalid credentials');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        res.clearCookie('connect.sid'); // Le nom de cookie par défaut est 'connect.sid'
        res.redirect('/login');
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
