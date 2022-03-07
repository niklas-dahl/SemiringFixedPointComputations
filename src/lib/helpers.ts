import { Vector } from "./polynom";

export function smartFixedPoint(
  Set: Vector,
  fixedPointIteration: (Set: Vector) => Vector
) {
  let n = Set.getEntries().length;

  // run n times
  Set = runFixedPointIterations(Set, fixedPointIteration, n);

  // ^ infinity
  Set = Set.potenzInfinity();

  // run n times again
  Set = runFixedPointIterations(Set, fixedPointIteration, n);

  return Set;
}

export function runFixedPointIterations(
  Set: Vector,
  fixedPointIteration: (Set: Vector) => Vector,
  iterations: number
) {
  let lastSetHash = Set.toString();

  for (let i = 0; i < iterations; i++) {
    Set = fixedPointIteration(Set);
    let newSetHash = Set.toString();

    if (lastSetHash === newSetHash) {
      // console.log("skipped", iterations - i - 1, "iterations");
      break;
    }
    lastSetHash = newSetHash;
  }

  return Set;
}

export function isEven(n: number) {
  return n % 2 === 0;
}

export function isOdd(n: number) {
  return !isEven(n);
}

// actually harder to read
export function superscriptNumber(n: number) {
  let superscriptNumbers = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
  return String(n)
    .split("")
    .map((c) => superscriptNumbers[Number(c)])
    .join("");
}
