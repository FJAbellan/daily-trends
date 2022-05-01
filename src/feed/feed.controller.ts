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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private customersService: FeedService) {}

  @Get()
  public async getAllFeed(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const feed = await this.customersService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json(feed);
  }

  @Get('/:id')
  public async getFeed(@Res() res, @Param('id') customerId: string) {
    if (!customerId) {
      throw new NotFoundException('Feed ID does not exist');
    }

    const Feed = await this.customersService.findOne(customerId);

    return res.status(HttpStatus.OK).json(Feed);
  }

  @Post()
  public async addFeed(@Res() res, @Body() createFeedDto: CreateFeedDto) {
    try {
      const Feed = await this.customersService.create(createFeedDto);
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
      const Feed = await this.customersService.update(
        customerId,
        updateFeedDto,
      );
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
  public async deleteFeed(@Res() res, @Param('id') customerId: string) {
    if (!customerId) {
      throw new NotFoundException('Feed ID does not exist');
    }

    const Feed = await this.customersService.remove(customerId);

    return res.status(HttpStatus.OK).json({
      message: 'Feed has been deleted',
      Feed,
    });
  }
}
