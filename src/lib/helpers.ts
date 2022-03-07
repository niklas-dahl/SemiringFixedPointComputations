import { Vector } from "./polynom";

export function smartFixpoint(
  Set: Vector,
  fixPointIteration: (Set: Vector) => Vector
) {
  let n = Set.getEntries().length;

  // run n times
  for (let j = 0; j < n; j++) {
    Set = fixPointIteration(Set);
  }

  // ^ infinity
  Set = Set.potenzInfinity();

  // run n times again
  for (let j = 0; j < n; j++) {
    Set = fixPointIteration(Set);
  }

  return Set;
}

export function isEven(n: number) {
  return n % 2 === 0;
}

export function isOdd(n: number) {
  return !isEven(n);
}
