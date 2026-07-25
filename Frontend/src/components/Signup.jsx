// Mobile Responsive Page Code
'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import AxiosInstance from '@/components/AxiosInstance';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with:', { 
        username: formData.username, 
        email: formData.email 
      });
      
      const response = await AxiosInstance.post('/api/user/v1/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Signup API response:', response.data);

      if (response.data.message === 'Successful' && response.data.data) {
        // Auto-login after successful registration
        login(response.data);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authStateChanged'));
        }
        console.log('Signup successful, redirecting to admin dashboard...');
        router.push('/admin/dashboard');
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        const errorMessage = err.response.data?.message 
          || err.response.data?.detail 
          || err.response.data?.error
          || 'Registration failed. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-white px-4 py-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-10">
            {/* Brand Section */}
            <div className="text-center mb-3 sm:mb-8">
              <h1 className="text-lg sm:text-3xl font-semibold text-gray-900 mb-0.5 sm:mb-2">
                Create Account
              </h1>
              <p className="text-gray-500 text-sm">
                Sign up to get started
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-start sm:items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Choose a username"
                    required
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Create a password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer" 
                  required
                />
                <span className="text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer">
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 sm:py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-3 sm:my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 whitespace-nowrap">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
              <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium cursor-pointer">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="truncate">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium cursor-pointer">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="truncate">Twitter</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/Login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200 cursor-pointer">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;








// // Small Page code for Sign UP
// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Signup = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Basic validation
//     if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     // Password match validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     // Password strength validation
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting signup with:', { 
//         username: formData.username, 
//         email: formData.email 
//       });
      
//       const response = await AxiosInstance.post('/api/user/v1/register/', {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });
      
//       console.log('Signup API response:', response.data);

//       if (response.data.message === 'Successful' && response.data.data) {
//         // Auto-login after successful registration
//         login(response.data);
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
//         console.log('Signup successful, redirecting to admin dashboard...');
//         router.push('/admin/dashboard');
//       } else {
//         setError(response.data.message || 'Registration failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       if (err.response) {
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Registration failed. Please try again.';
//         setError(errorMessage);
//       } else if (err.request) {
//         setError('Unable to connect to server. Please check your connection.');
//       } else {
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-8 sm:p-10">
//             {/* Brand Section */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-semibold text-gray-900 mb-2">
//                 Create Account
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Sign up to get started
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                 <div className="flex items-center gap-3">
//                   <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <span>{error}</span>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Choose a username"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Create a password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Confirm your password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-start gap-2 text-sm">
//                 <input 
//                   type="checkbox" 
//                   className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
//                   required
//                 />
//                 <span className="text-gray-600">
//                   I agree to the{' '}
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
//                     Terms of Service
//                   </a>
//                   {' '}and{' '}
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
//                     Privacy Policy
//                   </a>
//                 </span>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${
//                   loading
//                     ? 'bg-blue-400 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="flex items-center gap-4 my-6">
//               <div className="flex-1 h-px bg-gray-200"></div>
//               <span className="text-xs text-gray-400">Or continue with</span>
//               <div className="flex-1 h-px bg-gray-200"></div>
//             </div>

//             {/* Social Buttons */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span>Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                 </svg>
//                 <span>Twitter</span>
//               </button>
//             </div>

//             {/* Sign In Link */}
//             <div className="text-center text-sm text-gray-600">
//               Already have an account?{' '}
//               <a href="/Login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
//                 Sign in
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;





// Long page code for SignUp
// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Signup = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Basic validation
//     if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     // Phone number validation (basic)
//     const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       setError('Please enter a valid phone number');
//       setLoading(false);
//       return;
//     }

//     // Password match validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     // Password strength validation
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting signup with:', { 
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phoneNumber: formData.phoneNumber,
//         username: formData.username, 
//         email: formData.email 
//       });
      
//       const response = await AxiosInstance.post('/api/user/v1/register/', {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         phone_number: formData.phoneNumber,
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });
      
//       console.log('Signup API response:', response.data);

//       if (response.data.message === 'Successful' && response.data.data) {
//         // Auto-login after successful registration
//         login(response.data);
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
//         console.log('Signup successful, redirecting to admin dashboard...');
//         router.push('/admin/dashboard');
//       } else {
//         setError(response.data.message || 'Registration failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       if (err.response) {
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Registration failed. Please try again.';
//         setError(errorMessage);
//       } else if (err.request) {
//         setError('Unable to connect to server. Please check your connection.');
//       } else {
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-8 sm:p-10">
//             {/* Brand Section */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-semibold text-gray-900 mb-2">
//                 Create Account
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Sign up to get started
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                 <div className="flex items-center gap-3">
//                   <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <span>{error}</span>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* First Name & Last Name Row */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
//                     First Name
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                       placeholder="First name"
//                       required
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Last Name
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                       placeholder="Last name"
//                       required
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Phone Number */}
//               <div>
//                 <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="tel"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter your phone number"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Choose a username"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Create a password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Confirm your password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-start gap-2 text-sm">
//                 <input 
//                   type="checkbox" 
//                   className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
//                   required
//                 />
//                 <span className="text-gray-600">
//                   I agree to the{' '}
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
//                     Terms of Service
//                   </a>
//                   {' '}and{' '}
//                   <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
//                     Privacy Policy
//                   </a>
//                 </span>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${
//                   loading
//                     ? 'bg-blue-400 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="flex items-center gap-4 my-6">
//               <div className="flex-1 h-px bg-gray-200"></div>
//               <span className="text-xs text-gray-400">Or continue with</span>
//               <div className="flex-1 h-px bg-gray-200"></div>
//             </div>

//             {/* Social Buttons */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span>Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                 </svg>
//                 <span>Twitter</span>
//               </button>
//             </div>

//             {/* Sign In Link */}
//             <div className="text-center text-sm text-gray-600">
//               Already have an account?{' '}
//               <a href="/Login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
//                 Sign in
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;