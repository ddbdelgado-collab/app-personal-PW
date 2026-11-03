import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  // class validator
  app.useGlobalPipes(new ValidationPipe());

  //swagger
  const config = new DocumentBuilder()
  .setTitle('Usuarios')
  .setDescription('Descripción de la API Usuarios')
  .setVersion('1.0')
  .addTag('Usuarios')
  .addBearerAuth()
  .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  //end swagger

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
