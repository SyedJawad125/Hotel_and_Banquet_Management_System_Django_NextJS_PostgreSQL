// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Basic validation
//     if (!formData.username || !formData.password) {
//       setError('Please enter both username and password');
//       setLoading(false);
//       return;
//     }

//     // Email format validation
//     const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!usernameRegex.test(formData.username)) {
//       setError('Please enter a valid username address');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting login with:', { username: formData.username });
      
//       // Call your login API
//       const response = await AxiosInstance.post('/api/user/v1/login/', formData);
      
//       console.log('Login API response:', response.data);

//       // Backend returns: { message: "Successful", data: {...}, count: null }
//       if (response.data.message === 'Successful' && response.data.data) {
//         // Pass the entire response to login function
//         login(response.data);
        
//         // Notify the sidebar about auth change
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
        
//         console.log('Login successful, redirecting to admindashboard...');
//         router.push('/admindashboard');

//       } else {
//         setError(response.data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
      
//       // Handle different error scenarios
//       if (err.response) {
//         // Server responded with error status
//         // Backend returns errors in format: { message: "error message" }
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Invalid credentials. Please try again.';
//         setError(errorMessage);
//       } else if (err.request) {
//         // Request was made but no response received
//         setError('Unable to connect to server. Please check your connection.');
//       } else {
//         // Something else happened
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -inset-10 opacity-20">
//           <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>
//       </div>

//       <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//         {/* Decorative header */}
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400"></div>
        
//         <div className="p-8">
//           {/* Logo/Brand */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
//               <span className="text-2xl font-bold text-white">L</span>
//             </div>
//             <h2 className="text-3xl font-light text-white tracking-wide">
//               Welcome Back
//             </h2>
//             <p className="text-white/60 text-sm mt-2 font-light">
//               Sign in to your account
//             </p>
//           </div>
          
//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-white rounded-xl backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {error}
//               </div>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div className="group">
//               <label 
//                 htmlFor="username" 
//                 className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-amber-300"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="username"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all duration-300 backdrop-blur-sm"
//                   placeholder="Enter your username"
//                   required
//                   disabled={loading}
//                 />
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             {/* Password Field */}
//             <div className="group">
//               <label 
//                 htmlFor="password" 
//                 className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-cyan-300"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 backdrop-blur-sm"
//                   placeholder="Enter your password"
//                   required
//                   disabled={loading}
//                 />
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center text-white/70 text-sm">
//                 <input type="checkbox" className="rounded bg-white/10 border-white/20 text-amber-400 focus:ring-amber-400/50" />
//                 <span className="ml-2">Remember me</span>
//               </label>
//               <a 
//                 href="/forgetpassword" 
//                 className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors duration-300 hover:underline"
//               >
//                 Forgot password?
//               </a>
//             </div>
            
//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
//                 loading 
//                   ? 'bg-gray-500 cursor-not-allowed' 
//                   : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                     <circle 
//                       className="opacity-25" 
//                       cx="12" 
//                       cy="12" 
//                       r="10" 
//                       stroke="currentColor" 
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path 
//                       className="opacity-75" 
//                       fill="currentColor" 
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center">
//                   Sign In
//                   <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </span>
//               )}
//             </button>
//           </form>
          
//           {/* Divider */}
//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-white/10"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 text-white/40 bg-transparent">Or continue with</span>
//             </div>
//           </div>
          
//           {/* Social Login */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <button 
//               type="button"
//               className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Google
//             </button>
//             <button 
//               type="button"
//               className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
//             >
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//               </svg>
//               Twitter
//             </button>
//           </div>
          
//           {/* Sign Up Link */}
//           <div className="text-center">
//             <span className="text-white/60 text-sm">
//               Don't have an account?{' '}
//             </span>
//             <a 
//               href="/signup" 
//               className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium hover:underline"
//             >
//               Create account
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;








// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
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

//     if (!formData.username || !formData.password) {
//       setError('Please enter both username and password');
//       setLoading(false);
//       return;
//     }

//     const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!usernameRegex.test(formData.username)) {
//       setError('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting login with:', { username: formData.username });
//       const response = await AxiosInstance.post('/api/user/v1/login/', formData);
//       console.log('Login API response:', response.data);

