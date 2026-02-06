import { randomiser } from "./index";

// Define the types of resources
export type Resource = "wood" | "brick" | "ore" | "hay" | "sheep" | "desert";

export type NumberOfPlayers = 4 | 5 | 6;

export interface Player {
  name: string;
  color: string;
}

export interface HexPosition {
  x: number;
  y: number;
  vertices: number[];
  edges: number[];
  adjacent: number[];
  resource?: Resource;
  number?: number;
}

export const portPositions = {
  4: [
    {
      x: -0.7,
      y: -4.7,
      resource: "all",
      rotation: -30,
    },
    {
      x: 2.7,
      y: -4.6,
      resource: "all",
      rotation: 30,
    },
    {
      x: -3.7,
      y: -2.9,
      resource: "sheep",
      rotation: -30,
    },
    {
      x: 4.4,
      y: -1.7,
      resource: "brick",
      rotation: -30,
    },
    {
      x: -5.4,
      y: 0,
      resource: "all",
      rotation: -90,
    },
    {
      x: 4.4,
      y: 1.7,
      resource: "wood",
      rotation: 90,
    },
    {
      x: -3.7,
      y: 3,
      resource: "ore",
      rotation: -30,
    },
    {
      x: -0.7,
      y: 4.7,
      resource: "hay",
      rotation: -30,
    },
    {
      x: 2.7,
      y: 4.7,
      resource: "all",
      rotation: 30,
    },
  ],
  6: [
    {
      x: -2.7,
      y: -6.4,
      resource: "all",
      rotation: -30,
    },
    {
      x: 0.7,
      y: -6.4,
      resource: "sheep",
      rotation: 30,
    },
    {
      x: 3.6,
      y: -4.7,
      resource: "all",
      rotation: 30,
    },
    {
      x: -5.4,
      y: -1.7,
      resource: "ore",
      rotation: 30,
    },
    {
      x: -5.6,
      y: 1.3,
      resource: "all",
      rotation: -30,
    },
    {
      x: -4.4,
      y: 3.4,
      resource: "hay",
      rotation: 30,
    },
    {
      x: -2.7,
      y: 6.5,
      resource: "all",
      rotation: -30,
    },
    {
      x: 0.7,
      y: 6.5,
      resource: "wood",
      rotation: 30,
    },
    {
      x: 3.4,
      y: 5.2,
      resource: "all",
      rotation: 90,
    },
    {
      x: 4.65,
      y: 3.05,
      resource: "brick",
      rotation: 30,
    },
    {
      x: 6.4,
      y: 0,
      resource: "all",
      rotation: 90,
    },
  ],
};

