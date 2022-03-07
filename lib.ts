export class Vector {
  constructor(private readonly entries: Polynom[]) {}

  getEntry(n: number) {
    return this.entries[n];
  }

  getEntries() {
    return this.entries;
  }

  simplify() {
    return new Vector(this.entries.map((entry) => entry.simplify()));
  }

  toString() {
    return "(" + this.entries.map((entry) => entry.toString()).join(", ") + ")";
  }

  static create0Vector(length: number) {
    let entries = [];
    for (let i = 0; i < length; i++) {
      entries.push(
        new Polynom([new Monome([new VariableExpression(Variable_0, 1)])])
      );
    }
    return new Vector(entries);
  }

  static create1Vector(length: number) {
    let entries = [];
    for (let i = 0; i < length; i++) {
      entries.push(
        new Polynom([new Monome([new VariableExpression(Variable_1, 1)])])
      );
    }
    return new Vector(entries);
  }
}

export class Polynom {
  constructor(private readonly monomes: Monome[]) {
    if (monomes.length === 0) {
      throw new Error("empty polynome");
    }
  }

  add(polynom: Polynom) {
    return new Polynom([...this.monomes, ...polynom.monomes]);
  }

  multiply(polynom: Polynom) {
    // multiply monomes pairwise
    let resultMonomes: Monome[] = [];
    this.monomes.forEach((monome) => {
      polynom.monomes.forEach((monome2) => {
        resultMonomes.push(monome.multiply(monome2));
      });
    });
    return new Polynom(resultMonomes);
  }

  simplify() {
    let cleanedMonomes = this.monomes.map((monome) => monome.simplify());
    cleanedMonomes = cleanedMonomes.filter((monome) => !monome.isZero());

    if (cleanedMonomes.length === 0) {
      return Variable_0.toPolynom();
    }

    // absorb: a + ab = a
    let absorbed: Monome[] = [];
    cleanedMonomes.forEach((monomeA) => {
      cleanedMonomes.forEach((monomeB) => {
        if (monomeA === monomeB || absorbed.includes(monomeB)) {
          return;
        }

        if (monomeB.includes(monomeA)) {
          absorbed.push(monomeB);
        }
      });
    });
    cleanedMonomes = cleanedMonomes.filter(
      (monom) => !absorbed.includes(monom)
    );

    return new Polynom(cleanedMonomes);
  }

  toString() {
    return this.monomes.map((m) => m.toString()).join(" + ");
  }
}

export class Monome {
  constructor(private readonly parts: VariableExpression[]) {
    if (parts.length === 0) {
      throw new Error("empty monome");
    }
  }

  multiply(monome: Monome) {
    return new Monome([...this.parts, ...monome.parts]);
  }

  includes(monome: Monome) {
    return monome.parts.every((part) => {
      return this.parts.some((part2) => part2.equals(part));
    });
  }

  simplify() {
    return new Monome(this.parts.filter((part) => !part.is1()));
  }

  isZero() {
    return this.parts.some((part) => part.is0());
  }

  toString() {
    return this.parts.map((m) => m.toString()).join(" * ");
  }
}

export class VariableExpression {
  constructor(
    private readonly variable: Variable,
    private readonly exp: number
  ) {}

  equals(varExp: VariableExpression) {
    return this.variable === varExp.variable && this.exp === varExp.exp;
  }

  is0() {
    return this.variable.isBottom();
  }

  is1() {
    return this.variable.isTop();
  }

  toString() {
    let varStr = this.variable.toString();
    if (this.exp === 1) {
      return varStr;
    }
    return `${varStr}^${this.exp}`;
  }
}

export class Variable {
  constructor(private readonly name: string) {}

  static createVariables(names: string[]) {
    return names.map((name) => new Variable(name));
  }

  toPolynom() {
    return new Polynom([new Monome([new VariableExpression(this, 1)])]);
  }

  isBottom() {
    return false;
  }

  isTop() {
    return false;
  }

  toString() {
    return this.name;
  }
}

class BottomVariable extends Variable {
  isBottom(): boolean {
    return true;
  }
}
class TopVariable extends Variable {
  isTop(): boolean {
    return true;
  }
}
export const Variable_0 = new BottomVariable("0");
export const Variable_1 = new TopVariable("1");

// Graph

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
