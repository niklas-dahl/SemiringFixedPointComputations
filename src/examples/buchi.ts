import { Graph, Node } from "../lib/graph";
import { Variable, Variable_0 } from "../lib/polynom";
import { buchiSolver } from "../explicitSolvers/buchi";

// BUCHI example
export function runBuchiExample() {
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

// parity example as BUCHI game
export function runParityExampleAsBuchiGame() {
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
