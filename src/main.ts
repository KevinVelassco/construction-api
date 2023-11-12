import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Construction API')
    .setDescription('Construction API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // getting the config service
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('config.app.port');

  const ENV = configService.get<string>('config.environment');

  await app.listen(PORT, () => {
    Logger.log(`app listening at ${PORT} in ${ENV}`, 'main.ts');
  });
}
bootstrap();
