import { Box } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

const Ground = ({position}) => {
  return (
    <RigidBody type="fixed" position={position}>
      <CuboidCollider args={[100, 0.2, 100]} />
    </RigidBody>
  );
};

export default Ground;
