import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { Customer } from './customer.entity';
import { CustomerLoaders } from './customer.loaders';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), UserModule],
  providers: [CustomerResolver, CustomerService, CustomerLoaders],
  exports: [CustomerService],
})
export class CustomerModule {}
