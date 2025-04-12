let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter.js');
const studentRoutes = require('./Routes/StudentRoutes.js');
const teacherRoutes = require('./Routes/TeacherRoutes.js');



require('dotenv').config();
require('./Models/db.js');

app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', AuthRouter);

app.use('/api/student', studentRoutes);

app.use('/api/teacher', teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);