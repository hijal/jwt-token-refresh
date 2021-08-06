const express = require('express');
const indexRouter = require('./routes');
const config = require('./config.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', indexRouter);

app.listen(config.port || process.env.PORT || 3000, () => {
  console.log(`listening...${config.port || process.env.PORT || 3000}`);
});
