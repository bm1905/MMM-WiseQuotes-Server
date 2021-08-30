const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path');
var fs = require('fs');
const https = require('https');

const config = require('./config');
const FakeDb = require('./fake-db');

const dashboardRoutes = require('./routes/dashboards'),
    userRoutes = require('./routes/users'),
    quoteRoutes = require('./routes/quotes');

mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        // Create dummy data to database.
        // Comment it not to loose existing data.
        const fakeDb = new FakeDb();
        // fakeDb.seedDb();
    })
    .catch(err => console.error(err));;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/api/v1/dashboards', dashboardRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quotes', quoteRoutes);


if (process.env.NODE_ENV === 'production') {
    const appPath = path.join(__dirname, '..', 'build');
    app.use(express.static(appPath));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(appPath, 'index.html'));
    })
}

const PORT = process.env.PORT || 3001;

const httpsServer = https.createServer ({
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
}, app);

app.listen(PORT, function () {
    console.log('Server Started at PORT!', PORT);
});
