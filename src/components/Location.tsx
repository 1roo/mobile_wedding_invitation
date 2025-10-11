import {
  BusFront,
  CarFront,
  CircleParking,
  Copy,
  TrainFront,
} from "lucide-react";

const Location = () => {
  const address = "서울시 용산구 이태원로 29";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    alert("주소가 복사되었습니다.");
  };

  return (
    <div className="mt-5 mb-10">
      <p className="text-4xl font-medium text-center">Location</p>
      <p className="text-2xl font-normal text-center my-3">
        로얄파크컨벤션 1F 파크홀
      </p>
      <div className="flex justify-center align-middle items-center">
        <p className="text-xl font-normal text-center mr-2">{address}</p>
        <button onClick={handleCopy}>
          <Copy size={20} className="cursor-pointer hover:opacity-70" />
        </button>
      </div>
      <img
        src="/assets/images/map.png"
        alt="식장 지도"
        className="w-screen my-3"
      ></img>
      <div className=" ml-2">
        <div className="w-[340px] h-[1px] bg-gray-300 ml-2 mx-auto mb-5" />
        <div className="flex text-xl items-center mb-2">
          <CarFront />
          자동차
        </div>
        <p>
          ① 한강대교에서 오시는 경우
          <br />
          서울역 방면으로 오셔서 삼각지역 사거리를 지나서 북문으로 우회전 진입
        </p>
        <br />
        <p>
          ② 서울역에서 오시는 경우
          <br />
          한강대교 방면으로 오셔서 삼각지역 사거리에서 좌회전 후 70M 전방에서
          서문으로 좌회전 진입
        </p>
        <br />
        <p>
          ③ 이태원방면에서 오시는 경우 
          <br />
          삼각지역 사거리 방향으로 오시다가 동문으로 우회전 진입 
        </p>
        <br />
        <p>
          ④ 마포(공덕역)에서 오시는 경우
          <br />
          삼각지 고가차도를 넘어 삼각지역 사거리에서 직진 후 70M 전방에서
          서문으로 좌회전 진입 
        </p>
        <br />
        <div className="w-[340px] h-[1px] bg-gray-300 ml-2 mx-auto mb-5" />

        <div className="flex text-xl items-center mb-2">
          <TrainFront />
          지하철
        </div>
        <p>
          ① <span className="text-amber-600">6호선</span> : 삼각지역 12번 출구
          (도보 3분)
        </p>
        <br />
        <p>
          ② <span className="text-blue-400">4호선</span> : 삼각지역 1번 출구
          (도보 5분)
        </p>
        <br />
        <p>
          ③ <span className="text-blue-800">1호선</span> : 남영역 1번 출구 (도보
          7분)
        </p>
        <br />
        <br />
        <div className="w-[340px] h-[1px] bg-gray-300 ml-2 mx-auto mb-5 -mt-5" />

        <div className="flex text-xl items-center mb-2 ">
          <BusFront />
          버스
        </div>
        <p>
          ① 마을버스
          <br />
          용산03 (전쟁기념관 하차)
        </p>
        <br />
        <p>
          ② 간선버스 (전쟁기념관 하차)
          <br />
          110A, 110B, 421, 740, N72. N75
        </p>
        <br />
        <p>
          ③ 간선버스 (삼각지역 하차)
          <br />
          421, N75, 100, 150, 151, 152, 500, 501, 502, 504, 506, 507, 605, 742,
          750A, 750B, 752, N15
        </p>
        <br />
        <br />
        <div className="w-[340px] h-[1px] bg-gray-300 ml-2 mx-auto mb-5 -mt-5" />
        <div className="flex text-xl items-center mb-2">
          <CircleParking />
          주차 (하객 2시간 무료)
        </div>
        <p>- 전쟁기념관내 지상, 지하 주차 가능</p>
        <p>- 지상, 지하 주차 1,000대 가능</p>
      </div>
    </div>
  );
};
export default Location;
