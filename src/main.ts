import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envsConfig } from './config/envs.config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Order-ms')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.NATS,
      options:{
        servers: envsConfig.NATS_URL,
      }
    }
  );
  await app.listen();
  logger.log(`Order-ms corriendo en el puerto ${envsConfig.PORT}`)
}
bootstrap();
