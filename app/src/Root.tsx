import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { Main, DURATION } from "./engine/Main";
import { CharacterSheet } from "./current/book";

const Sheet: React.FC = () => <CharacterSheet t={useCurrentFrame() / 30} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Episode" component={Main} durationInFrames={Math.ceil(DURATION * 30)} fps={30} width={1080} height={1920} />
    <Composition id="BookSheet" component={Sheet} durationInFrames={60} fps={30} width={1080} height={1920} />
  </>
);
