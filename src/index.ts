import fastify from "fastify";
import { initAndTestDatabaseConnection } from "@src/db/db";
import { DependencyHelper } from "@src/di/helper";
import { RouteManager } from "@src/router/manager";
import { getAuthTokenAudience, getAuthTokenIssuer, getAuthTokenSigningKey, getCorsConfig, getNodeEnv, getServerHost, getServerPort } from "@src/config";
import { CorsManager } from "@src/cors/manager";
import { getRouteProviders } from "@src/api/providers";
import logger from "@src/log/logger";

const start = async () =>  {
  const server = fastify();
  
  await initAndTestDatabaseConnection();
  DependencyHelper.initDependencies();
  RouteManager.registerJwtParser(server, getAuthTokenSigningKey(), getAuthTokenIssuer(), getAuthTokenAudience());
  RouteManager.registerRoutes(server, getRouteProviders());
  await CorsManager.registerCorsConfig(server, getCorsConfig());

  server.listen({ host: getServerHost(), port: getServerPort() }, async (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`🏰 server listening at ${address}, environment: ${getNodeEnv()}`);
  });
};

start();