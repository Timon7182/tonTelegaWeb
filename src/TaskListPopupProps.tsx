import React from 'react';

interface TaskListPopupProps {
  tasks: any[];
  renderTaskButton: (task: any, language: string) => JSX.Element;
  onClose: () => void;
  language: string;
  isLoading: boolean; // Prop to indicate loading state
}

const TaskListPopup: React.FC<TaskListPopupProps> = ({ tasks, renderTaskButton, onClose, language, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#272a2f] rounded-lg p-4 w-11/12 max-w-lg h-1/2 relative overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl focus:outline-none">
          &times;
        </button>
        <h2 className="text-white text-lg mb-4 text-center">
          {language === 'ru' ? 'Список задач' : 'Task List'}
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">
              <img src={require('./images/logo.png')} alt="Loading" className="w-32 h-32" />
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map(task => (
              <li key={task.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white">{task.task.taskName}</p> {/* Display only the task name */}
                </div>
                {renderTaskButton(task, language)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskListPopup;
