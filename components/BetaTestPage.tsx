import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SparklesIcon from './icons/SparklesIcon';
import ShieldExclamationIcon from './icons/ShieldExclamationIcon';
import ChatBubbleBottomCenterTextIcon from './icons/ChatBubbleBottomCenterTextIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import FeedbackModal from './FeedbackModal';

interface BetaTestPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoBlock: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-brand-orange/10 text-brand-orange rounded-lg p-3">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
            <p className="text-slate-600">{children}</p>
        </div>
    </div>
);


const BetaTestPage: React.FC<BetaTestPageProps> = ({ isOpen, onClose }) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-slate-100 z-[100] flex flex-col"
          >
            <header className="flex-shrink-0 bg-white sticky top-0 z-10 border-b border-slate-200">
              <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                  <ArrowLeftIcon className="h-6 w-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">О бета-тесте</h1>
              </div>
            </header>

            <main className="flex-grow overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-brand text-slate-700 leading-relaxed">
                  <h2 className="text-3xl font-extrabold text-brand-orange mb-4">Добро пожаловать в бета-тест!</h2>
                  <p className="text-lg text-slate-600 mb-6">
                    Спасибо, что присоединились к нам на этом важном этапе! Ваше участие помогает нам сделать приложение лучше.
                  </p>
                  <div className="mt-8 p-5 bg-[#FFF3D0] rounded-lg">
                      <h3 className="font-bold text-slate-800">Что такое бета-тестирование?</h3>
                      <p className="text-slate-700 mt-1">
                          Это финальный этап разработки, когда мы приглашаем реальных пользователей опробовать почти готовое приложение. Ваша задача — пользоваться им как обычно и делиться впечатлениями. 
                      </p>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-6">На что обратить внимание?</h3>
                  <div className="space-y-6">
                      <InfoBlock icon={<SparklesIcon className="w-6 h-6" />} title="Новые функции">
                          Мы постоянно добавляем что-то новое. Если вы заметили свежую функцию, попробуйте ее и поделитесь, насколько она удобна.
                      </InfoBlock>
                      <InfoBlock icon={<ShieldExclamationIcon className="w-6 h-6" />} title="Ошибки и сбои">
                          Если что-то пошло не так, появилось странное сообщение или приложение закрылось — пожалуйста, сообщите нам.
                      </InfoBlock>
                      <InfoBlock icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />} title="Удобство использования">
                          Легко ли найти нужный товар? Понятно ли, как оформить заказ? Любые ваши мысли об улучшении интерфейса очень ценны.
                      </InfoBlock>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Как оставить отзыв?</h3>
                  <p className="mb-6">
                    Столкнулись с проблемой или есть предложение? Нажмите на кнопку ниже. Чем подробнее вы опишете ситуацию, тем быстрее мы сможем все исправить.
                  </p>

                  <button 
                      onClick={() => setIsFeedbackModalOpen(true)}
                      className="w-full mt-4 bg-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-orange-dark transition-all duration-300 text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                  >
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Направить обращение
                  </button>
                  
                  <p className="font-semibold mt-8 text-center text-slate-500">
                    <strong>Еще раз спасибо за ваше время и вклад!</strong>
                  </p>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </>
  );
};

export default BetaTestPage;