import React from "react";
import MainFilm from "../components/MainFilm";
import PlayButton from "../components/PlayButton";
import Poem from "../components/Poem";
import WeddingDay from "../components/WeddingDay";
import Parents from "../components/Parents";
import Location from "../components/Location";
import InvitationShare from "../components/InvitationShare";
import Gallery from "../components/Gallery";

export default function HomePage() {
  return (
    <>
      <PlayButton />
      <MainFilm />
      <Poem />
      <WeddingDay />
      <Parents />
      <Location />
      <Gallery />
      <InvitationShare />
    </>
  );
}
