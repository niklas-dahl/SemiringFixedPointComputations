import { runBuchiExample, runParityExampleAsBuchiGame } from "./examples/buchi";
import {
  runGeneralizedBuchiExample,
  runGeneralizedBuchiProblemExample,
} from "./examples/generalizedBuchi";
import { runParityExample } from "./examples/parity";

// BUCHI
false && runBuchiExample();
false && runParityExampleAsBuchiGame();

// PARITY
true && runParityExample();

// GENERALIZED BUCHI
false && runGeneralizedBuchiExample();
false && runGeneralizedBuchiProblemExample();
