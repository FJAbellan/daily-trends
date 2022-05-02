import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFeed } from './interfaces/feed.interface';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { Feed } from './schemas/feed.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CrawlerService } from './crawler/crawler.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FeedService {
  constructor(
    @Inject(CrawlerService) private crawlerService: CrawlerService,
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
  ) {}

  public async findLastFive(): Promise<Feed[]> {
    const feeds = await this.feedModel.find().skip(0).limit(10).exec();
    if (feeds.length < 10) {
      await this.crawlerService.init();
      const feeds = await this.crawlerService.loadElPaisFeed();
      await this.crawlerService.close();
      for (const feed of feeds) {
        await this.feedModel.create(plainToInstance(CreateFeedDto, feed));
      }
    }
    return await this.feedModel.find().skip(0).limit(5).exec();
  }

  public async findAll(paginationQuery: PaginationQueryDto): Promise<Feed[]> {
    const { limit, offset } = paginationQuery;
    return await this.feedModel.find().skip(offset).limit(limit).exec();
  }

  public async findOne(feedId: string): Promise<Feed> {
    const feed = await this.feedModel.findById({ _id: feedId }).exec();
    if (!feed) {
      throw new NotFoundException(`Feed #${feedId} not found`);
    }

    return feed;
  }

  public async create(createFeedDto: CreateFeedDto): Promise<IFeed> {
    const newFeed = await this.feedModel.create(createFeedDto);
    return newFeed;
  }

  public async update(
    feedId: string,
    updateFeedDto: UpdateFeedDto,
  ): Promise<IFeed> {
    const existingFeed = await this.feedModel.findByIdAndUpdate(
      { _id: feedId },
      updateFeedDto,
    );

    if (!existingFeed) {
      throw new NotFoundException(`Feed #${feedId} not found`);
    }

    return existingFeed;
  }

  public async remove(feedId: string): Promise<any> {
    const deletedFeed = await this.feedModel.findByIdAndRemove(feedId);
    return deletedFeed;
  }
}
