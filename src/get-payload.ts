import dotenv from 'dotenv';
import path from 'path';
import payload, { Payload } from 'payload';
import type { InitOptions } from 'payload/config';
import nodemailerSendgrid from 'nodemailer-sendgrid';

dotenv.config({
  path: path.resolve(__dirname, '../.env.local')
});

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET missing!');
  }

  if (cached.client) return cached.client;

  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transportOptions: nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY! }),
        fromAddress: 'amr.hedeiwy@gmail.com',
        fromName: 'DigitalArk'
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {})
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
