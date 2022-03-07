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
false && runParityExample();

// GENERALIZED BUCHI example
false && runGeneralizedBuchiExample();
runGeneralizedBuchiProblemExample();
