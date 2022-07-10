import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import {
  GetGalileoAbovePayload,
  Satellite,
} from "../gateways/satellite.gateway";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  const fetchSatellites = useCallback(async () => {
    setIsLoading(true);
    const data: GetGalileoAbovePayload = await fetch("/api/above_office").then(
      (res) => res.json()
    );
    setSatellites(data.results);
    setIsLoading(false);
  }, [setSatellites, setIsLoading]);

  useEffect(() => {
    fetchSatellites();
  }, [fetchSatellites]);

  return (
    <div>
      <Head>
        <title>Galileo Locator</title>
        <link rel="icon" href="/galileo_logo.svg" />
      </Head>

      <main className="flex flex-col items-center p-4 gap-4 w-full">
        <button
          onClick={fetchSatellites}
          className="bg-blue-500 hover:bg-blue-700 py-2 px-4 font-bold text-white rounded"
        >
          Get satellites
        </button>

        <table className="w-full table-auto font-mono">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Altitude</th>
            </tr>
          </thead>
          <tbody>
            {satellites.map((satellite) => (
              <tr key={satellite.id} className="hover:bg-blue-300">
                <td>{satellite.name}</td>
                <td className="tabular-nums text-right">
                  {satellite.latitude.toFixed(4)} °
                </td>
                <td className="tabular-nums text-right">
                  {satellite.longitude.toFixed(4)} °
                </td>
                <td className="tabular-nums text-right">
                  {satellite.altitude.toFixed(4)} km
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={4}>
                  <div className="text-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && satellites.length === 0 && (
              <tr>
                <td colSpan={4}>No satellite found</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Home;
