


require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Express Session Configuration with connect-mongo
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);

app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});



// require('dotenv').config();

// const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
// const methodOverride = require('method-override');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const connectDB = require('./server/config/db');
// const { isActiveRoute } = require('./server/helpers/routeHelpers');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to the database
// connectDB();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(methodOverride('_method'));

// // Session configuration
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//     }),
//     // Add other session options as needed
//   })
// );

// // Static files
// app.use(express.static('public'));

// // Templating Engine
// app.use(expressLayouts);
// app.set('layout', './layouts/main');
// app.set('view engine', 'ejs');

// // Custom locals
// app.locals.isActiveRoute = isActiveRoute;

// // Routes
// app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });

