import { Document } from 'mongoose';

export interface IFeed extends Document {
  readonly newspaper: string;
  readonly head: string;
  readonly news: string;
  readonly date_at: Date;
}
