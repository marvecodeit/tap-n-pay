import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
    // Must be on a domain verified in Resend.
    // For testing: 'Tap N Pay <onboarding@resend.dev>'
    this.from =
      this.config.get<string>('EMAIL_FROM') ?? 'Tap N Pay <onboarding@resend.dev>';
  }

  async sendVerificationEmail(to: string, token: string) {
    const appUrl = this.config.getOrThrow<string>('APP_URL');
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    const { data, error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your email - Tap N Pay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Verify your email</h2>
          <p>Welcome to Tap N Pay! Click the button below to confirm your email address.</p>
          <p>
            <a href="${verificationUrl}"
               style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
              Verify email
            </a>
          </p>
          <p>If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
      text: `Verify your email using this link: ${verificationUrl}`,
    });

    if (error) throw new Error(`Failed to send verification email: ${error.message}`);
    return data;
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const { data, error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your password - Tap N Pay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Reset your password</h2>
          <p>Click the button below to choose a new password. This link expires in 30 minutes.</p>
          <p>
            <a href="${resetLink}"
               style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
              Reset password
            </a>
          </p>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
      text: `Reset your password using this link (expires in 30 minutes): ${resetLink}`,
    });

    if (error) throw new Error(`Failed to send password reset email: ${error.message}`);
    return data;
  }
}