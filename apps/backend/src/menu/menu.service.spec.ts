import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuEntity } from '../menu/entities/menu.entity'; // Asegúrate de que la ruta sea correcta
import { Repository } from 'typeorm';

describe('MenuService', () => {
  let service: MenuService;
  let mockRepository: Partial<Repository<MenuEntity>>; // Mock del repository

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]), // Mockea métodos que uses en el service
      // Agrega más mocks según lo que haga tu service (ej. findOne, save, etc.)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuEntity), // Proporciona el mock del repository
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Agrega más tests reales aquí, ej:
  // it('should return an array of menu items', async () => {
  //   const result = [{ id: 1, nombre: 'Test' }];
  //   jest.spyOn(mockRepository, 'find').mockResolvedValue(result);
  //   expect(await service.findAll()).toBe(result);
  // });
});
