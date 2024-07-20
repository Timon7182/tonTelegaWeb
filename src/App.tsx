import React, { useState } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo } from './images';
import Info from './icons/Info';
import Friends from './icons/Friends';

const App: React.FC = () => {
  const [balance] = useState(22749365);
  const tasks = ["Task 1", "Task 2", "Task 3"]; // Example tasks

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">Nikandr (CEO)</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="bg-[#272a2f] p-4 rounded-lg">
              <p className="text-lg">Balance</p>
              <p className="text-2xl">{balance.toLocaleString()} coins</p>
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
