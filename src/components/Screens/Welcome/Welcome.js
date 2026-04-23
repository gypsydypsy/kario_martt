import { useState } from "react";
import CharacterSelection from "../CharacterSelection/CharacterSelection";
import Controls from "../Controls/Controls";

const Welcome = ({ handleAddPlayer, error, displayWaitingRoom }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <>
      {!showControls ?
        <CharacterSelection handleAddPlayer={handleAddPlayer} error={error} displayControls={() => setShowControls(true)} />
        :
        <Controls displayWaitingRoom={displayWaitingRoom} />
      }

    </>
  );
};

export default Welcome;
