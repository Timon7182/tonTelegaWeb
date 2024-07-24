import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo } from './images';
import Info from './icons/Info';
import Friends from './icons/Friends';

const App: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState(''); // State for username
  const [userPhoto, setUserPhoto] = useState(''); // State for user photo
  const [balanceLabel, setBalanceLabel] = useState('Balance'); // State for balance label
  const tasks = ["Task 1", "Task 2", "Task 3"]; // Example tasks

  useEffect(() => {
    const fetchBalance = async (hash: string) => {
      try {
        const tokenResponse = await fetch('https://tontelega-410f0443bf5d.herokuapp.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic Y2xpZW50OkpBVmptNGdUcWU=',
            'Cookie': 'JSESSIONID=FC96BAC6A5341EF14290D76252C00D64'
          },
          body: new URLSearchParams({
            'grant_type': 'client_credentials'
          })
        });
        

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log(hash);

        const params = new URLSearchParams(hash);
        
        const userValue = params.get('user');
        const chatInstance = params.get('chat_instance');
        const chatType = params.get('chat_type');
        const authDate = params.get('auth_date');
        const hashFinal = params.get('hash');
        console.log(userValue);
        console.log(chatInstance);
        console.log(chatType);
        console.log(authDate);
        console.log(hashFinal);

        const balanceResponse = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/getBalance?user=${encodeURIComponent(userValue)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': 'JSESSIONID=FC96BAC6A5341EF14290D76252C00D64'
          }
        });
        console.log(balanceResponse);

        const balanceData = await balanceResponse.json();
        console.log(balanceData);
        setBalance(balanceData); // Assuming the response contains the balance directly
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    console.log("useEffect triggered");

    // Check if Telegram Web Apps API is available
    if (window.Telegram && window.Telegram.WebApp) {

      const telegram = window.Telegram.WebApp;
      telegram.ready();
      const user = telegram.initDataUnsafe?.user;

      if (user) {
        setUsername(user.username || `${user.first_name} ${user.last_name}`);
        setUserPhoto(user.photo_url || ''); // Set user photo URL

        // Set the balance label based on user language
        const language = user.language_code || 'en';
        if (language === 'ru') {
          setBalanceLabel('Ваш Баланс');
        } else {
          setBalanceLabel('Balance');
        }

        // Fetch balance using hash from Telegram initData
        fetchBalance(telegram.initData || 'defaultHash');
      } else {
        console.log("No user data available");
        setUsername('Unknown User');
      }
    } else {
      console.log("Telegram API not available");
      setUsername('Telegram API not available');
    }
  }, []);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div className="flex items-center space-x-2">
              {userPhoto && (
                <img src={userPhoto} alt="User" className="w-8 h-8 rounded-full" />
              )}
              <p className="text-sm">{username}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="bg-[#272a2f] p-4 rounded-lg">
              <p className="text-lg">{balanceLabel}</p>
              <p className="text-2xl">{balance !== null ? balance.toLocaleString() + ' coins' : 'Loading...'}</p>
            </div>
            <div className="bg-[#272a2f] p-4 rounded-lg mt-4">
              <p className="text-lg">Tasks</p>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="bg-[#1d2025] p-2 rounded-lg cursor-pointer">
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#272a2f] p-4 rounded-lg mt-4">
              <p className="text-lg">Top Games</p>
              {/* Leave empty for now */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed div */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
          <img src={binanceLogo} alt="Home" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Home</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Info className="w-8 h-8 mx-auto" />
          <p className="mt-1">Info</p>
        </div>
      </div>
    </div>
  );
};

export default App;
