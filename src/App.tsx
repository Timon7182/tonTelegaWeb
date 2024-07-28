import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { logo } from './images';
import Info from './icons/Info';
import Friends from './icons/Friends';

const App: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState(''); // State for username
  const [userPhoto, setUserPhoto] = useState(''); // State for user photo
  const [tasks, setTasks] = useState<any[]>([]); // State for tasks
  const [language, setLanguage] = useState('en'); // State for language
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null); // State for loading animation
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const [currentPage, setCurrentPage] = useState<string>('home'); // State for current page

  const fetchUserInfo = async (hash: string) => {
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
      const queryId = params.get('query_id');

      console.log(userValue);
      console.log(chatInstance);
      console.log(chatType);
      console.log(authDate);
      console.log(hashFinal);

      // Decode the userValue to get the language_code
      const decodedUserValue = decodeURIComponent(userValue as string);
      const userObject = JSON.parse(decodedUserValue);
      const languageCode = userObject.language_code;
      setLanguage(languageCode);

      const userInfoResponse = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/getUserInfo?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&query_id=${queryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': 'JSESSIONID=FC96BAC6A5341EF14290D76252C00D64'
        }
      });
      console.log(userInfoResponse);

      const userInfoData = await userInfoResponse.json();
      console.log(userInfoData);
      setBalance(userInfoData.balance); // Assuming the response contains the balance directly

      // Sort tasks by createdDate
      const sortedTasks = userInfoData.tasks.sort((a: any, b: any) => {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });
      setTasks(sortedTasks); // Set sorted tasks to the state
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");

    // Check if Telegram Web Apps API is available
    if (window.Telegram && window.Telegram.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.ready();
      const user = telegram.initDataUnsafe?.user;

      if (user) {
        setUsername(user.username || `${user.first_name} ${user.last_name}`);
        setUserPhoto(user.photo_url || ''); // Set user photo URL

        // Fetch user info using hash from Telegram initData
        fetchUserInfo(telegram.initData || 'defaultHash');
      } else {
        console.log("No user data available");
        setUsername('Unknown User');
      }
    } else {
      console.log("Telegram API not available");
      setUsername('Telegram API not available');
    }
  }, []);

  const handleTaskButtonClick = async (task: any) => {
    if (task.status === 'IN_PROGRESS' && loadingTaskId !== task.id) {
      setLoadingTaskId(task.id);
      window.open(task.task.taskUrl, '_blank');
      // Simulate loading time
      setTimeout(() => {
        setLoadingTaskId(null);
        // Change task status to "CLAIM"
        const updatedTasks = tasks.map(t =>
          t.id === task.id ? { ...t, status: 'CLAIM' } : t
        );
        setTasks(updatedTasks);
      }, 2000);
    } else if (task.status === 'CLAIM' && loadingTaskId !== task.id) {
      setLoadingTaskId(task.id);
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

        const params = new URLSearchParams(window.Telegram?.WebApp.initData || '');
        const userValue = params.get('user');
        const chatInstance = params.get('chat_instance');
        const chatType = params.get('chat_type');
        const authDate = params.get('auth_date');
        const hashFinal = params.get('hash');

        const queryId = params.get('query_id');

        const accomplishTaskResponse = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/accomplishTask?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&taskId=${task.id}&query_id=${queryId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': 'JSESSIONID=FC96BAC6A5341EF14290D76252C00D64'
          }
        });

        if (accomplishTaskResponse.status >= 200 && accomplishTaskResponse.status < 300) {
          setSuccessMessage(language === 'ru' ? 'Успех' : 'Success');
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
          fetchUserInfo(window.Telegram?.WebApp.initData || 'defaultHash');
        } else {
          console.error('Error accomplishing task');
        }
      } catch (error) {
        console.error('Error accomplishing task:', error);
      }
      setLoadingTaskId(null);
    }
  };

  const renderTaskButton = (task: any, language: string) => {
    let buttonText = '';
    let buttonColor = '';
    let isDisabled = false;

    if (task.status === 'DONE') {
      buttonText = language === 'ru' ? 'Готово' : 'Done';
      buttonColor = 'bg-gray-500'; // Disabled button color
      isDisabled = true;
    } else if (task.status === 'IN_PROGRESS') {
      buttonText = language === 'ru' ? 'Выполнить' : 'DO';
      buttonColor = 'bg-blue-500';
    } else if (task.status === 'CLAIM') {
      buttonText = language === 'ru' ? 'Получить' : 'Claim';
      buttonColor = 'bg-yellow-500';
    } else if (task.status === 'DRAFT') {
      buttonText = language === 'ru' ? 'Выполнить' : 'DO';
      buttonColor = 'bg-blue-500';
    }

    return (
      <button
        className={`p-2 rounded-full text-white ${buttonColor} ${loadingTaskId === task.id ? 'loading' : ''}`}
        disabled={isDisabled || loadingTaskId === task.id}
        onClick={() => handleTaskButtonClick(task)}
      >
        {loadingTaskId === task.id ? <span className="loading-spinner"></span> : buttonText}
      </button>
    );
  };

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <div>
          <div className="mt-4">
            <div className="bg-[#272a2f] p-4 rounded-lg">
              <p className="text-lg">Баланс</p>
              <p className="text-2xl">{balance !== null ? balance.toLocaleString() + ' coins' : 'Loading...'}</p>
            </div>
            <div className="bg-[#272a2f] p-4 rounded-lg mt-4 overflow-auto max-h-96">
              <p className="text-lg">{language === 'ru' ? 'Ваши Задачи' : 'Tasks'}</p>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="bg-[#1d2025] p-2 rounded-lg flex justify-between items-center">
                    <div>
                      {language === 'ru' ? task.task.taskName : task.task.taskNameEn}
                    </div>
                    {renderTaskButton(task, language)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#272a2f] p-4 rounded-lg mt-4">
              <p className="text-lg">{language === 'ru' ? 'Топ платформы' : 'Top Games'}</p>
              {/* Leave empty for now */}
            </div>
          </div>
        </div>
      );
    } else if (currentPage === 'friends' || currentPage === 'info') {
      return (
        <div className="mt-4 bg-[#272a2f] p-4 rounded-lg">
          <p className="text-lg">
            {language === 'ru' ? 'Мы работаем над этим функицоналом' : 'We are working on it'}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="bg-black flex justify-center relative">
      {successMessage && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-green-500 text-white p-2 rounded-lg z-50">
          <p>{successMessage}</p>
        </div>
      )}
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
          {renderContent()}
        </div>
      </div>

      {/* Bottom fixed div */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div
          className={`text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl ${currentPage === 'home' ? 'bg-[#1c1f24]' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <img src={logo} alt="Home" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Home</p>
        </div>
        <div
          className={`text-center text-[#85827d] w-1/5 ${currentPage === 'friends' ? 'bg-[#1c1f24]' : ''}`}
          onClick={() => setCurrentPage('friends')}
        >
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div
          className={`text-center text-[#85827d] w-1/5 ${currentPage === 'info' ? 'bg-[#1c1f24]' : ''}`}
          onClick={() => setCurrentPage('info')}
        >
          <Info className="w-8 h-8 mx-auto" />
          <p className="mt-1">Info</p>
        </div>
      </div>
    </div>
  );
};

export default App;
