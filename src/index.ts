import fastify from "fastify";
import { initAndTestDatabaseConnection } from "@src/db/db";
import { DependencyHelper } from "@src/di/helper";
import { RouteManager } from "@src/router/manager";
import { getCorsConfig, getNodeEnv } from "@src/config";
import { CorsManager } from "@src/cors/manager";
import { getRouteProviders } from "@src/api/providers";
import logger from "@src/log/logger";

const start = async () =>  {
  const server = fastify();

  await initAndTestDatabaseConnection();
  DependencyHelper.initDependencies();
  RouteManager.registerRoutes(server, getRouteProviders());
  await CorsManager.registerCorsConfig(server, getCorsConfig());

  server.listen({ host: 'localhost', port: 3009 }, async (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`🏰 server listening at ${address}, environment: ${getNodeEnv()}`);
  });
};

start();