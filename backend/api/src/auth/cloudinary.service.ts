import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';

export interface ProfileImageUpload {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface ProfileImageAsset {
  publicId: string;
  format: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadProfileImage(file: ProfileImageUpload): Promise<ProfileImageAsset> {
    const detectedType = this.detectImageType(file.buffer);
    if (!detectedType || detectedType !== file.mimetype) {
      throw new BadRequestException(
        'The profile image must be a valid JPEG, PNG, or WebP file.',
      );
    }

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException(
        'Profile image uploads are not configured.',
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'tapnpay/student-profiles';
    const signature = createHash('sha1')
      .update(
        `folder=${folder}&timestamp=${timestamp}&type=authenticated${apiSecret}`,
      )
      .digest('hex');
    const body = new URLSearchParams({
      api_key: apiKey,
      folder,
      timestamp: String(timestamp),
      type: 'authenticated',
      signature,
      file: `data:${detectedType};base64,${file.buffer.toString('base64')}`,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );

    if (!response.ok) {
      throw new BadGatewayException('Cloudinary could not store the profile image.');
    }

    const result = (await response.json()) as {
      public_id?: unknown;
      format?: unknown;
    };
    if (
      typeof result.public_id !== 'string' ||
      !result.public_id.startsWith(`${folder}/`) ||
      typeof result.format !== 'string'
    ) {
      throw new BadGatewayException(
        'Cloudinary did not return valid profile image details.',
      );
    }

    return { publicId: result.public_id, format: result.format };
  }

  createAuthenticatedDeliveryUrl(publicId: string, format: string): string {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    if (!cloudName || !apiSecret) {
      throw new ServiceUnavailableException(
        'Profile image delivery is not configured.',
      );
    }

    const publicIdWithFormat = `${publicId}.${format}`;
    const signature = createHash('sha1')
      .update(`${publicIdWithFormat}${apiSecret}`)
      .digest('base64url')
      .slice(0, 8);
    const encodedPublicId = publicIdWithFormat
      .split('/')
      .map(encodeURIComponent)
      .join('/');

    return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/authenticated/s--${signature}--/${encodedPublicId}`;
  }

  private detectImageType(buffer: Buffer): string | null {
    if (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    ) {
      return 'image/jpeg';
    }
    if (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ) {
      return 'image/png';
    }
    if (
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
      return 'image/webp';
    }
    return null;
  }
}
