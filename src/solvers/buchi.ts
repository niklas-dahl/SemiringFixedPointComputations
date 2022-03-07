import { Graph, Node, smartFixpoint, Variable_0, Vector } from "../lib/lib";

let buchiFixpointIterationFunction = ({
  graph,
  node,
  targetSet,
  Y,
  Z,
}: {
  graph: Graph;
  node: Node;
  targetSet: Node[];
  Y: Vector;
  Z: Vector;
}) => {
  let isPlayer0 = true;
  let isTargetSet = targetSet.includes(node);

  let successors = graph.getEdges(node);
  let result = Variable_0.toPolynom();
  if (isPlayer0 && isTargetSet) {
    // sum with Y
    successors.forEach((edge, nodeIndex) => {
      // edge * Y[nodeIndex]
      let edgeValue = edge.toPolynom();
      let yValue = Y.getEntry(nodeIndex);
      result = result.add(edgeValue.multiply(yValue));
    });
  }

  if (isPlayer0 && !isTargetSet) {
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

export function buchiSolver({
  graph,
  targetSet,
}: {
  graph: Graph;
  targetSet: Node[];
}) {
  const nodeCount = graph.getNodes().length;
  let Y = Vector.create1Vector(nodeCount);

  return smartFixpoint(Y, (Y) => {
    console.log("Y", Y.toString());

    let Z = Vector.create0Vector(nodeCount);

    Z = smartFixpoint(Z, (Z) => {
      console.log("Z", Z.toString());

      let nextZ = Z.getEntries().map((zEntry, nodeIndex) => {
        return buchiFixpointIterationFunction({
          graph,
          node: graph.getNode(nodeIndex),
          targetSet,
          Y,
          Z,
        });
      });

      return new Vector(nextZ).simplify();
    });

    console.log();
    return Z;
  });
}
