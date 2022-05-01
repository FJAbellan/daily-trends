import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Feed extends Document {
  @Prop({ enum: ['ElPais', 'ElMundo'] })
  newspaper: string;

  @Prop()
  head: string;

  @Prop()
  news: string;

  @Prop({ unique: true })
  date_at: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

// Sets the created_at parameter equal to the current time
FeedSchema.pre('save', function (next) {
  const now = new Date();
  this.date_at = now;
  if (!this.date_at) {
    this.date_at = now;
  }
  next();
});
