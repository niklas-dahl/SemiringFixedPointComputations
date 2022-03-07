import { isEven } from "../lib/helpers";
import { Graph, Node } from "../lib/graph";
import { smartFixpoint } from "../lib/helpers";
import { Variable_0, Vector } from "../lib/polynom";

export type ParityFunction = (node: Node) => number;

let parityFixpointIterationFunction = ({
  graph,
  node,
  parityFunction,
  XX,
}: {
  graph: Graph;
  node: Node;
  parityFunction: ParityFunction;
  XX: Vector[];
}) => {
  let isPlayer0 = true;
  let parity = parityFunction(node);

  let successors = graph.getEdges(node);
  let result = Variable_0.toPolynom();

  if (isPlayer0) {
    // sum with Y
    successors.forEach((edge, nodeIndex) => {
      // edge * Y[nodeIndex]
      let edgeValue = edge.toPolynom();
      let yValue = XX[parity].getEntry(nodeIndex);
      result = result.add(edgeValue.multiply(yValue));
    });
  }

  if (!isPlayer0) {
    throw new Error("not implemented");
  }

  return result;
};

export function paritySolver(
  {
    graph,
    parityFunction,
    parityCount,
  }: {
    graph: Graph;
    parityFunction: ParityFunction;
    parityCount: number;
  },
  fixpointDepth = 0,
  XX: Vector[] = []
): Vector {
  const nodeCount = graph.getNodes().length;

  let FixpointStart: Vector;
  if (isEven(fixpointDepth)) {
    FixpointStart = Vector.create1Vector(nodeCount);
  } else {
    FixpointStart = Vector.create0Vector(nodeCount);
  }

  return smartFixpoint(FixpointStart, (Z) => {
    console.log(
      "  ".repeat(fixpointDepth),
      `X[${fixpointDepth}]`,
      Z.toString()
    );

    if (fixpointDepth === parityCount - 1) {
      let nextZ = Z.getEntries().map((zEntry, nodeIndex) => {
        return parityFixpointIterationFunction({
          graph,
          node: graph.getNode(nodeIndex),
          parityFunction,
          XX: [...XX, Z],
        });
      });

      return new Vector(nextZ).simplify();
    } else {
      return paritySolver(
        {
          graph,
          parityFunction,
          parityCount,
        },
        fixpointDepth + 1,
        [...XX, Z]
      );
    }
  });
}
