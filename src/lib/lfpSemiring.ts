import { Polynom, Variable_0, Variable_1 } from "./polynom";

export interface SemiRing<K> {
  add: (a: K, b: K) => K;
  multiply: (a: K, b: K) => K;
  zero: K;
  one: K;
  potenzInfinity?: (a: K) => K;
}

export const BooleanSemiRing: SemiRing<boolean> = {
  add: (a, b) => a || b,
  multiply: (a, b) => a && b,
  zero: false,
  one: true,
};

export const PolynomSemiRing: SemiRing<Polynom> = {
  add: (a, b) => a.add(b).simplify(),
  multiply: (a, b) => a.multiply(b).simplify(),
  zero: Variable_0.toPolynom(),
  one: Variable_1.toPolynom(),
  potenzInfinity: (a) => a.potenzInfinity(),
};

export type Relation<K, U> = (...elm: U[]) => K;

// allow a value or an infix expression
export type ValueExpression<T> =
  | T
  | [ValueExpression<T>, (a: T, b: T) => T, ValueExpression<T>];

export function createLFPSemiringSemantics<K, U>({
  semiRing,
  Universe,
}: {
  semiRing: SemiRing<K>;
  Universe: U[];
}) {
  function evalExp<T>(exp: ValueExpression<T>): T {
    if (Array.isArray(exp)) {
      return exp[1](evalExp(exp[0]), evalExp(exp[2]));
    }
    return exp;
  }

  // ∃
  let exists = (formular: (elm: U) => ValueExpression<K>) => {
    let sum = semiRing.zero;
    Universe.forEach((elm) => {
      sum = semiRing.add(sum, evalExp(formular(elm)));
    });
    return sum;
  };

  // ∀
  let all = (formular: (elm: U) => ValueExpression<K>) => {
    let product = semiRing.one;
    Universe.forEach((elm) => {
      product = semiRing.multiply(product, evalExp(formular(elm)));
    });
    return product;
  };

  // ¬
  let not = (a: ValueExpression<K>) => {
    if (a === semiRing.zero) {
      return semiRing.one;
    }
    if (a === semiRing.one) {
      return semiRing.zero;
    }
    throw new Error(`not is not defined for ${a} in semiring`);
  };

  // ∨
  let or = (a: ValueExpression<K>, b: ValueExpression<K>) =>
    semiRing.add(evalExp(a), evalExp(b));

  // ∧
  let and = (a: ValueExpression<K>, b: ValueExpression<K>) =>
    semiRing.multiply(evalExp(a), evalExp(b));

  let runNfixpointIterations = (
    vec: Relation<K, U>,
    iterationFunc: (Y: Relation<K, U>, y: U) => ValueExpression<K>,
    n: number
  ): Relation<K, U> => {
    for (let i = 0; i < 5; i++) {
      let vecNext_array = Universe.map((elm) =>
        evalExp(iterationFunc(vec, elm))
      );
      let nextVec: Relation<K, U> = (elm) =>
        vecNext_array[Universe.indexOf(elm)];
      vec = nextVec;
    }

    return vec;
  };

  let fixpointIteration = (
    vec: Relation<K, U>,
    iterationFunc: (Y: Relation<K, U>, y: U) => ValueExpression<K>
  ): Relation<K, U> => {
    const n = Universe.length;
    // iterate n times
    vec = runNfixpointIterations(vec, iterationFunc, 5);

    // ^ infinity
    if (semiRing.potenzInfinity) {
      let vecNext_array = Universe.map((elm) => vec(elm));
      // console.log(
      //   "vecNext_array",
      //   vecNext_array.map((p) => p.toString()).join("\n")
      // );
      let nextVec: Relation<K, U> = (elm) =>
        semiRing.potenzInfinity(vecNext_array[Universe.indexOf(elm)]);
      vec = nextVec;
    }

    // iterate n times again
    vec = runNfixpointIterations(vec, iterationFunc, 5);

    return vec;
  };

  // lfp
  let lfp = (
    iterationFunc: (Y: Relation<K, U>, y: U) => ValueExpression<K>
  ): Relation<K, U> => {
    let vec: Relation<K, U> = (elm) => semiRing.zero;
    return fixpointIteration(vec, iterationFunc);
  };

  // gfp
  let gfp = (
    iterationFunc: (Y: Relation<K, U>, y: U) => ValueExpression<K>
  ): Relation<K, U> => {
    let vec: Relation<K, U> = (elm) => semiRing.one;
    return fixpointIteration(vec, iterationFunc);
  };

  // HELPERS for formular construction
  let relationFromSet = (set: U[]): Relation<K, U> => {
    return (elm: U) => (set.includes(elm) ? semiRing.one : semiRing.zero);
  };

  let relationFromSetWithTracking = (set: [U[], K][]): Relation<K, U> => {
    return (elmA: U, elmB: U) =>
      set.find((entry) => entry[0][0] === elmA && entry[0][1] === elmB)?.[1] ||
      semiRing.zero;
  };

  let disjunction = (
    start: number,
    end: number,
    formular: (j: number) => K
  ) => {
    let result = semiRing.zero;
    for (let j = start; j < end; j++) {
      result = semiRing.add(result, formular(j));
    }
    return result;
  };

  let conjuntion = (start: number, end: number, formular: (j: number) => K) => {
    let result = semiRing.one;
    for (let j = start; j < end; j++) {
      result = semiRing.multiply(result, formular(j));
    }
    return result;
  };

  return {
    exists,
    all,
    not,
    or,
    and,
    gfp,
    lfp,
    relationFromSet,
    relationFromSetWithTracking,
    disjunction,
    conjuntion,
  };
}
