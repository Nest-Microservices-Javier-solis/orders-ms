import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envsConfig } from './config/envs.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Order-ms')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.TCP,
      options:{
        port: envsConfig.PORT
      }
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen();
  logger.log(`Order-ms corriendo en el puerto ${envsConfig.PORT}`)
}
bootstrap();
