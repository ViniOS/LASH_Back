const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



// const authMiddleware = require('./src/middlewares/auth');
// app.use(authMiddleware.eAdmin);

const pacientes = require('./src/routes/pacientesRoutes');
app.use('/pacientes', pacientes);

const responsaveis = require('./src/routes/responsaveisRoutes');
app.use('/responsaveis', responsaveis);



app.listen(3000, ()=>{
    console.log('Server is running');
});
