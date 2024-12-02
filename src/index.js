const express = require('express')
const dotenv=require('dotenv').config()
const port = 4040
const app = express()
const path=require('path')
const cors = require('cors')
const helmet = require('helmet')
const connectDb = require('./database/connection.js')
const Routers = require('./Routes/professorRouter.js')
const publicDirectoryPath=path.join(__dirname,'../public')
const studentDirectoryPath=path.join(__dirname,'../student')
const studentRoutes = require('./Routes/studentRoutes.js');

app.use(express.static(publicDirectoryPath))
app.use("/student", express.static(studentDirectoryPath))

app.use(express.json())
app.options('*', cors());
app.use(cors({
	origin: '*',
	methods: '*',
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);
app.use(express.urlencoded({ extended: true }));


app.use('/professor', Routers)
app.use('/api/students', studentRoutes);

connectDb().then(() => {
  app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Unable to start server');
  process.exit(1);
});
