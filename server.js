'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'chicken', secure: 'auto' }));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

db.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
