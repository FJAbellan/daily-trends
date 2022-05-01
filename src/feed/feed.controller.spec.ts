import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

class MockResponse {
  res: any;

  constructor() {
    this.res = {};
  }

  status = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((code) => {
      this.res.code = code;
      return this;
    });
  send = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((message) => {
      this.res.message = message;
      return this;
    });
  json = jest
    .fn()
    .mockReturnThis()
    .mockImplementationOnce((json) => {
      this.res.json = json;
      return this;
    });
}

const mockFeed: any = {
  _id: 'anyid',
  newspaper: 'firstName #1',
  head: 'head #1',
  news: 'blablablabla',
};

const createFeedDto: CreateFeedDto = {
  newspaper: 'firstName #1',
  head: 'head #1',
  news: 'blablablabla',
};

const updateFeedDto: UpdateFeedDto = {
  newspaper: 'firstName #1 updated',
  head: 'head #1 updated',
  news: 'blablablabla updated',
};

describe('feed Controller', () => {
  let customersController: FeedController;
  let customersService: FeedService;
  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  const response = new MockResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        {
          provide: FeedService,
          useValue: {
            create: jest.fn(() => []),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => {}),
            update: jest.fn(() => {}),
            remove: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    customersController = module.get<FeedController>(FeedController);
    customersService = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(customersController).toBeDefined();
  });

  describe('getAllFeed()', () => {
    it('should call method findAll in FeedService', async () => {
      await customersController.getAllFeed(response, paginationQueryDto);
      expect(customersService.findAll).toHaveBeenCalled();
    });

    it('should throw if FeedService findAll throws', async () => {
      jest
        .spyOn(customersService, 'findAll')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        customersController.getAllFeed(response, paginationQueryDto),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return Feed on success', async () => {
      await customersController.getAllFeed(response, paginationQueryDto);
      expect(customersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getFeed()', () => {
    it('should call method findOne in FeedService with correct value', async () => {
      const findSpy = jest.spyOn(customersService, 'findOne');
      await customersController.getFeed(response, 'anyid');
      expect(findSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw if FeedService findOne throws', async () => {
      jest
        .spyOn(customersService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        customersController.getFeed(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });

    it('should return a Feed on success', async () => {
      jest.spyOn(customersService, 'findOne').mockResolvedValueOnce(mockFeed);
      await customersController.getFeed(response, 'anyid');
      expect(customersService.findOne).toHaveBeenCalled();
    });
  });

  describe('addFeed()', () => {
    it('should call method create in FeedService with correct values', async () => {
      const createSpy = jest.spyOn(customersService, 'create');
      await customersController.addFeed(response, createFeedDto);
      expect(createSpy).toHaveBeenCalledWith(createFeedDto);
    });

    it('should return a Feed on success', async () => {
      const createFeedSpy = jest.spyOn(customersService, 'create');
      await customersController.addFeed(response, createFeedDto);
      expect(createFeedSpy).toHaveBeenCalledWith(createFeedDto);
    });
  });

  describe('updateFeed()', () => {
    it('should call method update in FeedService with correct values', async () => {
      const updateSpy = jest.spyOn(customersService, 'update');
      await customersController.updateFeed(response, 'anyid', updateFeedDto);
      expect(updateSpy).toHaveBeenCalledWith('anyid', updateFeedDto);
    });
  });

  describe('deleteFeed()', () => {
    it('should call methoed remove in FeedService with correct value', async () => {
      const deleteSpy = jest.spyOn(customersService, 'remove');
      await customersController.deleteFeed(response, 'anyid');
      expect(deleteSpy).toHaveBeenCalledWith('anyid');
    });

    it('should throw error if id in FeedService not exists', async () => {
      jest
        .spyOn(customersService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        customersController.deleteFeed(response, 'anyid'),
      ).rejects.toThrow(new NotFoundException());
    });
  });
});
