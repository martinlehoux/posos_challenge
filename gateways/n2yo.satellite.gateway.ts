import {
  GetGalileoAboveArgs,
  GetGalileoAbovePayload,
  Satellite,
  SatelliteGateway,
} from "./satellite.gateway";

export class N2YOSatelliteGateway implements SatelliteGateway {
  private galileoCategory = 22;
  constructor(private baseURL: URL, private apiKey: string) {}

  async getGalileoAbove(
    args: GetGalileoAboveArgs
  ): Promise<GetGalileoAbovePayload> {
    const url = this.buildURL(args);

    const res = await fetch(url);

    const payload: N2YOAPIResponsePayload | null = await res.json();

    return {
      count: payload?.info.satcount ?? 0,
      results: payload?.above.map(this.mapToSatellite) ?? [],
    };
  }

  private buildURL(args: GetGalileoAboveArgs): URL {
    const url = new URL(
      `above/${args.latitude}/${args.longitude}/${args.altitude}/${args.radius}/${this.galileoCategory}`,
      this.baseURL
    );
    url.searchParams.append("apiKey", this.apiKey);
    return url;
  }

  private mapToSatellite(
    entry: N2YOAPIResponsePayload["above"][number]
  ): Satellite {
    return {
      id: entry.satid,
      name: entry.satname,
      latitude: entry.satlat,
      longitude: entry.satlng,
      altitude: entry.satalt,
    };
  }
}

type N2YOAPIResponsePayload = {
  info: {
    category: string;
    transactionscount: number;
    satcount: number;
  };
  above: Array<{
    satid: number;
    satname: string;
    intDesignator: string;
    launchDate: string;
    satlat: number;
    satlng: number;
    satalt: number;
  }>;
};
