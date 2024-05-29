const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events'); // Assurez-vous que le chemin est correct

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', eventRoutes); // Montez le routeur sur le chemin '/api'


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('res', __dirname + '/res');

app.get('/', (req, res) => {
    res.render('index'); 
});
app.get('/agenda', (req, res) => {
    res.render('agenda'); 
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
