import { Monome, Polynom, Variable } from "./lib/polynom";

const [a, b, c] = Variable.createVariables(["a", "b", "c"]);

// absorb: bc + abc = bc
let polynom = new Polynom([new Monome([b, c]), new Monome([a, b, c])]);
console.log(polynom.toString());
console.log(polynom.simplify().toString());
console.log("----------");

// absorb: abc + bc = bc
polynom = new Polynom([new Monome([a, b, c]), new Monome([b, c])]);
console.log(polynom.toString());
console.log(polynom.simplify().toString());
console.log("----------");

// idempotent: a + a = a
polynom = new Polynom([new Monome([a, a]), new Monome([a, a])]);
console.log(polynom.toString());
console.log(polynom.simplify().toString());
console.log("----------");
