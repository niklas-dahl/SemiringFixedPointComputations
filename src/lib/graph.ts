import { Variable, Vector } from "./polynom";

export class Graph {
  constructor(private nodes: Node[], private edges: Variable[][]) {}

  getNodeIndex(node: Node): number {
    return this.nodes.indexOf(node);
  }

  getNode(nodeIndex: number) {
    return this.nodes[nodeIndex];
  }

  getNodes() {
    return this.nodes;
  }

  getEdges(node: Node): Variable[] {
    return this.edges[this.getNodeIndex(node)];
  }
}

export class Node {
  constructor(private name: string) {}

  static createNodes(names: string[]) {
    return names.map((name) => new Node(name));
  }

  toString() {
    return this.name;
  }
}
