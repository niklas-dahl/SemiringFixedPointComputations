import * as _ from "lodash";
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
      entries.push(new Polynom([new Monome([Variable_0])]));
    }
    return new Vector(entries);
  }

  static create1Vector(length: number) {
    let entries = [];
    for (let i = 0; i < length; i++) {
      entries.push(new Polynom([new Monome([Variable_1])]));
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
        if (
          monomeA === monomeB ||
          absorbed.includes(monomeA) ||
          absorbed.includes(monomeB)
        ) {
          return;
        }

        if (monomeB.includes(monomeA)) {
          false &&
            console.log(
              "absorbing",
              monomeB.toString(),
              "with",
              monomeA.toString()
            );
          absorbed.push(monomeB);
        }
      });
    });
    cleanedMonomes = cleanedMonomes.filter(
      (monom) => !absorbed.includes(monom)
    );

    // idempotent: a + a = a
    // special case of absorb

    return new Polynom(cleanedMonomes);
  }

  toString() {
    return this.monomes.map((m) => m.toString()).join(" + ");
  }
}

export class Monome {
  constructor(private readonly parts: Variable[]) {
    if (parts.length === 0) {
      throw new Error("empty monome");
    }
  }

  multiply(monome: Monome) {
    return new Monome([...this.parts, ...monome.parts]);
  }

  includes(monome: Monome) {
    // count per variable
    let vars = _.countBy(this.parts, (v) => v.toString());
    let otherVars = _.countBy(monome.parts, (v) => v.toString());
    let combinedVars = _.merge({}, vars, otherVars);

    return Object.keys(combinedVars).every((varName) => {
      return (otherVars[varName] || 0) <= (vars[varName] || 0);
    });
  }

  simplify() {
    let cleanedVars = this.parts.filter((part) => !part.isTop());

    if (cleanedVars.length === 0) {
      cleanedVars.push(Variable_1);
    }
    return new Monome(cleanedVars);
  }

  isZero() {
    return this.parts.some((part) => part.isBottom());
  }

  toString() {
    let vars = _.countBy(this.parts, (v) => v.toString());

    return Object.entries(vars)
      .map(([varName, count]) => {
        if (count === 1) {
          return varName;
        }

        if (count > 4) {
          return `${varName}^∞`;
        }
        return `${varName}^${count}`;
      })
      .join(" * ");
  }
}

export class Variable {
  constructor(private readonly name: string) {}

  static createVariables(names: string[]) {
    return names.map((name) => new Variable(name));
  }

  toPolynom() {
    return new Polynom([new Monome([this])]);
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
