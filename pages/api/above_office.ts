import type { NextApiRequest, NextApiResponse } from "next";
import { CacheGateway } from "../../gateways/cache.gateway";
import { FileCacheGateway } from "../../gateways/file.cache.gateway";
import { N2YOSatelliteGateway } from "../../gateways/n2yo.satellite.gateway";
import {
  GetGalileoAbovePayload,
  SatelliteGateway,
} from "../../gateways/satellite.gateway";

import secrets from "../../secrets.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const satelliteGateway: SatelliteGateway = new N2YOSatelliteGateway(
    new URL(secrets.api.baseURL),
    secrets.api.key
  );
  const cacheGateway: CacheGateway<GetGalileoAbovePayload> =
    new FileCacheGateway(secrets.cache.file, secrets.cache.duration);

  const cached = await cacheGateway.get();
  if (!cached.expired && cached.data !== null) {
    return res.status(200).json(cached.data);
  }

  const result = await satelliteGateway.getGalileoAbove(secrets.office);

  const satellites = result.results.sort(
    (sat1, sat2) => sat1.altitude - sat2.altitude
  );

  const response = {
    count: result.count,
    results: satellites,
  };

  res.status(200).json(response);
  cacheGateway.set(response);
}
