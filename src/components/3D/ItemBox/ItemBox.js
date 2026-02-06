import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/store";
import giftsConfig from "@/config/gifts";

const ItemBox = ({ position, rotation }) => {
  const boxRef = useRef();
  const [isActive, setIsActive] = useState(true);
  const { models, updateGift, localPlayer } = useGameStore();

  const handleCollision = (collision) => {

    if(collision.collider["_parent"].userData?.isPlayer && isActive){
      setTimeout(() => {
        if(collision.collider["_parent"].userData?.id === localPlayer.id){
          let newGift = giftsConfig[Math.floor(Math.random() * giftsConfig.length)]?.name
          updateGift(newGift)
        }
        setIsActive(false);
      }, 100);
      setTimeout(() => {
        setIsActive(true);
      }, 5000);
    }
  };

  useEffect(() => {
    const model = models.find((model) => model.name === "itemBox");

    if (model) {
      const object = model.scene.clone()
      boxRef.current.add(object);
    }
  }, [models]);

  return (
    <RigidBody
      colliders={false}
      userData={{ isGift: true, isActive }}
      sensor={true}
      type="fixed"
      position={position}
      rotation={rotation}
      onIntersectionEnter={handleCollision}
    >
      <CuboidCollider args={[1, 0.01, 1]} position={[0, 0.06, 0]} />
      <group
        ref={boxRef}
        scale={0.03}
        position={[0, 1.25, 0]}
        visible={isActive}
      />
    </RigidBody>
  );
};

export default ItemBox;
