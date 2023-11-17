import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import appConfig from './config/app.config';
import appConfigSchema from './config/app.schema.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MaterialModule } from './modules/material/material.module';
import { BudgetModule } from './modules/budget/budget.module';
import { BudgetDetailModule } from './modules/budget-detail/budget-detail.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigSchema,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      introspection: true,
      persistedQueries: false, // this is to prevent denial of service attacks
      playground: process.env.NODE_ENV === 'development',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (error) => {
        console.error(error);
        return error;
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (configService: ConfigType<typeof appConfig>) => {
        return {
          type: 'postgres',
          ssl:
            configService.environment === 'production'
              ? { rejectUnauthorized: false, sslmode: 'require' }
              : false,
          host: configService.database.host,
          port: configService.database.port,
          username: configService.database.user,
          password: configService.database.password,
          database: configService.database.database,
          autoLoadEntities: true,
          synchronize: configService.environment !== 'production',
          logging: configService.database.log === 'yes',
        };
      },
    }),

    CommonModule,
    AuthModule,
    UserModule,
    MaterialModule,
    BudgetModule,
    BudgetDetailModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
