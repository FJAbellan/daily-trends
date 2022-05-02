import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get(['daily-trend'])
  public async getAllFeedDailyTrend(@Res() res) {
    const feeds = await this.feedService.findLastFive();
    return res.status(HttpStatus.OK).json(feeds);
  }

  @Get()
  public async getAllFeed(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const feed = await this.feedService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json(feed);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UpdateFeedDto,
  })
  public async getFeed(@Res() res, @Param('id') customerId: string) {
    if (!customerId) {
      throw new NotFoundException('Feed ID does not exist');
    }

    const feed = await this.feedService.findOne(customerId);

    return res.status(HttpStatus.OK).json(feed);
  }

  @Post()
  public async addFeed(@Res() res, @Body() createFeedDto: CreateFeedDto) {
    try {
      const Feed = await this.feedService.create(createFeedDto);
      return res.status(HttpStatus.OK).json({
        message: 'Feed has been created successfully',
        Feed,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Feed not created!',
        status: 400,
      });
    }
  }

  @Put('/:id')
  public async updateFeed(
    @Res() res,
    @Param('id') customerId: string,
    @Body() updateFeedDto: UpdateFeedDto,
  ) {
    try {
      const Feed = await this.feedService.update(customerId, updateFeedDto);
      if (!Feed) {
        throw new NotFoundException('Feed does not exist!');
      }
      return res.status(HttpStatus.OK).json({
        message: 'Feed has been successfully updated',
        Feed,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Feed not updated!',
        status: 400,
      });
    }
  }

  @Delete('/:id')
  public async deleteFeed(@Res() res, @Param('id') feedId: string) {
    if (!feedId) {
      throw new NotFoundException('Feed ID does not exist');
    }

    const Feed = await this.feedService.remove(feedId);

    return res.status(HttpStatus.OK).json({
      message: 'Feed has been deleted',
      Feed,
    });
  }

  @Post()
  public async addDailyTrends(
    @Res() res,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    try {
      const Feed = await this.feedService.create(createFeedDto);
      return res.status(HttpStatus.OK).json({
        message: 'Feed has been created successfully',
        Feed,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Feed not created!',
        status: 400,
      });
    }
  }
}
