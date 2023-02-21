import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault],
        context: ({ req }) => {
          /*    const token = req.headers.authorization?.replace('Bearer ', '');
          if (!token) throw Error('Token needed');

          const payload = jwtService.decode(token);
          if (!payload) throw Error('Token not valid'); */
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(process.env.POSTGRES_DB_PORT, 10),
      username: process.env.POSTGRES_DB_USER,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      synchronize: true, // auto create db tables
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
