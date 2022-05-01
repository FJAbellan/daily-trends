import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFeed } from './interfaces/feed.interface';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { Feed } from './schemas/feed.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
  ) {}

  public async findAll(paginationQuery: PaginationQueryDto): Promise<Feed[]> {
    const { limit, offset } = paginationQuery;

    return await this.feedModel.find().skip(offset).limit(limit).exec();
  }

  public async findOne(feedId: string): Promise<Feed> {
    const Feed = await this.feedModel.findById({ _id: feedId }).exec();

    if (!Feed) {
      throw new NotFoundException(`Feed #${feedId} not found`);
    }

    return Feed;
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
