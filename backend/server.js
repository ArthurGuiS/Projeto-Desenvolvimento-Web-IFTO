const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pontoRoutes = require('./routes/pontoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ponto', pontoRoutes);

app.get('/', (req, res) => {
  res.send('API PontoWeb Ativa');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
