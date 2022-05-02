import { Logger, Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedSchema, Feed } from './schemas/feed.schema';
import { CrawlerService } from './crawler/crawler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
  ],
  providers: [
    FeedService,
    CrawlerService,
    {
      provide: 'LogerService',
      useFactory: async () => {
        return new Logger();
      },
    },
  ],

  controllers: [FeedController],
})
export class FeedModule {}
