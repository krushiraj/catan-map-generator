import type { Resource, NumberOfPlayers } from "./board";

interface MapSettings {
  numPlayers: NumberOfPlayers;
  noSameResources: boolean;
  noSameNumbers: boolean;
  scarceResource: string;
}

export interface MapData {
  settings: MapSettings;
  hexes: { resource: Resource; number: number }[];
  houses?: string[];
  roads?: string[];
}

const RESOURCE_TO_CHAR: Record<Resource, string> = {
  wood: "w",
  brick: "b",
  ore: "o",
  hay: "h",
  sheep: "s",
  desert: "d",
};

const CHAR_TO_RESOURCE: Record<string, Resource> = {
  w: "wood",
  b: "brick",
  o: "ore",
  h: "hay",
  s: "sheep",
  d: "desert",
};

const SCARCE_TO_CHAR: Record<string, string> = {
  wood: "w",
  brick: "b",
  ore: "o",
  hay: "h",
  sheep: "s",
  "": "n",
};

const CHAR_TO_SCARCE: Record<string, string> = {
  w: "wood",
  b: "brick",
  o: "ore",
  h: "hay",
  s: "sheep",
  n: "",
};

export function encodeMap(
  board: { resource?: Resource; number?: number }[],
  settings: MapSettings,
  houses?: Set<string>,
  roads?: Set<string>
): string {
  const playerCount = settings.numPlayers;
  const noSameResourcesFlag = settings.noSameResources ? "1" : "0";
  const noSameNumbersFlag = settings.noSameNumbers ? "1" : "0";
  const scarceChar = SCARCE_TO_CHAR[settings.scarceResource] ?? "n";
  const settingsStr = `${playerCount}${noSameResourcesFlag}${noSameNumbersFlag}${scarceChar}`;

  const hexParts = board.map((hex) => {
    const resourceChar = RESOURCE_TO_CHAR[hex.resource ?? "desert"];
    const num = hex.number ?? 0;
    return `${resourceChar}${num}`;
  });
  const hexStr = hexParts.join("-");

  let placementsStr = "";
  const housesList = houses ? Array.from(houses) : [];
  const roadsList = roads ? Array.from(roads) : [];

  if (housesList.length > 0 || roadsList.length > 0) {
    const housesData = housesList.join(",");
    const roadsData = roadsList.join(",");
    placementsStr = `${housesData};${roadsData}`;
  }

  let raw: string;
  if (placementsStr) {
    raw = `${settingsStr}|${hexStr}|${placementsStr}`;
  } else {
    raw = `${settingsStr}|${hexStr}`;
  }

  return btoa(raw);
}

export function decodeMap(encoded: string): MapData | null {
  try {
    const raw = atob(encoded);

    const segments = raw.split("|");
    if (segments.length < 2 || segments.length > 3) {
      return null;
    }

    const [settingsStr, hexStr, placementsStr] = segments;

    if (settingsStr.length !== 4) {
      return null;
    }

    const playerCount = parseInt(settingsStr[0], 10) as NumberOfPlayers;
    if (playerCount !== 4 && playerCount !== 5 && playerCount !== 6) {
      return null;
    }

    const noSameResourcesFlag = settingsStr[1];
    if (noSameResourcesFlag !== "0" && noSameResourcesFlag !== "1") {
      return null;
    }

    const noSameNumbersFlag = settingsStr[2];
    if (noSameNumbersFlag !== "0" && noSameNumbersFlag !== "1") {
      return null;
    }

    const scarceChar = settingsStr[3];
    if (!(scarceChar in CHAR_TO_SCARCE)) {
      return null;
    }

    const settings: MapSettings = {
      numPlayers: playerCount,
      noSameResources: noSameResourcesFlag === "1",
      noSameNumbers: noSameNumbersFlag === "1",
      scarceResource: CHAR_TO_SCARCE[scarceChar],
    };

    const hexTokens = hexStr.split("-");
    if (hexTokens.length === 0) {
      return null;
    }

    const hexes: { resource: Resource; number: number }[] = [];
    for (const token of hexTokens) {
      if (token.length < 2) {
        return null;
      }
      const resourceChar = token[0];
      if (!(resourceChar in CHAR_TO_RESOURCE)) {
        return null;
      }
      const numStr = token.slice(1);
      const num = parseInt(numStr, 10);
      if (isNaN(num)) {
        return null;
      }
      hexes.push({
        resource: CHAR_TO_RESOURCE[resourceChar],
        number: num,
      });
    }

    let houses: string[] | undefined;
    let roads: string[] | undefined;

    if (placementsStr !== undefined) {
      const placementParts = placementsStr.split(";");
      if (placementParts.length !== 2) {
        return null;
      }

      const [housesData, roadsData] = placementParts;
      houses = housesData.length > 0 ? housesData.split(",") : [];
      roads = roadsData.length > 0 ? roadsData.split(",") : [];
    }

    const result: MapData = { settings, hexes };
    if (houses !== undefined) {
      result.houses = houses;
    }
    if (roads !== undefined) {
      result.roads = roads;
    }

    return result;
  } catch {
    return null;
  }
}