export const playerTurns = {
  4: [0, 1, 2, 3, 3, 2, 1, 0],
  5: [0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
  6: [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0],
};

// Helper function to create the initial board layout
export const createInitialBoard = (
  numberOfPlayer: NumberOfPlayers,
  sameNumberShouldTouch: boolean,
  sameResourcesShouldTouch: boolean,
  scarceResource: Resource
): HexPosition[] => {
  const resources: Resource[] = [
    "wood",
    "wood",
    "wood",
    "wood",
    "brick",
    "brick",
    "brick",
    "ore",
    "ore",
    "ore",
    "hay",
    "hay",
    "hay",
    "hay",
    "sheep",
    "sheep",
    "sheep",
    "sheep",
    "desert",
  ];

  if (numberOfPlayer > 4) {
    resources.push(
      ...([
        "wood",
        "wood",
        "brick",
        "brick",
        "ore",
        "ore",
        "hay",
        "hay",
        "sheep",
        "sheep",
        "desert",
      ] as Resource[])
    );
  }

  const numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

  if (numberOfPlayer > 4) {
    numbers.push(...[...new Set(numbers)]);
  }

  const hexPositions =
    numberOfPlayer === 4
      ? [
          // Row 1 (3 hexes)
          {
            x: -2,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 3, 4],
          },
          {
            x: 0,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 2, 4, 5],
          },
          {
            x: 2,
            y: -3.46,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [5, 6],
          },
          // Row 2 (4 hexes)
          {
            x: -3,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 4, 7, 8],
          },
          {
            x: -1,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 1, 3, 5, 8, 9],
          },
          {
            x: 1,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 2, 4, 6, 9, 10],
          },
          {
            x: 3,
            y: -1.73,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [2, 5, 10, 11],
          },
          // Row 3 (5 hexes)
          {
            x: -4,
            y: 0,
            vertices: [0, 5, 4],
            edges: [4, 5, 0, 3],
            adjacent: [3, 8, 12],
          },
          {
            x: -2,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 4, 7, 9, 12, 13],
          },
          {
            x: 0,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [4, 5, 8, 10, 13, 14],
          },
          {
            x: 2,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [5, 6, 9, 11, 14, 15],
          },
          {
            x: 4,
            y: 0,
            vertices: [0, 5, 2, 1],
            edges: [4, 5, 0, 1, 2],
            adjacent: [6, 10, 15],
          },
          // Row 4 (4 hexes)
          {
            x: -3,
            y: 1.73,
            vertices: [0, 5, 4],
            edges: [4, 5, 0, 3],
            adjacent: [7, 8, 13, 16],
          },
          {
            x: -1,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [8, 9, 12, 14, 16, 17],
          },
          {
            x: 1,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [9, 10, 13, 15, 17, 18],
          },
          {
            x: 3,
            y: 1.73,
            vertices: [0, 5, 2, 1],
            edges: [4, 5, 0, 1, 2],
            adjacent: [10, 11, 14, 18],
          },
          // Row 5 (3 hexes)
          {
            x: -2,
            y: 3.46,
            vertices: [0, 5, 3, 2, 4],
            edges: [4, 5, 0, 2, 3],
            adjacent: [12, 13, 17],
          },
          {
            x: 0,
            y: 3.46,
            vertices: [0, 5, 3, 2, 4],
            edges: [4, 5, 0, 2, 3],
            adjacent: [13, 14, 16, 18],
          },
          {
            x: 2,
            y: 3.46,
            vertices: [0, 5, 1, 3, 2, 4],
            edges: [4, 5, 0, 1, 2, 3],
            adjacent: [14, 15, 17],
          },
        ]
      : [
          // Row 1 (3 hexes)
          {
            x: -2,
            y: -5.19,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 3, 4],
          },
          {
            x: 0,
            y: -5.19,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 2, 4, 5],
          },
          {
            x: 2,
            y: -5.19,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [1, 5, 6],
          },
          // Row 2 (4 hexes)
          {
            x: -3,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 4, 7, 8],
          },
          {
            x: -1,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [0, 1, 3, 5, 8, 9],
          },
          {
            x: 1,
            y: -3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [1, 2, 4, 6, 9, 10],
          },
          {
            x: 3,
            y: -3.46,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [2, 5, 10, 11],
          },
          // Row 3 (5 hexes)
          {
            x: -4,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 8, 12, 13],
          },
          {
            x: -2,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [3, 4, 7, 9, 13, 14],
          },
          {
            x: 0,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [4, 5, 8, 10, 14, 15],
          },
          {
            x: 2,
            y: -1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [5, 6, 9, 11, 15, 16],
          },
          {
            x: 4,
            y: -1.73,
            vertices: [0, 5, 1],
            edges: [4, 5, 0, 1],
            adjacent: [6, 10, 16, 17],
          },
          // Row 4 (6 hexes)
          {
            x: -5,
            y: 0,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [7, 13, 18],
          },
          {
            x: -3,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [7, 8, 12, 14, 18, 19],
          },
          {
            x: -1,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [8, 9, 13, 15, 19, 20],
          },
          {
            x: 1,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [9, 10, 14, 16, 20, 21],
          },
          {
            x: 3,
            y: 0,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [10, 11, 15, 17, 21, 22],
          },
          {
            x: 5,
            y: 0,
            vertices: [0, 5, 1, 2],
            edges: [4, 5, 0, 1, 2],
            adjacent: [11, 16, 22],
          },
          // Row 5 (5 hexes)
          {
            x: -4,
            y: 1.73,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [12, 13, 19, 23],
          },
          {
            x: -2,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [13, 14, 18, 20, 23, 24],
          },
          {
            x: 0,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [14, 15, 19, 21, 24, 25],
          },
          {
            x: 2,
            y: 1.73,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [15, 16, 20, 22, 25, 26],
          },
          {
            x: 4,
            y: 1.73,
            vertices: [0, 5, 1, 2],
            edges: [1, 2, 4, 5, 0],
            adjacent: [16, 17, 21, 26],
          },
          // Row 6 (4 hexes)
          {
            x: -3,
            y: 3.46,
            vertices: [0, 4, 5],
            edges: [3, 4, 5, 0],
            adjacent: [18, 19, 24, 27],
          },
          {
            x: -1,
            y: 3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [19, 20, 23, 25, 27, 28],
          },
          {
            x: 1,
            y: 3.46,
            vertices: [0, 5],
            edges: [4, 5, 0],
            adjacent: [20, 21, 24, 26, 28, 29],
          },
          {
            x: 3,
            y: 3.46,
            vertices: [0, 5, 1, 2],
            edges: [1, 2, 4, 5, 0],
            adjacent: [21, 22, 25, 29],
          },
          // Row 7 (3 hexes)
          {
            x: -2,
            y: 5.19,
            vertices: [0, 3, 4, 5],
            edges: [2, 3, 4, 5, 0],
            adjacent: [23, 24, 28],
          },
          {
            x: 0,
            y: 5.19,
            vertices: [0, 3, 4, 5],
            edges: [2, 3, 4, 5, 0],
            adjacent: [24, 25, 27, 29],
          },
          {
            x: 2,
            y: 5.19,
            vertices: [0, 3, 4, 2, 5, 1],
            edges: [2, 3, 4, 5, 0, 1],
            adjacent: [25, 26, 28],
          },
        ];

  const probabilities: Record<number, number> = {
    6: 5,
    8: 5,
    9: 4,
    5: 4,
    4: 3,
    10: 3,
    3: 2,
    11: 2,
    2: 1,
    12: 1,
  };

  const recursivelyAssignResourceAndNumber = (
    hexPositions: HexPosition[],
    idx: number,
    availableResources: Resource[],
    availableNumbers: number[]
  ) => {
    if (
      idx === hexPositions.length &&
      hexPositions.every((hex) => hex.resource)
    ) {
      return hexPositions;
    }

    const hex = hexPositions[idx];
    const adjacentResources = hex.adjacent
      .map((idx: number) => hexPositions[idx].resource)
      .filter(Boolean);
    const adjacentNumbers = hex.adjacent
      .map((idx: number) => hexPositions[idx].number)
      .filter(Boolean);

    const resourceForHex = availableResources.find((resource) => {
      if (!sameResourcesShouldTouch) {
        return !adjacentResources.includes(resource);
      }
      return true;
    });

    if (!resourceForHex) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    const resourceIndex = availableResources.indexOf(resourceForHex);

    let numberForHex =
      availableNumbers.find((number) => {
        if (!sameNumberShouldTouch) {
          return !adjacentNumbers.includes(number);
        }
        return true;
      }) || 0;

    if (scarceResource && resourceForHex === scarceResource) {
      // check if numberForHex has least probability among availableNumbers
      // if not, find the number with least probability
      // swap the number with numberForHex and update availableNumbers
      const probabilitiesForAvailableNumbers = availableNumbers.map(
        (number) => probabilities[number]
      );
      const probabilityForNumberForHex = probabilities[numberForHex];
      const minProbability = Math.min(...probabilitiesForAvailableNumbers);

      if (minProbability > 2 && probabilityForNumberForHex > 2) {
        return recursivelyAssignResourceAndNumber(
          hexPositions,
          0,
          randomiser(resources),
          randomiser(numbers)
        );
      }

      if (probabilityForNumberForHex > minProbability) {
        const minProbabilityNumber = availableNumbers.find(
          (number) => probabilities[number] === minProbability
        );

        if (minProbabilityNumber && minProbabilityNumber !== numberForHex) {
          numberForHex = minProbabilityNumber;
          const numberIndex = availableNumbers.indexOf(numberForHex);
          availableNumbers[numberIndex] = numberForHex;
        }
      }
    }

    if (availableNumbers.length && !numberForHex) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    const numberIndex =
      availableNumbers.length && availableNumbers.indexOf(numberForHex);

    const newCopyOfHexPositions = [...hexPositions];
    newCopyOfHexPositions[idx] = {
      ...hex,
      resource: resourceForHex,
      number: resourceForHex !== "desert" ? numberForHex : undefined,
    };

    const newAvailableResources = [...availableResources];
    newAvailableResources.splice(resourceIndex, 1);

    const newAvailableNumbers = [...availableNumbers];
    if (resourceForHex !== "desert") {
      newAvailableNumbers.splice(numberIndex, 1);
    }

    const result: HexPosition[] = recursivelyAssignResourceAndNumber(
      newCopyOfHexPositions,
      idx + 1,
      newAvailableResources,
      newAvailableNumbers
    );

    if (!result.every((hex) => hex.resource)) {
      return recursivelyAssignResourceAndNumber(
        hexPositions,
        0,
        randomiser(resources),
        randomiser(numbers)
      );
    }

    return result;
  };

  return recursivelyAssignResourceAndNumber(
    hexPositions as HexPosition[],
    0,
    randomiser(resources),
    randomiser(numbers)
  );
};
