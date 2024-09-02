import React, { useState } from 'react';

interface CashoutPageProps {
  onClose: () => void;
  onSuccess: (message: string) => void; // New prop for success callback
  language: string;
  balance: number; // Assuming balance is a number
  token: string; // Token passed from App.tsx
  userValue: string;
  chatInstance: string;
  chatType: string;
  authDate: string;
  hashFinal: string;
  queryId: string;
}

const CashoutPage: React.FC<CashoutPageProps> = ({ onClose, onSuccess, language, balance, token,userValue,chatInstance,chatType,authDate,hashFinal,queryId  }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | string>(''); // State for withdrawal amount
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(false); // State to check if balance is enough

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWithdrawalAmount(e.target.value);

    if (!isNaN(value) && value <= balance && value > 0) {
      setIsEnoughBalance(true);
    } else {
      setIsEnoughBalance(false);
    }
  };

  const handleWithdrawal = () => {
    if (isEnoughBalance) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/createPaymentRequest?user=${encodeURIComponent(userValue)}&query_id=${queryId}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&sum=${withdrawalAmount}`,
        requestOptions
      )
        .then((response) => response.text())
        .then(() => {
          onSuccess(language === 'ru' ? 'Ваша заявка отправлена на обработку' : 'Success! Withdrawal completed.');
          onClose(); // Close the CashoutPage
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(language === 'ru' ? 'Ошибка при выводе средств.' : 'Error during withdrawal.');
        });
    }
  };

  return (
    <div className="p-4 bg-[#272a2f] rounded-lg relative mt-6 text-white">
      <button onClick={onClose} className="absolute top-0 right-0 p-2 text-lg text-white">
        &times;
      </button>
      <div className="mt-4">
        <div className="flex items-center mt-2">
          <input
            type="number"
            step="0.01"
            value={withdrawalAmount}
            onChange={handleInputChange}
            className="text-4xl bg-transparent border-none text-white focus:outline-none w-full"
            placeholder="0"
          />
          <p className="ml-2 text-lg">TON</p>
        </div>
        <div className="bg-[#1c1f24] p-4 rounded-lg mt-4">
          <p className="text-sm">{language === 'ru' ? 'Минимальный вывод' : 'Minimum withdrawal'}</p>
          <p className="text-lg font-bold">200 NOT</p>
        </div>
        <div className="bg-[#1c1f24] p-4 rounded-lg mt-4">
          <p className="text-sm">{language === 'ru' ? 'Комиссия за газ' : 'Gas fee'}</p>
          <p className="text-lg font-bold">100 NOT</p>
        </div>
        <div className="bg-[#1c1f24] p-4 rounded-lg mt-4">
          <p className="text-sm">{language === 'ru' ? 'Вывод займёт' : 'Withdrawal will take'}</p>
          <p className="text-lg font-bold">{language === 'ru' ? 'до 10 дней' : 'up to 10 days'}</p>
        </div>
      </div>
      <button
        onClick={handleWithdrawal}
        className={`mt-4 w-full py-2 rounded-lg text-center ${isEnoughBalance ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        disabled={!isEnoughBalance}
      >
        {language === 'ru' ? (withdrawalAmount ? 'ВЫВОД' : 'Вывод') : (withdrawalAmount ? 'WITHDRAW' : 'Withdraw')}
      </button>
    </div>
  );
};

export default CashoutPage;
