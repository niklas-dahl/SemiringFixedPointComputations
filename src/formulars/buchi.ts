import { Node } from "../lib/graph";
import {
  createLFPSemiringSemantics,
  PolynomSemiRing,
  Relation,
  ValueExpression,
} from "../lib/lfpSemiring";
import { Polynom, Variable, Variable_0, Vector } from "../lib/polynom";

export function buchiSolverLFP({
  nodes,
  nodesV0,
  nodesV1,
  labeledEdges,
  targetSet,
}: {
  nodes: Node[];
  nodesV0: Node[];
  nodesV1: Node[];
  labeledEdges: [[Node, Node], Variable][];
  targetSet: Node[];
}): Relation<Polynom, Node> {
  let {
    and,
    or,
    exists,
    not,
    all,
    lfp,
    gfp,
    relationFromSet,
    relationFromSetWithTracking,
  } = createLFPSemiringSemantics({
    semiRing: PolynomSemiRing,
    Universe: nodes,
  });

  let F = relationFromSet(targetSet);
  let V0 = relationFromSet(nodesV0);
  let V1 = relationFromSet(nodesV1);
  let E = relationFromSetWithTracking(
    labeledEdges.map((labeledEdge) => [
      labeledEdge[0],
      labeledEdge[1].toPolynom(),
    ])
  );

  type TRelation = Relation<Polynom, Node>;

  let phi = (Y: TRelation, Z: TRelation, z: Node): ValueExpression<Polynom> => [
    [
      F(z),
      and,
      [
        [V0(z), and, exists((u) => [E(z, u), and, Y(u)])],
        or,
        [V1(z), and, all((u) => [E(z, u), and, Y(u)])],
      ],
    ],
    or,
    [
      not(F(z)),
      and,
      [
        [V0(z), and, exists((u) => [E(z, u), and, Z(u)])],
        or,
        [V1(z), and, all((u) => [E(z, u), and, Z(u)])],
      ],
    ],
  ];

  return gfp((Y, y) => lfp((Z, z) => phi(Y, Z, z))(y));
}
