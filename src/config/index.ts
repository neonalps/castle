import { CorsConfig } from "@src/cors/manager";
import { HttpMethod } from "@src/http/constants";
import { TokenConfig } from "@src/modules/auth/service";
import { CryptoConfig } from "@src/modules/crypto/service";
import { checkValidHttpMethod, getAllowedHttpMethods } from "@src/util/common";
import dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

const nodeEnv = env.get('NODE_ENV').required().asString();
const dbConnectionUrl = env.get('DB_CONNECTION_URL').required().asString();
const serverHost = env.get("HOST").required().asString();
const serverPort = env.get('PORT').required().asPortNumber();

const accessTokenValiditySeconds = env.get("ACCESS_TOKEN_VALIDITY_SECONDS").required().asIntPositive();
const refreshTokenValiditySeconds = env.get("REFRESH_TOKEN_VALIDITY_SECONDS").required().asIntPositive();
const authTokenAudience = env.get("AUTH_TOKEN_AUDIENCE").required().asString();
const authTokenIssuer = env.get("AUTH_TOKEN_ISSUER").required().asString();
const authTokenSigningKey = env.get("AUTH_TOKEN_SIGNING_KEY").required().asString();
const corsAllowedMethods = env.get("CORS_ALLOWED_METHODS").required().asString();
const corsAllowedOrigins = env.get("CORS_ALLOWED_ORIGINS").required().asString();
const cryptoKeySymmetric = env.get("CRYPTO_KEY_SYMMETRIC").required().asString();

const parseAllowedMethods = (methods: string): HttpMethod[] => {
    const methodStrings = methods.split(",");

    if (!methodStrings.every(method => checkValidHttpMethod(method))) {
        throw new Error(`Illegal value in allowed CORS methods detected. All values must be one of: ${getAllowedHttpMethods().join(", ")}`);
    }

    return methodStrings as HttpMethod[];
};

const corsConfig: CorsConfig = {
    allowedOrigins: corsAllowedOrigins.split(","),
    allowedMethods: parseAllowedMethods(corsAllowedMethods),
};

const cryptoConfig: CryptoConfig = {
    algorithm: {
        hash: 'sha256',
    },
    joinChar: ':',
    symmetricKey: cryptoKeySymmetric,
};

const tokenConfig: TokenConfig = {
    accessTokenValiditySeconds,
    refreshTokenValiditySeconds,
    audience: authTokenAudience,
    issuer: authTokenIssuer,
    signingKey: authTokenSigningKey,
};

export const getNodeEnv = () => nodeEnv;
export const getCorsConfig = () => corsConfig;
export const getDbConnectionUrl = () => dbConnectionUrl;
export const getServerHost = () => serverHost;
export const getServerPort = () => serverPort;
export const getAccessTokenValiditySeconds = () => accessTokenValiditySeconds;
export const getRefreshTokenValiditySeconds = () => refreshTokenValiditySeconds;
export const getAuthTokenAudience = () => authTokenAudience;
export const getAuthTokenIssuer = () => authTokenIssuer;
export const getAuthTokenSigningKey = () => authTokenSigningKey;
export const getCryptoConfig = () => cryptoConfig;
export const getCryptoKeySymmetric = () => cryptoKeySymmetric;
export const getTokenConfig = () => tokenConfig;