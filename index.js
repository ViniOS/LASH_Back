const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



const pacientes = require('./src/routes/pacientesRoutes');
app.use('/pacientes', pacientes);

const responsaveis = require('./src/routes/responsaveisRoutes');
app.use('/responsaveis', responsaveis);

const frequencias = require('./src/routes/frequenciaRoutes');
app.use('/frequencias', frequencias);

const doencas = require('./src/routes/doencasRoutes');
app.use('/doencas', doencas);


app.listen(3000, ()=>{
    console.log('Server is running');
});
