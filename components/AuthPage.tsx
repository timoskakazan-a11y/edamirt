import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, phone, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError(null);
    }

    const emailInputType = email.toLowerCase() === 'work' ? 'text' : 'email';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-brand-orange tracking-wider">edamirt</h1>
                <p className="text-slate-500 mt-2">доставка продуктов</p>
            </div>
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-brand">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="block w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type={emailInputType} id="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                    </div>
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="block w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full px-4 py-2 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-orange-dark transition-all duration-300 text-lg shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center">
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                    <button onClick={toggleMode} className="font-semibold text-brand-orange hover:underline ml-1">
                        {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
