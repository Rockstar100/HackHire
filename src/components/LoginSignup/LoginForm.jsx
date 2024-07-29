import React, { useState } from 'react';
import axios from 'axios';
const LoginForm  = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/api/login', { email, password })
        .then(response => {
            alert('Login successful');
            setUser(response.data.userId);
            window.location.href = '/dashboard';
        })
        .catch(error => {
            console.error('Error logging in:', error);
            alert('Invalid credentials');
        });
};
  return (
    <div
      className="w-full h-screen m-0 pt-[150px]  md:pt-0"
      style={{
        backgroundImage:
          'url("https://media.licdn.com/dms/image/C561BAQFfTqlfuXzRiQ/company-background_10000/0/1584586648261/cabin_crew_international_cover?e=2147483647&v=beta&t=jrEmNWpVsmHCAwLpb5CNux3YHEOzVAeUv2a-OtQ8PQQ")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white md:w-[585px] md:h-screen md:mx-0 mx-auto my-auto md:pt-[100px] py-[50px]  md:rounded-none rounded-md md:my-auto w-[300px] h-[90%] p-5">
        <img
          src="https://www.goindigo.in/content/dam/s6web/in/en/assets/logo/IndiGo_logo_2x.png"
          className="mx-auto md:w-[270px] w-[200px]"
        />
        <h1 className=" text-4xl font-semibold md:ms-20  mt-10">Sign In</h1>

        <div class="max-w-sm  md:ms-20  mt-10">
        <form onSubmit={handleLogin}>
            <div class="mb-5">
              <label
                for="email"
                class="block mb-2 text-xl font-medium text-gray-900 "
              >
                Your email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div class="mb-5">
              <label
                for="password"
                class="block mb-2 text-xl font-medium text-gray-900 "
              >
                Your password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                required
              />
            </div>
            <div class="flex items-start mb-5">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300   "
                  required
                />
              </div>
              <label
                for="remember"
                class="ms-2 text-sm font-medium text-gray-900 "
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
       <span>
        Not a member? <a href="/signup" class="text-blue-700">Sign up now</a>
       </span>
         
		</div>
      </div>
    </div>
  );
};

export default LoginForm;
