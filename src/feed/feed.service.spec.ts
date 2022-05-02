import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { IFeed } from './interfaces/feed.interface';
import { Model } from 'mongoose';
import { CrawlerService } from './crawler/crawler.service';

const mockFeed: any = {
  newspaper: 'firstName #1',
  head: 'head #1',
  news: 'blablablabla',
};

const feedArray = [
  {
    _id: 'anyid',
    newspaper: 'firstName #1',
    head: 'head #1',
    news: 'blablablabla',
  },
  {
    _id: 'anyid',
    newspaper: 'firstName #2',
    head: 'head #2',
    news: 'bleblebleble',
  },
];
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

describe('FeedService', () => {
  let service: FeedService;
  let model: Model<IFeed>;

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: CrawlerService,
          useValue: {
            init: jest.fn(),
            loadElPaisFeed: jest.fn(),
            loadElMundoFeed: jest.fn(),
            close: jest.fn(),
          },
        },
        {
          provide: getModelToken('Feed'),
          useValue: {
            find: jest.fn().mockReturnValue(feedArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockFeed),
            constructor: jest.fn().mockResolvedValue(mockFeed),
            create: jest.fn().mockResolvedValue(createFeedDto),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    model = module.get<Model<IFeed>>(getModelToken('Feed'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all feed', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(feedArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const feed = await service.findAll(paginationQueryDto);
      expect(feed).toEqual(feedArray);
    });
  });

  describe('findOne()', () => {
    it('should return one Feed', async () => {
      const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockFeed),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const response = await service.findOne('anyid');
      expect(findSpy).toHaveBeenCalledWith({ _id: 'anyid' });
      expect(response).toEqual(mockFeed);
    });

    it('should throw if find one Feed throws', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn(() => null),
        populate: jest.fn().mockReturnThis(),
      } as any);
      await expect(service.findOne('anyid')).rejects.toThrow(
        new NotFoundException('Feed #anyid not found'),
      );
    });
  });

  describe('create()', () => {
    it('should insert a new organization', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'anyid',
          newspaper: 'firstName #1',
          head: 'head #1',
          news: 'blablablabla',
        }),
      );
      const newFeed = await service.create({
        newspaper: 'firstName #1',
        head: 'head #1',
        news: 'blablablabla',
      });
      expect(newFeed).toEqual({
        _id: 'anyid',
        newspaper: 'firstName #1',
        head: 'head #1',
        news: 'blablablabla',
      });
    });
  });

  describe('update()', () => {
    it('should call FeedSchema update with correct values', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce({
        _id: 'anyid',
        updateFeedDto,
        new: true,
      } as any);

      const updateFeed = await service.update('anyid', updateFeedDto);
      expect(updateFeed).toEqual({
        _id: 'anyid',
        updateFeedDto,
        new: true,
      });
    });

    it('should throw if FeedSchema throws', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new NotFoundException('Organization #anyid not found'),
        );
      await expect(service.update('anyid', updateFeedDto)).rejects.toThrow(
        new NotFoundException('Organization #anyid not found'),
      );
    });
  });

  describe('remove()', () => {
    it('should call FeedSchema remove with correct value', async () => {
      const removeSpy = jest.spyOn(model, 'findByIdAndRemove');
      const retVal = await service.remove('any id');
      expect(removeSpy).toBeCalledWith('any id');
      expect(retVal).toBeUndefined();
    });

    it('should throw if FeedSchema remove throws', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(service.remove('anyid')).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });
});
