import { MaxLength, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateFeedDto {
  @IsEnum(['ElPais', 'ElMundo'], {
    message: "newspaper must be a valid enum value: 'ElPais', 'ElMundo'",
  })
  @IsNotEmpty()
  readonly newspaper: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly head: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly news: string;
}
