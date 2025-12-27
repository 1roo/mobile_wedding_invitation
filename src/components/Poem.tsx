const Poem = () => {
  return (
    <div className="my-10">
      <img
        src="/assets/images/flower.png"
        alt="꽃 이미지"
        width="50px"
        height="120px"
        className="my-8 mx-auto"
      ></img>
      <div className="bg-gray-100 flex flex-col items-center justify-center py-8 mt-5">
        <p>우리 살아가는 일 속에</p>
        <p>파도치는 날 바람부는 날이</p>
        <p>어디 한두 번이랴</p>
        <br />
        <p>그런 날은 조용히 닻을 내리고</p>
        <p>오늘 일을 잠시라도</p>
        <p>낮은 곳에 묻어두어야 한다</p>
        <br />
        <p>우리 사랑하는 일 또한 그 같아서</p>
        <p>파도치는 날 바람부는 날은</p>
        <p>높은 파도를 타지 않고</p>
        <p>낮게 낮게 밀물져야 한다</p>
        <br />
        <p>사랑하는 이여</p>
        <p>상처받지 않는 사랑이 어디 있으랴</p>
        <p>추운 겨울 다 지내고</p>
        <p>꽃 필 차례가 바로 그대 앞에 있다</p>
        <br />
        <br />
        <p>- 김종해, '그대 앞에 봄이 있다'</p>
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

export default Poem;
