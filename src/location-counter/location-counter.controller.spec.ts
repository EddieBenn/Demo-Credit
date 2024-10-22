import { Test, TestingModule } from '@nestjs/testing';
import { LocationCounterController } from './location-counter.controller';
import { LocationCounterService } from './location-counter.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  CreateLocationCounterDto,
  LocationCounterFilter,
} from './dto/create-location-counter.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { buildLocationCounterFilter } from '../filters/query-filter';
import { LocationCounter } from './entities/location-counter.entity';

jest.mock('../filters/query-filter', () => ({
  buildLocationCounterFilter: jest.fn(),
}));

describe('LocationCounterController', () => {
  let controller: LocationCounterController;
  let service: DeepMocked<LocationCounterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationCounterController],
      providers: [
        {
          provide: LocationCounterService,
          useValue: createMock<LocationCounterService>(),
        },
      ],
    }).compile();

    controller = module.get<LocationCounterController>(
      LocationCounterController,
    );
    service = module.get(LocationCounterService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLocationCounter', () => {
    const mockCounterPayload = new CreateLocationCounterDto();

    it('should create location counter', async () => {
      jest
        .spyOn(service, 'createLocationCounter')
        .mockResolvedValue(mockCounterPayload);

      const locationCounter =
        await controller.createLocationCounter(mockCounterPayload);

      expect(locationCounter).toEqual(mockCounterPayload);
      expect(service.createLocationCounter).toHaveBeenCalledWith(
        mockCounterPayload,
      );
      expect(service.createLocationCounter).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no correct location counter payload', async () => {
      mockCounterPayload.city = '';
      mockCounterPayload.country = '';
      mockCounterPayload.cityCode = '';

      jest
        .spyOn(service, 'createLocationCounter')
        .mockRejectedValue(
          new HttpException(
            'something went wrong while creating location counter',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.createLocationCounter(mockCounterPayload);
      } catch (error) {
        expect(error.message).toBe(
          'something went wrong while creating location counter',
        );
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getAllLocationCounters', () => {
    const mockCounterPayload = new LocationCounter();
    const mockQueryParams: LocationCounterFilter = {
      page: 1,
      size: 10,
      city: 'ibadan',
      role: 'user',
    };

    const expectedResult = {
      locationCounters: [mockCounterPayload],
      pagination: {
        totalRows: 5,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(5 / 10),
        hasNextPage: 1 < Math.ceil(5 / 10),
      },
    };

    it('should return all location counters with pagination', async () => {
      (buildLocationCounterFilter as jest.Mock).mockResolvedValue(
        mockQueryParams,
      );

      jest
        .spyOn(service, 'getAllLocationCounters')
        .mockResolvedValue(expectedResult);

      const allLocationCounters =
        await controller.getAllLocationCounters(mockQueryParams);

      expect(allLocationCounters).toEqual(expectedResult);

      expect(service.getAllLocationCounters).toHaveBeenCalledWith(
        mockQueryParams,
      );
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllLocationCounters')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllLocationCounters(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getLocationCounterById', () => {
    const location_id = '6d1d9844-95c4-453c-abad-2e5b0fd50db6';

    it('should get one location counter', async () => {
      const locationCounter = new CreateLocationCounterDto();
      jest
        .spyOn(service, 'getLocationCounterById')
        .mockResolvedValue(locationCounter);

      const getOneCounter =
        await controller.getLocationCounterById(location_id);

      expect(getOneCounter).toEqual(locationCounter);
      expect(service.getLocationCounterById).toHaveBeenCalledWith(location_id);
    });

    it('should an throw error if location counter not found', async () => {
      jest
        .spyOn(service, 'getLocationCounterById')
        .mockRejectedValue(
          new HttpException(
            `location counter with id: ${location_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getLocationCounterById(location_id);
      } catch (error) {
        expect(error.message).toBe(
          `location counter with id: ${location_id} not found`,
        );
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('updateLocationCounterById', () => {
    const location_id = '6d1d9844-95c4-453c-abad-2e5b0fd50db6';
    const updateData = new LocationCounter();

    it('should update and return the location counter', async () => {
      jest
        .spyOn(service, 'updateLocationCounterById')
        .mockResolvedValue(updateData);

      const result = await controller.updateLocationCounterById(
        location_id,
        updateData,
      );

      expect(result).toEqual(updateData);
      expect(service.updateLocationCounterById).toHaveBeenCalledWith(
        location_id,
        updateData,
      );
    });

    it('should throw an error if location counter not found', async () => {
      jest
        .spyOn(service, 'updateLocationCounterById')
        .mockRejectedValue(
          new HttpException(
            `Location counter with id: ${location_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateLocationCounterById(location_id, updateData);
      } catch (error) {
        expect(error.message).toBe(
          `Location counter with id: ${location_id} not found`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteLocationCounterById', () => {
    const location_id = '6d1d9844-95c4-453c-abad-2e5b0fd50db6';

    it('should delete the location counter by id', async () => {
      jest.spyOn(service, 'deleteLocationCounterById').mockResolvedValue(1);

      const result = await controller.deleteLocationCounterById(location_id);

      expect(result).toBe(1);
      expect(service.deleteLocationCounterById).toHaveBeenCalledWith(
        location_id,
      );
    });

    it('should throw an error if process fails', async () => {
      jest
        .spyOn(service, 'deleteLocationCounterById')
        .mockRejectedValue(
          new HttpException(
            `An error occured while deleting location counter`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.deleteLocationCounterById(location_id);
      } catch (error) {
        expect(error.message).toBe(
          `An error occured while deleting location counter`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });
});
