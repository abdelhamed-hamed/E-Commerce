declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: number;
    readonly DB: string;
    readonly NODE_ENV: "development" | "production";
    readonly BASE_URL: string;
    APP_NAME: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRED: string;
    JWT_SECRET_KEY_RESET_PASSWORD: string;
    JWT_EXPIRED_RESET_PASSWORD: string;
    EMAIL_HOST: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK: string;
  }
}
