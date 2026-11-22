import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { Main, DURATION } from "./engine/Main";
import { CharacterSheet } from "./current/book";
import { ChannelLogo } from "./channelart/Logo";
import { ChannelBanner } from "./channelart/Banner";

const Sheet: React.FC = () => <CharacterSheet t={useCurrentFrame() / 30} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Episode" component={Main} durationInFrames={Math.ceil(DURATION * 30)} fps={30} width={1080} height={1920} />
    <Composition id="BookSheet" component={Sheet} durationInFrames={60} fps={30} width={1080} height={1920} />
    <Composition id="ChannelLogo" component={ChannelLogo} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
  </>
);
