import { buchiFixpointIteration } from "./buchi";
import {
  Graph,
  Monome,
  Node,
  Polynom,
  Variable,
  Variable_0,
  Variable_1,
  Vector,
} from "./lib";

Vector.create1Vector(3).simplify();

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
// runBuchiExample();

// parity example
function runParityExample() {
  const [a, b, c, d, e] = Variable.createVariables(["a", "b", "c", "d", "e"]);
  const [nodeU, nodeV, nodeW] = Node.createNodes(["U", "V", "W"]);

  let graph = new Graph(
    [nodeU, nodeV, nodeW],
    [
      [Variable_0, d, Variable_0],
      [c, Variable_0, a],
      [Variable_0, b, e],
    ]
  );

  let targetSet = [nodeW];

  let parityFunction = (node: Node) => {
    let parityMap: [node: Node, parity: number][] = [
      [nodeV, 1],
      [nodeW, 0],
    ];
    return parityMap.find((pair) => pair[0] === node)[1];
  };

  buchiFixpointIteration({
    graph,
    targetSet,
  });
}
runParityExample();
