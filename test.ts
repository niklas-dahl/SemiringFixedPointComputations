import { buchiFixpointIteration } from "./buchi";
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

// BUCHI example
function runBuchiExample() {
  const [a, b, c] = Variable.createVariables(["a", "b", "c"]);
  const [nodeV, nodeW] = Node.createNodes(["V", "W"]);

  let graph = new Graph(
    [nodeV, nodeW],
    [
      [a, b],
      [Variable_0, c],
    ]
  );

  let targetSet = [nodeW];

  buchiFixpointIteration({
    graph,
    targetSet,
  });
}
runBuchiExample();

// parity example
function runParityExample() {
  const [a, b, c] = Variable.createVariables(["a", "b", "c"]);
  const [nodeV, nodeW] = Node.createNodes(["V", "W"]);

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
}
