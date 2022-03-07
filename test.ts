import {
  Graph,
  Monome,
  Node,
  Polynom,
  Variable,
  VariableExpression,
  Variable_0,
  Variable_1,
  Vector,
} from "./lib";

let a = new Variable("a");
let b = new Variable("b");
let c = new Variable("c");

// a^2 * b^2 + a^3 * b^1
let polynom = new Polynom([
  new Monome([new VariableExpression(a, 2), new VariableExpression(b, 2)]),
  new Monome([new VariableExpression(a, 3), new VariableExpression(b, 1)]),
]);

function create0Vector(length: number) {
  let entries = [];
  for (let i = 0; i < length; i++) {
    entries.push(
      new Polynom([new Monome([new VariableExpression(Variable_0, 1)])])
    );
  }
  return new Vector(entries);
}

function create1Vector(length: number) {
  let entries = [];
  for (let i = 0; i < length; i++) {
    entries.push(
      new Polynom([new Monome([new VariableExpression(Variable_1, 1)])])
    );
  }
  return new Vector(entries);
}

console.log("polynom", polynom.toString());

let nodeV = new Node("v");
let nodeW = new Node("w");

let graph = new Graph(
  [nodeV, nodeW],
  [
    [a, b],
    [Variable_0, c],
  ]
);

let parityFunction = (node: Node) => {
  let parityMap: [node: Node, parity: number][] = [
    [nodeV, 1],
    [nodeW, 0],
  ];
  return parityMap.find((pair) => pair[0] === node)[1];
};
let nodeInTargetSet = (node: Node) => {
  let targetSet = [nodeW];
  return targetSet.includes(node);
};

let buchiFixpointIterationFunction = ({
  graph,
  node,
  nodeInTargetSet,
  Y,
  Z,
}: {
  graph: Graph;
  node: Node;
  nodeInTargetSet: (node: Node) => boolean;
  Y: Vector;
  Z: Vector;
}) => {
  let isPlayer0 = true;
  let isTargetSet = nodeInTargetSet(node);

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

let Y = create1Vector(2);

function fixpointIteration() {
  let Z = create0Vector(2);
  let iterations = 5;

  for (let i = 0; i < iterations; i++) {
    console.log("Z", Z.toString());

    let nextZ = Z.getEntries().map((zEntry, nodeIndex) => {
      return buchiFixpointIterationFunction({
        graph,
        node: graph.getNode(nodeIndex),
        nodeInTargetSet,
        Y,
        Z,
      });
    });

    Z = new Vector(nextZ).simplify();
  }
}
fixpointIteration();
