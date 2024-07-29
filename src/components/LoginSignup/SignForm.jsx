import React, { useState } from 'react';
import axios from 'axios';

const SignForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    axios.post('http://127.0.0.1:5000/api/signup', { username, email, password })
      .then(response => {
        alert('Signup successful. You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        window.location.href = '/login';
      })
      .catch(error => {
        console.error('Error signing up:', error);
        alert('Error signing up. Please try again.');
      });
  };

  return (
    <div
      className="w-full h-screen m-0 pt-[120px]  md:pt-0"
      style={{
        backgroundImage:
          'url("https://media.licdn.com/dms/image/C561BAQFfTqlfuXzRiQ/company-background_10000/0/1584586648261/cabin_crew_international_cover?e=2147483647&v=beta&t=jrEmNWpVsmHCAwLpb5CNux3YHEOzVAeUv2a-OtQ8PQQ")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white md:w-[585px] md:h-screen md:mx-0 mx-auto my-auto md:pt-[100px] py-[25px]  md:rounded-none rounded-md md:my-auto w-[300px] h-[93%] p-5">
        <img
          src="https://www.goindigo.in/content/dam/s6web/in/en/assets/logo/IndiGo_logo_2x.png"
          className="mx-auto md:w-[270px] w-[200px]"
        />
        <h1 className="text-4xl font-semibold md:ms-20  mt-5">Sign In</h1>
        <div className="max-w-sm  md:ms-20  mt-5">
          <form onSubmit={handleSignup}>
            <div className="mb-5">
              <label
                htmlFor="userName"
                className="block mb-2 text-xl font-medium text-gray-900"
              >
                User Name
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                id="userName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder=""
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-xl font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-xl font-medium text-gray-900"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="confirmpassword"
                className="block mb-2 text-xl font-medium text-gray-900"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  required
                />
              </div>
              <label
                htmlFor="remember"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
          <span>
            Already a member? <a href="/" className="text-blue-700">Sign in</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignForm;