//       if (response.data.message === 'Successful' && response.data.data) {
//         login(response.data);
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
//         console.log('Login successful, redirecting to admin dashboard...');
//         router.push('/admin/dashboard');
//       } else {
//         setError(response.data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       if (err.response) {
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Invalid credentials. Please try again.';
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
//                 Welcome Back
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Sign in to your account
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
//               {/* Email / Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="username"
//                     name="username"
//                     value={formData.username}
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
//                     placeholder="Enter your password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
//                   <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                   <span>Remember me</span>
//                 </label>
//                 <a href="/forgetpassword" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
//                   Forgot password?
//                 </a>
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
//                     Signing in...
//                   </span>
//                 ) : (
//                   'Sign In'
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

//             {/* Sign Up Link */}
//             <div className="text-center text-sm text-gray-600">
//               Don't have an account?{' '}
//               <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
//                 Create account
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




// // Mobile Responsive Login Component
// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
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

//     if (!formData.username || !formData.password) {
//       setError('Please enter both username and password');
//       setLoading(false);
//       return;
//     }

//     const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!usernameRegex.test(formData.username)) {
//       setError('Please enter a valid email address');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting login with:', { username: formData.username });
//       const response = await AxiosInstance.post('/api/user/v1/login/', formData);
//       console.log('Login API response:', response.data);

//       if (response.data.message === 'Successful' && response.data.data) {
//         login(response.data);
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
//         console.log('Login successful, redirecting to admin dashboard...');
//         router.push('/admin/dashboard');
//       } else {
//         setError(response.data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       if (err.response) {
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Invalid credentials. Please try again.';
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
//     <div className="min-h-screen flex items-start sm:items-center justify-center bg-white px-4 py-8 sm:p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-6 sm:p-10">
//             {/* Brand Section */}
//             <div className="text-center mb-6 sm:mb-8">
//               <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Sign in to your account
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                 <div className="flex items-start sm:items-center gap-3">
//                   <svg className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <span className="break-words">{error}</span>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//               {/* Email / Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                     autoComplete="email"
//                     inputMode="email"
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
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter your password"
//                     required
//                     disabled={loading}
//                     autoComplete="current-password"
//                   />
//                 </div>
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
//                 <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
//                   <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                   <span>Remember me</span>
//                 </label>
//                 <a href="/forgetpassword" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${
//                   loading
//                     ? 'bg-blue-400 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="flex items-center gap-4 my-5 sm:my-6">
//               <div className="flex-1 h-px bg-gray-200"></div>
//               <span className="text-xs text-gray-400 whitespace-nowrap">Or continue with</span>
//               <div className="flex-1 h-px bg-gray-200"></div>
//             </div>

//             {/* Social Buttons */}
//             <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
//               <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span className="truncate">Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium">
//                 <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                 </svg>
//                 <span className="truncate">Twitter</span>
//               </button>
//             </div>

//             {/* Sign Up Link */}
//             <div className="text-center text-sm text-gray-600">
//               Don't have an account?{' '}
//               <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
//                 Create account
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




// Mobile Responsive Login Component
'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import AxiosInstance from '@/components/AxiosInstance';

const Login = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { username: formData.username });
      const response = await AxiosInstance.post('/api/user/v1/login/', formData);
      console.log('Login API response:', response.data);

      if (response.data.message === 'Successful' && response.data.data) {
        login(response.data);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authStateChanged'));
        }
        console.log('Login successful, redirecting to admin dashboard...');
        router.push('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        const errorMessage = err.response.data?.message 
          || err.response.data?.detail 
          || err.response.data?.error
          || 'Invalid credentials. Please try again.';
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
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-white px-4 py-5 sm:p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-5 sm:p-10">
            {/* Brand Section */}
            <div className="text-center mb-4 sm:mb-8">
              <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm">
                Sign in to your account
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

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
              {/* Email / Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Remember me</span>
                </label>
                <a href="/forgetpassword" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4 sm:my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 whitespace-nowrap">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="truncate">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="truncate">Twitter</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;