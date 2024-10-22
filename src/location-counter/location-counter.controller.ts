import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { LocationCounterService } from './location-counter.service';
import {
  CreateLocationCounterDto,
  LocationCounterFilter,
} from './dto/create-location-counter.dto';
import {
  UpdateLocationCounterDto,
  UpdateLocationCounterResponseDto,
} from './dto/update-location-counter.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { ADMIN_ROLES } from '../base.entity';
import { Roles } from '../auth/role.decorator';

@ApiTags('Location Counter')
@Roles(ADMIN_ROLES.ADMIN)
@Controller('location-counter')
export class LocationCounterController {
  constructor(
    private readonly locationCounterService: LocationCounterService,
  ) {}

  @ApiOperation({ summary: 'Create Location Counter' })
  @ApiBody({ type: CreateLocationCounterDto })
  @ApiCreatedResponse({ type: CreateLocationCounterDto })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Post()
  async createLocationCounter(@Body() body: CreateLocationCounterDto) {
    try {
      return this.locationCounterService.createLocationCounter(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Location Counters' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of location counters',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get()
  getAllLocationCounters(@Query() query: LocationCounterFilter) {
    try {
      return this.locationCounterService.getAllLocationCounters(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Location Counter' })
  @ApiOkResponse({
    type: CreateLocationCounterDto,
    description: 'Location counter successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'Location counter not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  getLocationCounterById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.locationCounterService.getLocationCounterById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Location Counter' })
  @ApiBody({ type: UpdateLocationCounterResponseDto })
  @ApiOkResponse({ description: 'Location counter successfully updated' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Put(':id')
  updateLocationCounterById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateLocationCounterDto,
  ) {
    try {
      return this.locationCounterService.updateLocationCounterById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Location Counter' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Delete(':id')
  deleteLocationCounterById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.locationCounterService.deleteLocationCounterById(id);
    } catch (error) {
      throw error;
    }
  }
}
