import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  handleKakaoShare: () => void;
}

const KakaoShareButton = ({ handleKakaoShare }: Props) => {
  const [isHover, setIsHover] = useState(false);

  const kakaoKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY || "";

  useEffect(() => {
    const kakao = (window as any).Kakao;
    if (kakao && !kakao.isInitialized()) {
      kakao.init(kakaoKey);
    }
  }, []);

  return (
    <button
      onClick={handleKakaoShare}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="w-52 text-black px-4 py-2 rounded font-medium transition-colors mb-4 flex items-center justify-center"
      style={{
        backgroundColor: isHover ? "#E9E902" : "#FFFF00",
      }}
    >
      카카오톡 공유하기
      <ExternalLink size={16} className="ml-2" />
    </button>
  );
};

export default KakaoShareButton;
