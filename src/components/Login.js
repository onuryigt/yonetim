import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 
import pizzaLocaleLogo from './img/pizza-locale-logo.png';
import dirtyFiveLogo from './img/dirty-five-logo.png';
import karaaliLogo from './img/karaali-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
     // Özel şifre kontrolü
     const specialPassword = '124045.'; // Buraya özel şifrenizi girin
     if (password === specialPassword) {
       localStorage.setItem('user', JSON.stringify({ email, first_name: 'Onur', last_name: 'Yiğit' }));
       navigate('/dashboard'); // Dashboard ekranına yönlendirme
       return;
     }

     try {
      const response = await axios.post('http://92.112.193.81:5018/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('business_name', response.data.business_name);
        localStorage.setItem('manager_id', response.data.manager_id);  // manager_id'yi doğru şekilde kaydet
        navigate('/cash-operations');
        window.location.reload(); // Sayfayı yeniden yükleyerek bileşenlerin doğru şekilde render edilmesini sağlıyoruz
      } else {
        alert('Giriş başarısız, lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">İşletme Kontrol Uygulaması</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Giriş Yap</button>
        </div>
      </form>
      <div className="logos-container">
        <img src={pizzaLocaleLogo} alt="Pizza Locale" />
        <img src={dirtyFiveLogo} alt="Dirty Five" />
        <img src={karaaliLogo} alt="Karaali" />
      </div>
    </div>
  );
};

export default Login;