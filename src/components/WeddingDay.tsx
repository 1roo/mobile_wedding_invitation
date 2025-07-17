const WeddingDay = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10 mt-20">
      <img
        src="/assets/images/wedding_img.png"
        alt="웨딩커플 아이콘"
        className="block p-3 w-72 border border-spacing-1 border-gray-100 rounded-3xl"
      ></img>
      <p className="text-4xl font-medium mt-5">WEDDING DAY</p>
      <p className="text-xl font-normal mt-3">로얄파크컨벤션 1F 파크홀</p>
      <p className="text-xl font-normal mt-3">2026년 3월 28일 토요일</p>
      <p className="text-xl font-normal">오후 2시 30분</p>
      <div className="flex flex-col mx-auto mt-5 py-5 border border-spacing-1 border-gray-100">
        <p className="text-2xl font-medium mb-2 text-center">2026. 03</p>
        <img
          src="/assets/images/calendar.png"
          alt="달력 이미지"
          className="block w-72 "
        ></img>
      </div>
    </div>
  );
};

export default WeddingDay;
