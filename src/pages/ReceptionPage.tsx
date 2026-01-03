import React from "react";
import PlayButton from "../components/PlayButton";
import MainFilm from "../components/MainFilm";
import Poem from "../components/Poem";
import WeddingDay from "../components/WeddingDay";
import Parents from "../components/Parents";
import Location from "../components/Location";
import Gallery from "../components/Gallery";
import InvitationShare from "../components/InvitationShare";
import ReceptionImage from "../components/ReceptionImage";

export default function ReceptionPage() {
  return (
    <>
      <PlayButton />
      <MainFilm />
      <Poem />
      <WeddingDay />
      <Parents />
      <Location />
      <ReceptionImage />
      <Gallery />
      <InvitationShare />
    </>
  );
}
