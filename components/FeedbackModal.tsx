import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { submitBetaFeedback } from '../services/airtableService';
import XMarkIcon from './icons/XMarkIcon';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';
type FeedbackTopic = 'Предложение по улучшению' | 'Сообщение об ошибке' | 'Вопрос' | 'Другое';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [topic, setTopic] = useState<FeedbackTopic>('Предложение по улучшению');
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) {
        setErrorMessage('Пожалуйста, заполните основное поле описания.');
        setFormState('error');
        return;
    }
    
    setFormState('loading');
    setErrorMessage('');

    try {
      await submitBetaFeedback({
        'тема обращения': topic,
        'текст': text,
        'текст ошибки': errorText,
      });
      setFormState('success');
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      setFormState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось отправить обращение.');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form state after transition
    setTimeout(() => {
        setTopic('Предложение по улучшению');
        setText('');
        setErrorText('');
        setFormState('idle');
        setErrorMessage('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[110] flex justify-center items-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Обращение в бета-центр</h2>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100">
                <XMarkIcon className="h-6 w-6 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {formState === 'success' ? (
                <div className="text-center py-10">
                  <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 className="text-2xl font-bold mt-4">Спасибо!</h3>
                  <p className="text-slate-600 mt-2">Ваш отзыв успешно отправлен.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Тема обращения</label>
                    <select
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as FeedbackTopic)}
                      className="block w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    >
                      <option>Предложение по улучшению</option>
                      <option>Сообщение об ошибке</option>
                      <option>Вопрос</option>
                      <option>Другое</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                    <textarea
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      placeholder="Опишите ваше предложение или проблему как можно подробнее..."
                      className="w-full h-28 p-3 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                    ></textarea>
                  </div>
                  
                   <div>
                    <label htmlFor="errorText" className="block text-sm font-medium text-slate-700 mb-1">Текст ошибки (если есть)</label>
                    <textarea
                      id="errorText"
                      value={errorText}
                      onChange={(e) => setErrorText(e.target.value)}
                      placeholder="Если вы видите сообщение об ошибке, скопируйте его сюда"
                      className="w-full h-20 p-3 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition font-mono text-xs"
                    ></textarea>
                  </div>

                  {formState === 'error' && <p className="text-sm text-center text-red-600">{errorMessage}</p>}
                </form>
              )}
            </div>
            {formState !== 'success' && (
                <div className="p-4 border-t border-slate-200 mt-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={formState === 'loading'}
                        className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                    {formState === 'loading' ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Отправить'}
                    </button>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;