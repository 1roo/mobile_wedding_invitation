import React from "react";
import MainFilm from "./components/MainFilm";
import PlayButton from "./components/PlayButton";
import Poem from "./components/Poem";
import WeddingDay from "./components/WeddingDay";
import Parents from "./components/Parents";
import Location from "./components/Location";
import InvitationShare from "./components/InvitationShare";
import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="w-screen max-w-[380px] mx-auto relative">
      <PlayButton />
      <MainFilm />
      <Poem />
      <WeddingDay />
      <Parents />
      <Location />
      <Gallery />
      <InvitationShare />
    </div>
  );
}

export default App;
