import { useState } from "react";

const Parents = () => {
  const [isBride, setIsBride] = useState(false);

  const groomInfo = {
    label: "신랑측",
    borderColor: "border-blue-300",
    name: "김원필",
    bank: "신한은행",
    bankNumber: process.env.REACT_APP_GROOM_BANK as string,
    daddyName: "김용주",
    daddyBank: "신한은행",
    daddyBankNumber: process.env.REACT_APP_GROOM_DAD_BANK as string,
    mommyName: "김순자",
    mommyBank: "신한은행",
    mommyBankNumber: process.env.REACT_APP_GROOM_MOM_BANK as string,
  };

  const brideInfo = {
    label: "신부측",
    borderColor: "border-red-300",
    name: "하나래",
    bank: "KB국민은행",
    bankNumber: process.env.REACT_APP_BRIDE_BANK as string,
    daddyName: "하승대",
    daddyBank: "NH농협은행",
    daddyBankNumber: process.env.REACT_APP_BRIDE_DAD_BANK as string,
    mommyName: "김인숙",
    mommyBank: "NH농협은행",
    mommyBankNumber: process.env.REACT_APP_BRIDE_MOM_BANK as string,
  };

  const accountInfo = isBride ? brideInfo : groomInfo;

  const handleCopy = (name: string, bank: string, number: string) => {
    const onlyNumber = number.replace(/\D/g, "");
    navigator.clipboard.writeText(onlyNumber);
    alert("계좌번호가 복사되었습니다.");
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center py-12 mt-5 mb-10">
      <p className="text-xl">
        김용주 • 김순자<span className="text-base font-light">의</span> 아들
      </p>
      <p className="mt-2 text-xl">
        <span className="text-base font-light">신랑 </span>원필
      </p>
      <p className="mt-10 text-xl">
        하승대 • 김인숙<span className="text-base font-light">의</span> 딸
      </p>
      <p className="my-2 text-xl">
        <span className="text-base font-light">신부 </span>나래
      </p>
      <div className="w-20 h-[1px] bg-gray-400 my-5" />
      <p className="mb-2 text-base">마음 전하실 곳</p>
      <span className="font-light text-sm">
        참석이 어려우신 분들을 위해 기재했습니다.
      </span>
      <span className="font-light text-sm">
        너그러운 마음으로 양해 부탁드립니다.
      </span>

      <div className="flex gap-4 mt-5">
        <button
          onClick={() => setIsBride(false)}
          className={`px-4 py-1 rounded border ${
            !isBride
              ? "bg-blue-300 text-white"
              : "border-blue-300 text-blue-400"
          }`}
        >
          신랑측
        </button>
        <button
          onClick={() => setIsBride(true)}
          className={`px-4 py-1 rounded border ${
            isBride ? "bg-red-300 text-white" : "border-red-300 text-red-400"
          }`}
        >
          신부측
        </button>
      </div>

      {/* 계좌 정보 */}
      <div className="mt-3 flex flex-col gap-2 text-base">
        <div className="flex gap-2 justify-between">
          <span>
            [{accountInfo.name} / {accountInfo.bank}] {accountInfo.bankNumber}
          </span>
          <button
            onClick={() =>
              handleCopy(
                accountInfo.name,
                accountInfo.bank,
                accountInfo.bankNumber
              )
            }
            className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            복사
          </button>
        </div>
        <div className="flex gap-2 justify-between">
          <span>
            [{accountInfo.daddyName} / {accountInfo.daddyBank}]{" "}
            {accountInfo.daddyBankNumber}
          </span>
          <button
            onClick={() =>
              handleCopy(
                accountInfo.daddyName,
                accountInfo.daddyBank,
                accountInfo.daddyBankNumber
              )
            }
            className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            복사
          </button>
        </div>
        <div className="flex gap-2 justify-between">
          <span>
            [{accountInfo.mommyName} / {accountInfo.mommyBank}]{" "}
            {accountInfo.mommyBankNumber}
          </span>
          <button
            onClick={() =>
              handleCopy(
                accountInfo.mommyName,
                accountInfo.mommyBank,
                accountInfo.mommyBankNumber
              )
            }
            className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parents;
