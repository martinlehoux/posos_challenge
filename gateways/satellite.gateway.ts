import { createContext } from "react";

export interface SatelliteGateway {
  getGalileoAbove(args: GetGalileoAboveArgs): Promise<GetGalileoAbovePayload>;
}

export type Satellite = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
};

export type GetGalileoAboveArgs = {
  latitude: number;
  longitude: number;
  altitude: number;
  radius: number;
};

export type GetGalileoAbovePayload = {
  count: number;
  results: Satellite[];
};
