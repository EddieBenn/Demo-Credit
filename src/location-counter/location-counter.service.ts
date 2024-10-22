import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import {
  CreateLocationCounterDto,
  LocationCounterFilter,
} from './dto/create-location-counter.dto';
import { UpdateLocationCounterDto } from './dto/update-location-counter.dto';
import { LocationCounter } from './entities/location-counter.entity';
import { buildLocationCounterFilter } from '../filters/query-filter';
import { RolesEnum } from '../base.entity';
import { ModelClass } from 'objection';
import { myTransaction } from '../utils/transaction';

@Injectable()
export class LocationCounterService {
  constructor(
    @Inject('LocationCounter')
    private readonly locationCounterModel: ModelClass<LocationCounter>,
  ) {}

  async createLocationCounter(
    data: CreateLocationCounterDto,
  ): Promise<CreateLocationCounterDto> {
    return myTransaction(this.locationCounterModel, async (trx) => {
      return this.locationCounterModel.query(trx).insert(data);
    });
  }

  async getAllLocationCounters(queryParams: LocationCounterFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const query = await buildLocationCounterFilter(queryParams);

    const result = await this.locationCounterModel
      .query()
      .where(query)
      .orderBy('createdAt', 'DESC')
      .page(page - 1, size);

    const totalPages = Math.ceil(result.total / size);

    return {
      locationCounters: result.results,
      pagination: {
        totalRows: result.total,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getLocationCounterById(id: string): Promise<CreateLocationCounterDto> {
    const locationCounter = await this.locationCounterModel
      .query()
      .findById(id);
    if (!locationCounter?.id) {
      throw new HttpException(
        `location counter with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return locationCounter;
  }

  async updateLocationCounterById(id: string, data: UpdateLocationCounterDto) {
    return myTransaction(this.locationCounterModel, async (trx) => {
      const updatedLocationCounter = await this.locationCounterModel
        .query(trx)
        .update(data)
        .where('id', id)
        .returning('*')
        .first();

      if (!updatedLocationCounter) {
        throw new HttpException(
          `Location counter with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedLocationCounter;
    });
  }

  async deleteLocationCounterById(id: string) {
    return this.locationCounterModel.query().deleteById(id);
  }

  async generateDemoID(city: string, role: string) {
    try {
      const generatedDemoId = await this.generateDemoIdByCity(city, role);
      if (generatedDemoId?.demoId && generatedDemoId.cityCode) {
        await this.locationCounterModel
          .query()
          .findOne({ cityCode: generatedDemoId.cityCode, role })
          .increment('count', 1);
      }
      return generatedDemoId?.demoId;
    } catch (error) {
      throw new HttpException(
        error?.message || 'an error occurred while creating  demo_id',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async generateDemoIdByCity(city: string, role: string) {
    const record = await this.locationCounterModel
      .query()
      .findOne({ city: city.toLowerCase(), role });

    if (!record?.id) {
      throw new HttpException(
        `city ${city} and role ${role} not found in location list`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cityCode = record.cityCode;
    const newCount = record.count + 1;
    const demoIdPrefix = role === RolesEnum.ADMIN ? 'DEMO-AD' : 'DEMO';
    const demoId = `${demoIdPrefix}-${cityCode}-${newCount}`;
    return { demoId, cityCode };
  }
}
