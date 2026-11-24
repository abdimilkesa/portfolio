import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function notifyContact(entry) {
  if (!env.smtp.host || !env.smtp.notifyTo) return;

  try {
    const transport = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
    await transport.sendMail({
      from: env.smtp.from || env.smtp.user,
      to: env.smtp.notifyTo,
      replyTo: entry.email,
      subject: `Portfolio message: ${entry.subject}`,
      text: `${entry.name} <${entry.email}>\n\n${entry.message}`,
    });
  } catch (error) {
    logger.warn(`Contact notification email failed: ${error.message}`);
  }
}
