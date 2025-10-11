const Gallery = () => {
  return (
    <div>
      <img
        src="/assets/images/flower.png"
        alt="꽃 이미지"
        width="50px"
        height="120px"
        className="my-8 mx-auto"
      ></img>
      <div className="bg-gray-100 flex flex-col items-center justify-center py-8 mt-5">
        <p>지금 그대 앞에</p>
        <p>봄이 있다</p>
        <br />
        <p>눈을 들어 봄을 보라</p>
        <p>고개를 들어 사랑하라</p>
        <br />
        <p>사랑이 어찌</p>
        <p>말로만 되랴</p>
        <br />
        <p>눈물과 땀과 피가</p>
        <p>함께 흐르는 것을</p>
        <br />
        <p>그때 앞에 봄이 있다</p>
        <br />
        <br />
        <p>- 김용택, '그대 앞에 봄이 있다'</p>
      </div>
      <div className="flex flex-col items-center justify-center my-20 text-[17px]">
        <p>저희 두 사람이 함께하는 새로운 시작에</p>
        <p>귀한 걸음으로 축복해 주시면 감사하겠습니다.</p>
        <br />
        <br />
        <p>신랑 김원필 • 신부 하나래</p>
      </div>
    </div>
  );
};

export default Gallery;
