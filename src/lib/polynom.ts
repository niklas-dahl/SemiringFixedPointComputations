import * as _ from "lodash";

export class Vector {
  static create0Vector(length: number) {
    return Vector.fillVector(new Polynom([new Monome([Variable_0])]), length);
  }

  static create1Vector(length: number) {
    return Vector.fillVector(new Polynom([new Monome([Variable_1])]), length);
  }

  static fillVector(elm: Polynom, length: number) {
    let entries = [];
    for (let i = 0; i < length; i++) {
      entries.push(elm);
    }
    return new Vector(entries);
  }

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

  potenzInfinity() {
    return new Vector(this.entries.map((entry) => entry.potenzInfinity()));
  }

  multiplyComponentwise(vector: Vector) {
    let result = [];
    for (let i = 0; i < this.entries.length; i++) {
      result.push(this.entries[i].multiply(vector.entries[i]));
    }
    return new Vector(result);
  }

  toString() {
    return "(" + this.entries.map((entry) => entry.toString()).join(", ") + ")";
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

  potenzInfinity() {
    return new Polynom(this.monomes.map((monom) => monom.potenzInfinity()));
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

const INFINITY_COUNT_THRESHOLD = 10;
export class Monome {
  constructor(private readonly vars: Variable[]) {
    if (vars.length === 0) {
      throw new Error("empty monome");
    }
  }

  multiply(monome: Monome) {
    return new Monome([...this.vars, ...monome.vars]);
  }

  includes(monome: Monome) {
    // count per variable
    let vars = _.countBy(this.vars, (v) => v.toString());
    let otherVars = _.countBy(monome.vars, (v) => v.toString());
    let combinedVars = _.merge({}, vars, otherVars);

    return Object.keys(combinedVars).every((varName) => {
      let ownCount = vars[varName] || 0;
      let otherCount = otherVars[varName] || 0;

      // cap infinity counts
      ownCount = Math.min(INFINITY_COUNT_THRESHOLD, ownCount);
      otherCount = Math.min(INFINITY_COUNT_THRESHOLD, otherCount);
      return otherCount <= ownCount;
    });
  }

  simplify() {
    let cleanedVars = this.vars.filter((Var) => !Var.isTop());

    if (cleanedVars.length === 0) {
      cleanedVars.push(Variable_1);
    }
    return new Monome(cleanedVars);
  }

  isZero() {
    return this.vars.some((Var) => Var.isBottom());
  }

  potenzInfinity() {
    let infiniyMonomVars: Variable[] = [];
    _.uniq(this.vars).forEach((Var) => {
      for (let i = 0; i < INFINITY_COUNT_THRESHOLD; i++) {
        infiniyMonomVars.push(Var);
      }
    });
    return new Monome(infiniyMonomVars);
  }

  toString() {
    let vars = _.countBy(this.vars, (v) => v.toString());

    return Object.entries(vars)
      .map(([varName, count]) => {
        if (count === 1) {
          return varName;
        }

        if (count >= INFINITY_COUNT_THRESHOLD) {
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
