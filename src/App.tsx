import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { logo } from './images';
import { friendsMel } from './images';
import { tasksLogo,withdraw } from './images';
import Info from './icons/Info';
import Friends from './icons/Friends';
import TaskListPopup from './TaskListPopupProps.tsx'; 
import LoadingScreen from './LoadingScreen.tsx';
import CashoutPage  from './CashoutPage.tsx';
import ProjectsBlock from './ProjectBlock.tsx';
import InfoPage from './InfoPage.tsx';

const App: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState(''); // State for username
  const [userPhoto, setUserPhoto] = useState(''); // State for user photo
  const [tasks, setTasks] = useState<any[]>([]); // State for tasks
  const [language, setLanguage] = useState('en'); // State for language
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null); // State for loading animation
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message
  const [currentPage, setCurrentPage] = useState<string>('home'); // State for current page
  const [level, setLevel] = useState<number | null>(null); // State for level
  const [taskCount, setTaskCount] = useState<number | null>(null); // State for task count
  const [accessToken, setAccessToken] = useState<string | null>(null); // State for access token
  const [showTaskListPopup, setShowTaskListPopup] = useState(false); // State to control popup visibility
  const [isLoading, setIsLoading] = useState(true); // State for controlling loading animation

  const [userValue, setUserValue] = useState<string | null>(null);
  const [chatInstance, setChatInstance] = useState<string | null>(null);
  const [chatType, setChatType] = useState<string | null>(null);
  const [authDate, setAuthDate] = useState<string | null>(null);
  const [hashFinal, setHashFinal] = useState<string | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);

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
      setAccessToken(tokenData.access_token);

      const params = new URLSearchParams(hash);
      const userValue = params.get('user');
      const chatInstance = params.get('chat_instance');
      const chatType = params.get('chat_type');
      const authDate = params.get('auth_date');
      const hashFinal = params.get('hash');
      const queryId = params.get('query_id');
      
      setUserValue(userValue ?? '');
      setChatInstance(chatInstance ?? '');
      setChatType(chatType ?? '');
      setAuthDate(authDate ?? '');
      setHashFinal(hashFinal ?? '');
      setQueryId(queryId ?? '');
      
      const decodedUserValue = decodeURIComponent(userValue as string);
      const userObject = JSON.parse(decodedUserValue);
      setLanguage(userObject.language_code);

      const userInfoResponse = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/getUserInfo?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&query_id=${queryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Cookie': 'JSESSIONID=FC96BAC6A5341EF14290D76252C00D64'
        }
      });

      const userInfoData = await userInfoResponse.json();
      setBalance(userInfoData.balance);
      setLevel(userInfoData.level);
      setTaskCount(userInfoData.taskCount);

      const sortedTasks = userInfoData.tasks.sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      setTasks(sortedTasks);
      
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false); // Stop loading animation once user info is fetched
    }
  };

  const handleTaskCountClick = async () => {
    if ((taskCount ?? 0)> 0 && accessToken) {
      setShowTaskListPopup(true);
      try {
        const response = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/getTasks?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&query_id=${queryId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      
        const tasksData = await response.json();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  };

  const handleTaskButtonClick = async (task: any) => {
    if (task.status === 'IN_PROGRESS' && loadingTaskId !== task.id) {
      setLoadingTaskId(task.id);
      window.open(task.task.taskUrl, '_blank');

      setTimeout(() => {
        setLoadingTaskId(null);
        const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: 'CLAIM' } : t);
        setTasks(updatedTasks);
      }, 2000);
    } else if (task.status === 'CLAIM' && loadingTaskId !== task.id) {
      setLoadingTaskId(task.id);
      try {
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

        if (accomplishTaskResponse.ok) {
          const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: 'DONE' } : t);
          setTasks(updatedTasks); 
          setTimeout(() => setSuccessMessage(null), 3000);
          fetchUserInfo(window.Telegram?.WebApp.initData || 'defaultHash');
        } else {
          console.error('Error accomplishing task');
        }
      } catch (error) {
        console.error('Error accomplishing task:', error);
      } finally {
        setLoadingTaskId(null);
      }
    }
  };

  const renderTaskButton = (task: any, language: string) => {
    let buttonText = '';
    let buttonColor = '';
    let isDisabled = false;

    if (task.status === 'DONE') {
      buttonText = language === 'ru' ? 'Готово' : 'Done';
      buttonColor = 'bg-gray-500';
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
  
  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
    setCurrentPage('home'); // Navigate back to the home page
  };
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.ready();
      const user = telegram.initDataUnsafe?.user;

      if (user) {
        setUsername(user.username || `${user.first_name} ${user.last_name}`);
        setUserPhoto(user.photo_url || '');
        fetchUserInfo(telegram.initData || 'defaultHash');
      } else {
        setUsername('Unknown User');
        setIsLoading(false);
      }
    } else {
      setUsername('Telegram API not available');
      setIsLoading(false);
    }
  }, []);



  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }
  
    if (currentPage === 'home') {
      return (
        <>
          <div className="p-4 bg-[#272a2f] rounded-lg relative mt-6">
            <div
              className="absolute inset-0 rounded-full h-64 w-64 mx-auto my-0"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(39,42,47,0) 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
            <div className="flex flex-col items-start text-white relative z-10">
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold">
                  {balance !== null ? balance.toLocaleString() : '0'}
                </p>
                <p className="text-lg font-medium">TON</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {level !== null ? level : 'Bronze'}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <img
                  src={tasksLogo}
                  alt="Icon"
                  className="w-12 h-12 rounded-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                />
                <div>
                  {taskCount === 0 ? (
                    <>
                      <p className="text-sm text-gray-300">
                        {language === 'ru' ? 'Нет активных пулов' : 'No active pools'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {language === 'ru' ? '0 в час' : '0 per hour'}
                      </p>
                    </>
                  ) : (
                    <button
                      onClick={handleTaskCountClick}
                      className="text-sm text-left text-teal-400 underline focus:outline-none"
                    >
                      {language === 'ru' ? `Пул задач: ${taskCount}` : `Active tasks: ${taskCount}`}
                    </button>
                  )}
                </div>
                <span className="ml-auto"></span>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <img
                  src={friendsMel}
                  alt="Friend Bonus"
                  className="w-12 h-12 rounded-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }}
                />
                <div>
                  <p className="text-sm text-gray-300">
                    {language === 'ru' ? 'Бонус за френов' : 'Friend Bonus'}
                  </p>
                  <p className="text-yellow-400 text-sm">
                    +15% {language === 'ru' ? 'с апгрейда уровня' : 'with level upgrade'}
                  </p>
                </div>
                <span className="ml-auto"></span>
              </div>
            </div>
            <div
              className="absolute top-0 right-0 p-4 cursor-pointer hover:bg-gray-700 rounded-full transition"
              onClick={() => setCurrentPage('cashout')}
            >
              <img
                src={withdraw}
                alt="Row Icon"
                className="w-6 h-6"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
          <ProjectsBlock language={language} accessToken={accessToken} onSuccess={handleSuccess} 
          userValue={userValue ?? ''}
          chatInstance={chatInstance ?? ''}
          chatType={chatType ?? ''}
          authDate={authDate ?? ''}
          hashFinal={hashFinal ?? ''}
          queryId={queryId ?? ''}
          />
        </>
      );
    } else if (currentPage === 'projects') {
      return (
        <ProjectsBlock language={language} accessToken={accessToken} onSuccess={handleSuccess} 
          userValue={userValue ?? ''}
          chatInstance={chatInstance ?? ''}
          chatType={chatType ?? ''}
          authDate={authDate ?? ''}
          hashFinal={hashFinal ?? ''}
          queryId={queryId ?? ''}
          />
      );
    }else if (currentPage === 'info') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#272a2f] text-white">
          <InfoPage language={language} />
        </div>
      );
    } else if (currentPage === 'cashout') {
      return (
        <CashoutPage
          balance={balance!}
          onSuccess={handleSuccess}
          language={language}
          token={accessToken ?? ''}
          onClose={() => setCurrentPage('home')}
          userValue={userValue ?? ''}
          chatInstance={chatInstance ?? ''}
          chatType={chatType ?? ''}
          authDate={authDate ?? ''}
          hashFinal={hashFinal ?? ''}
          queryId={queryId ?? ''}
        />
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
      {showTaskListPopup && (
        <TaskListPopup
          tasks={tasks}
          renderTaskButton={renderTaskButton}
          onClose={() => setShowTaskListPopup(false)}
          language={language}
          isLoading={isLoading}
        />
      )}
      {!isLoading && (  // Conditionally render the bottom navigation buttons
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
          <div
            className={`text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl ${currentPage === 'home' ? 'bg-[#1c1f24]' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <img src={logo} alt="Home" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Home</p>
          </div>
          <div
            className={`text-center text-[#85827d] w-1/5 ${currentPage === 'projects' ? 'bg-[#1c1f24]' : ''}`}
            onClick={() => setCurrentPage('projects')}
          >
            <Friends className="w-8 h-8 mx-auto" />
            <p className="mt-1">
            {language === 'ru' ? 'Проекты' : 'Projects'}
            </p>
          </div>
          <div
            className={`text-center text-[#85827d] w-1/5 ${currentPage === 'info' ? 'bg-[#1c1f24]' : ''}`}
            onClick={() => setCurrentPage('info')}
          >
            <Info className="w-8 h-8 mx-auto" />
            <p className="mt-1">Info</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;