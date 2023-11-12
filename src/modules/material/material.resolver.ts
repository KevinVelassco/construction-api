import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { MaterialService } from './material.service';
import { Material } from './material.entity';
import { Admin, FieldsResult, GetFiledsList } from '../../common/decorators';
import {
  CreateMaterialInput,
  UpdateMaterialInput,
  MaterialsResponse,
  FindAllMaterialsArgs,
  FindOneMaterialInput,
} from './dto';

@Resolver(() => Material)
export class MaterialResolver {
  constructor(private readonly materialService: MaterialService) {}

  @Admin()
  @Mutation(() => Material, { name: 'createMaterial' })
  create(
    @Args('createMaterialInput') createMaterialInput: CreateMaterialInput,
  ): Promise<Material> {
    return this.materialService.create(createMaterialInput);
  }

  @Query(() => MaterialsResponse, { name: 'materials' })
  findAll(
    @Args() findAllMaterialsArgs: FindAllMaterialsArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<MaterialsResponse> {
    return this.materialService.findAll(findAllMaterialsArgs, fieldsList);
  }

  @Query(() => Material, { name: 'material' })
  findOne(
    @Args('findOneUserInput') findOneMaterialInput: FindOneMaterialInput,
  ): Promise<Material> {
    return this.materialService.findOne({
      ...findOneMaterialInput,
      checkIfExists: true,
    });
  }

  @Admin()
  @Mutation(() => Material, { name: 'updateMaterial' })
  update(
    @Args('findOneUserInput') findOneMaterialInput: FindOneMaterialInput,
    @Args('updateMaterialInput') updateMaterialInput: UpdateMaterialInput,
  ): Promise<Material> {
    return this.materialService.update(
      findOneMaterialInput,
      updateMaterialInput,
    );
  }

  @Admin()
  @Mutation(() => Material, { name: 'deleteMaterial' })
  delete(
    @Args('findOneUserInput') findOneMaterialInput: FindOneMaterialInput,
  ): Promise<Material> {
    return this.materialService.delete(findOneMaterialInput);
  }
}
