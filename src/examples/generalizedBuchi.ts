import { Graph, Node } from "../lib/graph";
import { Variable, Variable_0 } from "../lib/polynom";
import {
  generalizedBuchiSolver,
  generalizedBuchiSolverExtended,
} from "../solvers/generalizedBuchi";

export function runGeneralizedBuchiExample() {
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

  let targetSets = [[nodeU], [nodeW]];

  let X = generalizedBuchiSolver({
    graph,
    targetSets,
  });

  console.log("------");
  console.log("X", X.toString());
  console.log("v:", X.getEntry(1).toString());
}

// GENERALIZED BUCHI problem example
export function runGeneralizedBuchiProblemExample() {
  const [a, b, c, d, e, x] = Variable.createVariables([
    "a",
    "b",
    "c",
    "d",
    "e",
    "x",
  ]);
  const [nodeU, nodeV, nodeW, nodeX] = Node.createNodes(["U", "V", "W", "X"]);

  let graph = new Graph(
    [nodeU, nodeV, nodeW, nodeX],
    [
      [Variable_0, d, Variable_0, Variable_0],
      [c, Variable_0, a, Variable_0],
      [Variable_0, b, e, Variable_0],
      [Variable_0, x, Variable_0, Variable_0],
    ]
  );

  let targetSets = [[nodeU], [nodeW]];

  let X = generalizedBuchiSolver({
    graph,
    targetSets,
  });

  console.log("------");
  console.log("Vector", X.toString());
  console.log("V:", X.getEntry(1).toString());
  console.log("X:", X.getEntry(3).toString());

  console.log("------ extended version");
  X = generalizedBuchiSolverExtended({
    graph,
    targetSets,
  });

  console.log("------");
  console.log("Vector", X.toString());
  console.log("V:", X.getEntry(1).toString());
  console.log("X:", X.getEntry(3).toString());
}
