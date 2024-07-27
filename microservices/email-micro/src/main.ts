import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://csevpycf:nxQsVAbVrVB9F9OYaWViKtbrJb3bNxtz@stingray.rmq.cloudamqp.com/csevpycf'],
      queue: 'email_queue',
      queueOptions: {
        durable: false
      },
    },
  })
  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
