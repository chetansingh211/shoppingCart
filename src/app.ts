import express, { Application } from 'express';
import * as swaggerDocument from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import { router as checkoutRouter } from './checkoutRouter';

const app: Application = express();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(checkoutRouter);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default server;
