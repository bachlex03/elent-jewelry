// const express = require('express');
// const cors = require('cors');
// const routes = require('./routes'); // Import file routes
// const connectDB = require('./config/db');
// const { swaggerDocs, swaggerUi } = require('./config/swagger');
// const cronMiddleware = require('./middleware/cronMiddleware'); 
// require('dotenv').config({ path: '.env.development' });
// const { engine } = require('express-handlebars');
// const path = require('path'); // Thêm import cho path
// const passport = require('./config/passport')
// const authRoutes = require('./routes/auth.route');
// // Kết nối DB
// connectDB();

// const app = express();


// // Thiết lập Handlebars
// // Cấu hình Template engine
// app.engine(
//   'hbs',
//   engine({
//       extname: 'hbs',
//   }),
// ); // Sử dụng hàm 'engine' từ express-handlebars
// app.set('view engine', 'hbs');

// app.set('views', path.join(__dirname, 'resource/view'));

// app.get("/payment", (req, res) => {
//   res.render("cart");
// });

// // Swagger UI setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Cấu hình CORS cho phép mọi nguồn gốc
// app.use(cors());

// // Cấu hình static file
// app.use(express.static('public'));

// // Middleware để phân tích body JSON
// app.use(express.json());


// app.use(passport.initialize());
// app.use('/auth',authRoutes)
// // Đăng ký routes từ 'routes/index.js'
// app.use('/api', routes); // Đăng ký router với prefix '/api'

// // Middleware xử lý lỗi 404
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Not Found' });
// });

// cronMiddleware();

// // Global exception
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// // env environments
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Import file routes
const connectDB = require('./config/db');
const { swaggerDocs, swaggerUi } = require('./config/swagger');
const cronMiddleware = require('./middleware/cronMiddleware'); 
require('dotenv').config({ path: '.env.development' });
const { engine } = require('express-handlebars');
const path = require('path'); // Thêm import cho path
const passport = require('./config/passport')
const authRoutes = require('./routes/auth.route');

// Kết nối DB
connectDB();
const app = express();
// Thiết lập Handlebars
// Cấu hình Template engine
app.engine(
  'hbs',
  engine({
      extname: 'hbs',
  }),
); // Sử dụng hàm 'engine' từ express-handlebars
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resource/view'));

app.get("/payment", (req, res) => {
  res.render("cart");
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Cấu hình CORS cho phép mọi nguồn gốc
app.use(cors());

// Cấu hình static file
app.use(express.static('public'));

// Middleware để phân tích body JSON
app.use(express.json());

app.use(passport.initialize());
app.use('/auth',authRoutes)
// Đăng ký routes từ 'routes/index.js'
app.use('/api', routes); // Đăng ký router với prefix '/api'

// Middleware xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

cronMiddleware();

// Global exception
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// env environments
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
