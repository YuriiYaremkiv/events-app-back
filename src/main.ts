import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());

  // app.enableCors({
  //   origin: ['http://localhost:3000', 'https://events-app-front.vercel.app'],
  //   methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  //   credentials: true,
  // });

  app.enableCors({
    origin: 'https://events-app-front.vercel.app',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
