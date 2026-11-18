import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../common/filters/decorator/public-decorator.js';
import { UsersService } from './users.service.js';
import { TerminalApiKeyGuard } from './terminal-api-key.guard.js';
import { CloudinaryService } from '../auth/cloudinary.service.js';
import { TerminalWalletDebitDto } from './dto/terminal-wallet-debit.dto.js';

@Controller('terminal')
export class TerminalProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @UseGuards(TerminalApiKeyGuard)
  @Get('student-profile')
  async getStudentProfile(@Query('student_id') studentId?: string) {
    const matricId = studentId?.trim();
    if (!matricId) {
      throw new BadRequestException('A student ID is required.');
    }

    const student = await this.usersService.findByMatricId(matricId);
    if (!student) {
      throw new NotFoundException(
        `No registered student matches matric ID "${matricId}".`,
      );
    }
    const wallet = await this.usersService.findWalletByUserId(student.id);
    if (!wallet) {
      throw new NotFoundException('Student wallet is not available.');
    }

    return {
      student_id: student.matric_id,
      name: student.fullname,
      department: student.department,
      faculty: student.faculty,
      level: student.level,
      balance_kobo: this.toKobo(wallet.walletBalanace),
      profile_image_url:
        student.profileImagePublicId && student.profileImageFormat
          ? this.cloudinaryService.createAuthenticatedDeliveryUrl(
              student.profileImagePublicId,
              student.profileImageFormat,
            )
          : null,
      is_profile_complete: this.usersService.isProfileComplete(student),
    };
  }

  @Public()
  @UseGuards(TerminalApiKeyGuard)
  @Post('wallet-debit')
  async debitWallet(@Body() dto: TerminalWalletDebitDto) {
    const student = await this.usersService.findByMatricId(dto.student_id);
    if (!student) {
      throw new NotFoundException('No registered student matches this card.');
    }
    return this.usersService.debitStudentWallet(
      student.id,
      dto.amount_kobo,
      dto.reference,
      dto.terminal_id,
      dto.cashier_id,
    );
  }

  private toKobo(naira: string): number {
    const [wholeUnits, fractionalUnits = ''] = naira.split('.');
    return Number(wholeUnits) * 100 + Number(fractionalUnits.padEnd(2, '0').slice(0, 2));
  }
}
