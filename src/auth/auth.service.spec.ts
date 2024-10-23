import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('AuthService', () => {
  let service: DeepMocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
