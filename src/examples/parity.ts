import { Graph, Node } from "../lib/graph";
import { Variable, Variable_0 } from "../lib/polynom";
import { ParityFunction, paritySolver } from "../solvers/parity";

export function runParityExample() {
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
