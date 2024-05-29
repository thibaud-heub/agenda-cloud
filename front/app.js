const express = require('express');
const app = express();
const port = 5000;

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
app.get('/profile', (req, res) => {
    res.render('profile'); 
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});