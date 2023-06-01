import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Payload,
  EventPattern,
  MessagePattern,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';

import axios from 'axios';
import { MongoClient, MongoError, MongoClientOptions } from 'mongodb';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  logger = new Logger(AppController.name);

  @MessagePattern()
  async consultarCnpj(@Payload() body: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      //consulta servico
      this.logger.log(body);
      console.log(body['cnpj']);
      const url = `https://publica.cnpj.ws/cnpj/${body['cnpj']}`;

      axios
        .get(url)
        .then((response) => this.saveMongo({ body, ...response.data }))
        .catch((error) => {
          // Handle the error
          console.error(error);
        })
        .finally(async () => {
          await channel.ack(originalMsg);
        });
    } finally {
      await channel.ack(originalMsg);
    }
  }

  async saveMongo(dadosEmpresa: any) {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
      const database = client.db('condominiofacil');
      const haiku = database.collection('consultas-cnpj');
      // create a document to insert
      await haiku.insertOne(dadosEmpresa);
    } finally {
      await client.close();
    }
  }
}
