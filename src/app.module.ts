import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { JoiValidationSchema } from './config/joi.validation';
import { EnvConfiguration } from './config/env.config';
@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    }), 
    MongooseModule.forRoot(process.env.MONGO_DB,
      {dbName: process.env.DB_NAME}), PokemonModule, CommonModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
