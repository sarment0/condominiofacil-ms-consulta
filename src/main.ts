import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://localhost'],
  //       queue: 'condominiofacil-cnpjs-consulta',
  //       queueOptions: {
  //         durable: false,
  //       },
  //       noAck: false,
  //     },
  //   },
  // );
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'condominiofacil-cnpjs-consulta',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  Logger.log(`Microservice is Listening...`);
  await app.listen();
}
bootstrap();
