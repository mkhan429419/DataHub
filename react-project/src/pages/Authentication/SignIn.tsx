import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios'; // Import Axios for making HTTP requests to the backend

const SignIn: React.FC = () => {
  // State variables to hold user input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a POST request to the backend to authenticate the user
      const url = 'https://datahub-backend-1d73729e6f15.herokuapp.com/api/auth';
      const {
        data: { data: token },
      } = await axios.post(url, { email, password });

      // If authentication is successful, set the token in local storage
      localStorage.setItem('token', token);
      console.log('Token set in localStorage:', token);

      // Redirect the user to the dashboard
      window.location.href = '/';
    } catch (error) {
      // If an error occurs during the request, display a generic error message
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to DataHub
            </h2>

            <form onSubmit={handleSubmit}>
              {' '}
              {/* Use onSubmit to handle form submission */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email} // Bind input value to the state variable
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password} // Bind input value to the state variable
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}{' '}
              {/* Display error message if there is any */}
              <div className="flex justify-between items-center">
                <button
                  type="submit" // Use type="submit" to trigger form submission
                  className="w-full py-4 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus-visible:shadow-outline"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignIn;
