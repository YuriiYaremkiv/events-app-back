import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors();
  // app.enableCors({
  //   origin: ['http://localhost:3000', 'https://events-app-front.vercel.app'],
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  //   credentials: true,
  // });

  // app.enableCors({
  //   origin: 'https://events-app-front.vercel.app',
  //   allowedHeaders:
  //     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //   methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  //   credentials: true,
  // });

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
