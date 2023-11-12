import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaterialService } from './material.service';
import { MaterialResolver } from './material.resolver';
import { Material } from './material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  providers: [MaterialResolver, MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
