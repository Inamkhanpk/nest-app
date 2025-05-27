import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'created' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);