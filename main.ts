import { buchiSolver } from "./buchi";
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
import { ParityFunction, paritySolver } from "./parity";

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

  buchiSolver({
    graph,
    targetSet,
  });
}
// runBuchiExample();

// parity example as BUCHI game
function runParityExampleAsBuchiGame() {
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

  let Y = buchiSolver({
    graph,
    targetSet,
  });

  console.log("------");
  console.log("v:", Y.getEntry(1).toString());
}
// runParityExampleAsBuchiGame();

// PARITY example
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

  let parityFunction: ParityFunction = (node: Node) => {
    let parityMap: [node: Node, parity: number][] = [
      [nodeU, 0],
      [nodeV, 1],
      [nodeW, 2],
    ];
    return parityMap.find((pair) => pair[0] === node)[1];
  };

  let X = paritySolver({
    graph,
    parityFunction,
    parityCount: 3,
  });

  console.log("------");
  console.log("X", X.toString());
  console.log("v:", X.getEntry(1).toString());
}
runParityExample();
