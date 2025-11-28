import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

import { constants } from "../../config";
import logger from "../../config/logger";

const mongoClient = new MongoClient(constants.mongodbUri, {
  maxPoolSize: 5,
});

const db = mongoClient.db(constants.dbName);

const socialProviders =
  constants.googleClientId && constants.googleClientSecret
    ? {
        google: {
          clientId: constants.googleClientId,
          clientSecret: constants.googleClientSecret,
        },
      }
    : undefined;

export const authServer = betterAuth({
  appUrl: constants.frontEndUrl,
  server: {
    baseURL: constants.betterAuthUrl,
  },
  secret: constants.betterAuthSecret,
  trustedOrigins: [constants.frontEndUrl, constants.corsOrigin],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      companyId: { type: "string", required: true },
      role: {
        type: "string",
        required: true,
      },
      first_name: { type: "string", required: true },
      middle_name: { type: "string", required: false },
      last_name: { type: "string", required: true },
      phone_number: { type: "string", required: true },
      username: { type: "string", required: true },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    useSecureCookies: constants.nodeEnv === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: constants.nodeEnv === "production",
    },
  },
  socialProviders,
  database: mongodbAdapter(db, { client: mongoClient }),
});

mongoClient
  .connect()
  .then(() => {
    logger.info("Better Auth MongoDB adapter connected");
  })
  .catch((error) => {
    logger.logError(error as Error, {
      operation: "better-auth-mongo",
    });
  });
