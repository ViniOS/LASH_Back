const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const usuarios = require('./src/routes/usuarioRoutes');
app.use('/', usuarios);

const pacientes = require('./src/routes/pacientesRoutes');
app.use('/pacientes', pacientes);

const responsaveis = require('./src/routes/responsaveisRoutes');
app.use('/responsaveis', responsaveis);

const frequencias = require('./src/routes/frequenciaRoutes');
app.use('/frequencias', frequencias);

const doencas = require('./src/routes/doencasRoutes');
app.use('/doencas', doencas);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.listen(3000, ()=>{
    console.log('Server is running');
});
