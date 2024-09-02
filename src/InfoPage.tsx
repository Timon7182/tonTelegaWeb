import React from 'react';

interface InfoPageProps {
  language: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ language }) => {
  return (
    <div className="p-6 bg-[#272a2f] rounded-lg mt-6 text-white">
      <h2 className="text-3xl font-bold mb-4">
        {language === 'ru' ? 'Информация о Боте' : 'Bot Information'}
      </h2>
      <div className="bg-[#1c1f24] p-4 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-2">
          {language === 'ru' ? 'Владелец' : 'Owner'}
        </h3>
        <p className="text-lg mb-4">
          {language === 'ru'
            ? 'Этот бот принадлежит и управляется пользователем @yeptepkoi.'
            : 'This bot is owned and operated by @yeptepkoi.'}
        </p>

        <h3 className="text-2xl font-semibold mb-2">
          {language === 'ru' ? 'Контакты' : 'Contact'}
        </h3>
        <p className="text-lg mb-4">
          {language === 'ru'
            ? 'Для получения дополнительной информации или вопросов, пожалуйста, свяжитесь с владельцем через Telegram.'
            : 'For more information or inquiries, please contact the owner via Telegram.'}
        </p>

        <h3 className="text-2xl font-semibold mb-2">
          {language === 'ru' ? 'Правила использования' : 'Usage Rules'}
        </h3>
        <ul className="list-disc list-inside text-lg mb-4">
          <li>{language === 'ru' ? 'Бот предназначен только для личного использования.' : 'The bot is intended for personal use only.'}</li>
          <li>{language === 'ru' ? 'Запрещается передавать данные третьим лицам.' : 'Do not share your data with third parties.'}</li>
          <li>{language === 'ru' ? 'Следуйте инструкциям, чтобы избежать ошибок.' : 'Follow instructions carefully to avoid errors.'}</li>
        </ul>

        <h3 className="text-2xl font-semibold mb-2">
          {language === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
        </h3>
        <p className="text-lg mb-4">
          {language === 'ru'
            ? 'Ваша конфиденциальность важна для нас. Мы не собираем и не храним ваши личные данные.'
            : 'Your privacy is important to us. We do not collect or store your personal data.'}
        </p>
      </div>
    </div>
  );
};

export default InfoPage;
