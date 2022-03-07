import { Graph, Node } from "../lib/graph";
import { smartFixedPoint } from "../lib/helpers";
import { Variable_0, Vector } from "../lib/polynom";

let generalizedBuchiFixpointIterationFunction = ({
  graph,
  node,
  targetSets,
  j,
  Y,
  Z,
}: {
  graph: Graph;
  node: Node;
  targetSets: Node[][];
  j: number;
  Y: Vector;
  Z: Vector;
}) => {
  let isPlayer0 = true;
  let isInTargetSet = targetSets[j].includes(node);

  let successors = graph.getEdges(node);
  let result = Variable_0.toPolynom();

  if (isPlayer0 && isInTargetSet) {
    // sum with Y
    successors.forEach((edge, nodeIndex) => {
      // edge * Y[nodeIndex]
      let edgeValue = edge.toPolynom();
      let yValue = Y.getEntry(nodeIndex);
      result = result.add(edgeValue.multiply(yValue));
    });
  }

  if (isPlayer0 && !isInTargetSet) {
    // sum with Z
    successors.forEach((edge, nodeIndex) => {
      // edge * Z[nodeIndex]
      let edgeValue = edge.toPolynom();
      let zValue = Z.getEntry(nodeIndex);
      result = result.add(edgeValue.multiply(zValue));
    });
  }

  if (!isPlayer0) {
    throw new Error("not implemented");
  }

  return result;
};

export function generalizedBuchiSolver({
  graph,
  targetSets,
}: {
  graph: Graph;
  targetSets: Node[][];
}): Vector {
  const nodeCount = graph.getNodes().length;
  let Y = Vector.create1Vector(nodeCount);

  return smartFixedPoint(Y, (Y) => {
    console.log("Y", Y.toString());

    let ZZ = [];

    for (let j = 0; j < targetSets.length; j++) {
      let Z = Vector.create0Vector(nodeCount);

      Z = smartFixedPoint(Z, (Z) => {
        // console.log("Z", Z.toString());

        let nextZ = Z.getEntries().map((zEntry, nodeIndex) => {
          return generalizedBuchiFixpointIterationFunction({
            graph,
            node: graph.getNode(nodeIndex),
            targetSets,
            j,
            Y,
            Z,
          });
        });

        return new Vector(nextZ).simplify();
      });

      ZZ.push(Z);
    }

    // multiply all component wise
    let multiplyResult = Vector.create1Vector(nodeCount);
    ZZ.forEach(
      (Z) => (multiplyResult = multiplyResult.multiplyComponentwise(Z))
    );
    return multiplyResult.simplify();
  });
}
