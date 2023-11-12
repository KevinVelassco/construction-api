import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Material } from './material.entity';
import { FieldsResult } from '../../common/decorators';

import {
  CreateMaterialInput,
  UpdateMaterialInput,
  MaterialsResponse,
  FindAllMaterialsArgs,
  FindOneMaterialInput,
} from './dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createMaterialInput: CreateMaterialInput): Promise<Material> {
    const { name } = createMaterialInput;

    const existingByName = await this.materialRepository
      .createQueryBuilder('material')
      .where('lower(material.name) = lower(:name)', { name })
      .getOne();

    if (existingByName)
      throw new ConflictException(`material with name ${name} already exists.`);

    const created = this.materialRepository.create({
      ...createMaterialInput,
    });

    const saved = await this.materialRepository.save(created);

    return saved;
  }

  async findAll(
    findAllMaterialsArgs: FindAllMaterialsArgs,
    fieldsList: FieldsResult,
  ): Promise<MaterialsResponse> {
    const { limit, offset, q, ...filters } = findAllMaterialsArgs;

    const query = this.materialRepository.createQueryBuilder('material');

    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query.andWhere(`material.${key} = :${key}`, { [key]: value });
      });
    }

    if (q) query.andWhere('material.name ilike :q ', { q: `%${q}%` });

    query
      .take(limit || 10)
      .skip(offset)
      .orderBy('material.id', 'DESC');

    const { fields, numberOfFields } = fieldsList;

    if (numberOfFields <= 1 && fields[0] === 'count') {
      const count = await query.getCount();
      return { count, results: null };
    }

    if (numberOfFields <= 1 && fields[0] === 'results') {
      const results = await query.getMany();
      return { count: null, results };
    }

    const [results, count] = await query.getManyAndCount();

    return { count, results };
  }

  async findOne(
    findOneMaterialInput: FindOneMaterialInput,
  ): Promise<Material | null> {
    const { uid, checkIfExists = false } = findOneMaterialInput;

    const item = await this.materialRepository.findOneBy({ uid });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the material with id ${uid}.`);
    }

    return item || null;
  }

  async update(
    findOneMaterialInput: FindOneMaterialInput,
    updateMaterialInput: UpdateMaterialInput,
  ): Promise<Material> {
    const existingMaterial = await this.findOne({
      ...findOneMaterialInput,
      checkIfExists: true,
    });

    const { name } = updateMaterialInput;

    if (name) {
      const existingByName = await this.materialRepository
        .createQueryBuilder('material')
        .where('lower(material.name) = lower(:name)', { name })
        .getOne();

      if (existingByName)
        throw new ConflictException(
          `material with name ${name} already exists.`,
        );
    }

    const preloaded = await this.materialRepository.preload({
      id: existingMaterial.id,
      ...updateMaterialInput,
    });

    const saved = await this.materialRepository.save(preloaded);

    return saved;
  }

  async delete(findOneMaterialInput: FindOneMaterialInput): Promise<Material> {
    const existingMaterial = await this.findOne({
      ...findOneMaterialInput,
      checkIfExists: true,
    });

    const deleted = await this.materialRepository.remove(existingMaterial);

    return deleted;
  }
}
