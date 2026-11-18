import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class TerminalWalletDebitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  student_id!: string;

  @IsInt()
  @Min(1)
  @Max(9_999_999)
  amount_kobo!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reference!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  terminal_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cashier_id!: string;
}
