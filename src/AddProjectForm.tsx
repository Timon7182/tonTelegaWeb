import React, { useState } from 'react';

interface AddProjectFormProps {
  language: string;
  accessToken: string | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  userValue: string;
  chatInstance: string;
  chatType: string;
  authDate: string;
  hashFinal: string;
  queryId: string;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ language, accessToken, onClose, onSuccess,userValue,chatInstance,chatType,authDate,hashFinal,queryId  }) => {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (text.trim() === '' || link.trim() === '') {
      alert(language === 'ru' ? 'Пожалуйста, заполните оба поля' : 'Please fill in both fields');
      return;
    }

    setIsSubmitting(true);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(
        `https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/createProject?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&query_id=${queryId}&text=${encodeURIComponent(text)}&link=${encodeURIComponent(link)}`,
        requestOptions
      );
      const result = await response.text();
      console.log(result);
      onSuccess(language === 'ru' ? 'Ваша заявка отправлена на обработку' : 'Success! Your request has been processed.');
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      alert(language === 'ru' ? 'Ошибка при добавлении проекта' : 'Error adding project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#272a2f] p-6 rounded-lg w-full max-w-md relative z-60">
      <button onClick={onClose} className="absolute top-0 right-0 p-2 text-lg text-white">
        &times;
      </button>
        <h2 className="text-xl text-white mb-4">
          {language === 'ru' ? 'Добавить проект' : 'Add Project'}
        </h2>
        <input
          type="text"
          placeholder={language === 'ru' ? 'Название Проекта' : 'Enter text'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 text-white focus:outline-none"
        />
        <input
          type="text"
          placeholder={language === 'ru' ? 'Ссылка' : 'Enter link'}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 text-white focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded focus:outline-none"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? language === 'ru' ? 'Отправка...' : 'Submitting...'
            : language === 'ru' ? 'Отправить' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AddProjectForm;
