import { Copy, ExternalLink } from "lucide-react";
import KakaoShareButton from "./KakaoShareButton";

const InvitationShare = () => {
  const urlToShare = window.location.href;

  const handleKakaoShare = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "원필과 나래 결혼합니다💍",
          description: "초대장을 확인해 주세요!",
          imageUrl: "https://your-site.com/image.jpg",
          link: {
            mobileWebUrl: urlToShare,
            webUrl: urlToShare,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: urlToShare,
              webUrl: urlToShare,
            },
          },
        ],
      });
    } else {
      alert("카카오 SDK가 로드되지 않았습니다.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(urlToShare);
    alert("청첩장 주소가 복사되었습니다.");
  };

  return (
    <>
      <div className="h-[600px] bg-gradient-to-b from-[#FFFFFF] to-[#282828] text-black mt-10">
        image
      </div>
      <div className="h-40 bg-[#282828] text-white flex flex-col items-center justify-center">
        <p className="mb-8">당신은 내가 더 좋은 사람이고 싶게 만들어요.</p>
        <p>- 영화 '이보다 더 좋을 순 없다' 중</p>
      </div>
      <div className="h-[200px] flex flex-col justify-center items-center">
        <KakaoShareButton handleKakaoShare={handleKakaoShare} />

        <button
          onClick={handleCopy}
          className="w-52 flex items-center justify-center bg-gray-400 hover:bg-gray-500  text-white px-4 py-2 rounded font-mediumhover:opacity-90"
        >
          청첩장 주소 복사하기
          <Copy size={16} className="ml-2" />
        </button>
      </div>
    </>
  );
};

export default InvitationShare;
