// 'use client';
// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import AxiosInstance from "@/components/AxiosInstance";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function ForgetPassword() {
//     const router = useRouter();

//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [step, setStep] = useState(1);
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [resetToken, setResetToken] = useState(""); // Store the reset token from step 2

//     // Step 1: Request OTP
//     const handleForgetPassword = async () => {
//         if (!email) {
//             toast.error("Please enter your email address");
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             toast.error("Please enter a valid email address");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await AxiosInstance.post('/api/user/v1/forget/password/', { email });
//             console.log("OTP sent successfully:", response);
//             toast.success("OTP sent to your email!");
//             setStep(2);
//         } catch (error) {
//             console.error("Error sending OTP:", error.response?.data || error.message);
//             const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Step 2: Verify OTP and get reset token
//     const handleVerifyOtp = async () => {
//         if (!otp) {
//             toast.error("Please enter the OTP code");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await AxiosInstance.post('/api/user/v1/verify/otp/', {
//                 email,
//                 code: otp,
//             });
//             console.log("OTP verified successfully:", response);
            
//             // Store the reset token for step 3
//             setResetToken(response.data.reset_token);
//             toast.success("OTP verified! Please set your new password.");
//             setStep(3);
//         } catch (error) {
//             console.error("Error verifying OTP:", error.response?.data || error.message);
//             const errorMessage = error.response?.data?.message || "Failed to verify OTP. Please try again.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Step 3: Reset password using the reset token
//     const handleResetPassword = async () => {
//         if (!newPassword || !confirmPassword) {
//             toast.error("Please fill in all fields");
//             return;
//         }

//         if (newPassword !== confirmPassword) {
//             toast.error("Passwords do not match");
//             return;
//         }

//         if (newPassword.length < 6) {
//             toast.error("Password must be at least 6 characters");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await AxiosInstance.post('/api/user/v1/reset/password/', {
//                 reset_token: resetToken,
//                 new_password: newPassword,
//                 confirm_password: confirmPassword,
//             });
//             console.log("Password reset successfully:", response);

//             toast.success("Password reset successful!", {
//                 onClose: () => {
//                     router.push("/Login");
//                 },
//             });

//             // Clear all fields
//             setOtp("");
//             setNewPassword("");
//             setConfirmPassword("");
//             setResetToken("");
//         } catch (error) {
//             console.error("Error resetting password:", error.response?.data || error.message);
//             const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleback = () => {
//         if (step === 3) {
//             setStep(2);
//         } else if (step === 2) {
//             setStep(1);
//         } else {
//             router.push("/Login");
//         }
//     };

//     // Get step title and description
//     const getStepInfo = () => {
//         switch(step) {
//             case 1:
//                 return {
//                     title: "Forgot Password",
//                     description: "Enter your email to receive OTP"
//                 };
//             case 2:
//                 return {
//                     title: "Verify OTP",
//                     description: "Enter the 6-digit code sent to your email"
//                 };
//             case 3:
//                 return {
//                     title: "Reset Password",
//                     description: "Set your new password"
//                 };
//             default:
//                 return {
//                     title: "Forgot Password",
//                     description: "Reset your password"
//                 };
//         }
//     };

//     // Progress indicator
//     const renderProgressBar = () => {
//         const steps = ['Email', 'Verify OTP', 'New Password'];
        
//         return (
//             <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                     {steps.map((stepName, index) => (
//                         <div key={index} className="flex flex-col items-center">
//                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                 index + 1 < step 
//                                     ? 'bg-green-500 text-white' 
//                                     : index + 1 === step
//                                     ? 'bg-amber-500 text-white'
//                                     : 'bg-white/10 text-white/40'
//                             }`}>
//                                 {index + 1}
//                             </div>
//                             <span className={`text-xs mt-2 transition-all duration-300 ${
//                                 index + 1 <= step ? 'text-white' : 'text-white/40'
//                             }`}>
//                                 {stepName}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="relative h-2 bg-white/10 rounded-full">
//                     <div 
//                         className="absolute h-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 rounded-full transition-all duration-500"
//                         style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
//                     ></div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//             {/* Animated background elements */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute -inset-10 opacity-20">
//                     <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
//                     <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
//                 </div>
//             </div>

//             <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//                 {/* Decorative header */}
//                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400"></div>
                
//                 <div className="p-8">
//                     {/* Back Button */}
//                     <button 
//                         onClick={handleback} 
//                         className="mb-6 text-white/70 hover:text-white transition-colors duration-300 flex items-center group"
//                     >
//                         <FontAwesomeIcon icon={faArrowLeft} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
//                         <span>Back</span>
//                     </button>

//                     {/* Logo/Brand */}
//                     <div className="text-center mb-8">
//                         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
//                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                             </svg>
//                         </div>
//                         <h2 className="text-3xl font-light text-white tracking-wide">
//                             {getStepInfo().title}
//                         </h2>
//                         <p className="text-white/60 text-sm mt-2 font-light">
//                             {getStepInfo().description}
//                         </p>
//                     </div>

//                     {/* Progress Bar */}
//                     {renderProgressBar()}

//                     {/* Step 1: Email Input */}
//                     {step === 1 && (
//                         <div className="space-y-6">
//                             {/* Email Field */}
//                             <div className="group">
//                                 <label 
//                                     htmlFor="email" 
//                                     className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-amber-300"
//                                 >
//                                     Email Address
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all duration-300 backdrop-blur-sm"
//                                         placeholder="Enter your email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         disabled={loading}
//                                     />
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Send OTP Button */}
//                             <button
//                                 onClick={handleForgetPassword}
//                                 disabled={loading}
//                                 className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
//                                     loading 
//                                         ? 'bg-gray-500 cursor-not-allowed' 
//                                         : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'
//                                 }`}
//                             >
//                                 {loading ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                                             <circle 
//                                                 className="opacity-25" 
//                                                 cx="12" 
//                                                 cy="12" 
//                                                 r="10" 
//                                                 stroke="currentColor" 
//                                                 strokeWidth="4"
//                                                 fill="none"
//                                             />
//                                             <path 
//                                                 className="opacity-75" 
//                                                 fill="currentColor" 
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                             />
//                                         </svg>
//                                         Sending OTP...
//                                     </span>
//                                 ) : (
//                                     'Send OTP'
//                                 )}
//                             </button>
//                         </div>
//                     )}

//                     {/* Step 2: OTP Verification */}
//                     {step === 2 && (
//                         <div className="space-y-6">
//                             {/* Email Display (Read-only) */}
//                             <div className="group">
//                                 <label className="block text-sm font-medium text-white/80 mb-2">
//                                     Email Address
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="email"
//                                         className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80 cursor-not-allowed backdrop-blur-sm"
//                                         value={email}
//                                         readOnly
//                                     />
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* OTP Field */}
//                             <div className="group">
//                                 <label 
//                                     htmlFor="otp" 
//                                     className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-cyan-300"
//                                 >
//                                     6-digit OTP Code
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         id="otp"
//                                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 backdrop-blur-sm text-center text-2xl tracking-widest"
//                                         placeholder="000000"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                                         disabled={loading}
//                                         maxLength={6}
//                                     />
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <p className="text-xs text-white/40 mt-2">
//                                     Enter the 6-digit code sent to your email
//                                 </p>
//                             </div>

//                             {/* Verify OTP Button */}
//                             <button
//                                 onClick={handleVerifyOtp}
//                                 disabled={loading || otp.length !== 6}
//                                 className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
//                                     loading || otp.length !== 6
//                                         ? 'bg-gray-500 cursor-not-allowed' 
//                                         : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25'
//                                 }`}
//                             >
//                                 {loading ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                                             <circle 
//                                                 className="opacity-25" 
//                                                 cx="12" 
//                                                 cy="12" 
//                                                 r="10" 
//                                                 stroke="currentColor" 
//                                                 strokeWidth="4"
//                                                 fill="none"
//                                             />
//                                             <path 
//                                                 className="opacity-75" 
//                                                 fill="currentColor" 
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                             />
//                                         </svg>
//                                         Verifying...
//                                     </span>
//                                 ) : (
//                                     'Verify OTP'
//                                 )}
//                             </button>
//                         </div>
//                     )}

//                     {/* Step 3: Reset Password */}
//                     {step === 3 && (
//                         <div className="space-y-6">
//                             {/* New Password Field */}
//                             <div className="group">
//                                 <label 
//                                     htmlFor="newPassword" 
//                                     className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-green-300"
//                                 >
//                                     New Password
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         id="newPassword"
//                                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 transition-all duration-300 backdrop-blur-sm pr-12"
//                                         placeholder="Enter new password"
//                                         value={newPassword}
//                                         onChange={(e) => setNewPassword(e.target.value)}
//                                         disabled={loading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-300"
//                                     >
//                                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Confirm Password Field */}
//                             <div className="group">
//                                 <label 
//                                     htmlFor="confirmPassword" 
//                                     className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-green-300"
//                                 >
//                                     Confirm Password
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         id="confirmPassword"
//                                         className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 transition-all duration-300 backdrop-blur-sm pr-12"
//                                         placeholder="Confirm new password"
//                                         value={confirmPassword}
//                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                         disabled={loading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-300"
//                                     >
//                                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Password requirements */}
//                             <div className="bg-white/5 rounded-xl p-4">
//                                 <p className="text-sm text-white/60 mb-2">Password requirements:</p>
//                                 <ul className="text-xs text-white/40 space-y-1">
//                                     <li className={`flex items-center ${newPassword.length >= 6 ? 'text-green-400' : ''}`}>
//                                         <svg className={`w-4 h-4 mr-2 ${newPassword.length >= 6 ? 'text-green-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                         At least 6 characters
//                                     </li>
//                                     <li className={`flex items-center ${newPassword === confirmPassword && newPassword ? 'text-green-400' : ''}`}>
//                                         <svg className={`w-4 h-4 mr-2 ${newPassword === confirmPassword && newPassword ? 'text-green-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                         Passwords match
//                                     </li>
//                                 </ul>
//                             </div>

//                             {/* Reset Password Button */}
//                             <button
//                                 onClick={handleResetPassword}
//                                 disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
//                                 className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
//                                     loading || !newPassword || !confirmPassword || newPassword !== confirmPassword
//                                         ? 'bg-gray-500 cursor-not-allowed' 
//                                         : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25'
//                                 }`}
//                             >
//                                 {loading ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                                             <circle 
//                                                 className="opacity-25" 
//                                                 cx="12" 
//                                                 cy="12" 
//                                                 r="10" 
//                                                 stroke="currentColor" 
//                                                 strokeWidth="4"
//                                                 fill="none"
//                                             />
//                                             <path 
//                                                 className="opacity-75" 
//                                                 fill="currentColor" 
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                             />
//                                         </svg>
//                                         Resetting Password...
//                                     </span>
//                                 ) : (
//                                     'Reset Password'
//                                 )}
//                             </button>
//                         </div>
//                     )}

//                     {/* Sign In Link */}
//                     <div className="text-center mt-8">
//                         <span className="text-white/60 text-sm">
//                             Remember your password?{' '}
//                         </span>
//                         <button
//                             onClick={() => router.push("/Login")}
//                             className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium hover:underline"
//                         >
//                             Sign in
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <ToastContainer 
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="dark"
//             />
//         </div>
//     );
// }







// Mobile Responsive Version
'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import AxiosInstance from "@/components/AxiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgetPassword() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState("");

    // Step 1: Request OTP
    const handleForgetPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await AxiosInstance.post('/api/user/v1/forget/password/', { email });
            console.log("OTP sent successfully:", response);
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and get reset token
    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter the OTP code");
            return;
        }

        setLoading(true);
        try {
            const response = await AxiosInstance.post('/api/user/v1/verify/otp/', {
                email,
                code: otp,
            });
            console.log("OTP verified successfully:", response);
            
            setResetToken(response.data.reset_token);
            toast.success("OTP verified! Please set your new password.");
            setStep(3);
        } catch (error) {
            console.error("Error verifying OTP:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Failed to verify OTP. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password using the reset token
    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await AxiosInstance.post('/api/user/v1/reset/password/', {
                reset_token: resetToken,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            console.log("Password reset successfully:", response);

            toast.success("Password reset successful!", {
                onClose: () => {
                    router.push("/Login");
                },
            });

            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
            setResetToken("");
        } catch (error) {
            console.error("Error resetting password:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleback = () => {
        if (step === 3) {
            setStep(2);
        } else if (step === 2) {
            setStep(1);
        } else {
            router.push("/Login");
        }
    };

    // Get step title and description
    const getStepInfo = () => {
        switch(step) {
            case 1:
                return {
                    title: "Forgot Password",
                    description: "Enter your email to receive OTP"
                };
            case 2:
                return {
                    title: "Verify OTP",
                    description: "Enter the 6-digit code sent to your email"
                };
            case 3:
                return {
                    title: "Reset Password",
                    description: "Set your new password"
                };
            default:
                return {
                    title: "Forgot Password",
                    description: "Reset your password"
                };
        }
    };

    // Progress indicator
    const renderProgressBar = () => {
        const steps = ['Email', 'Verify OTP', 'New Password'];
        
        return (
            <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    {steps.map((stepName, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                                index + 1 < step 
                                    ? 'bg-green-500 text-white' 
                                    : index + 1 === step
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-400'
                            }`}>
                                {index + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 transition-all duration-300 ${
                                index + 1 <= step ? 'text-gray-700 font-medium' : 'text-gray-400'
                            }`}>
                                {stepName}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="relative h-1.5 sm:h-2 bg-gray-200 rounded-full">
                    <div 
                        className="absolute h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex items-start sm:items-center justify-center bg-white px-4 py-3 sm:p-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 sm:p-10">
                        {/* Back Button */}
                        <button 
                            onClick={handleback} 
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 sm:mb-6 group"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm sm:text-base">Back</span>
                        </button>

                        {/* Brand Section */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
                                {getStepInfo().title}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {getStepInfo().description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        {renderProgressBar()}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleForgetPassword(); }} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

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
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-base sm:text-sm text-gray-500 cursor-not-allowed"
                                            value={email}
                                            readOnly
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        6-digit OTP Code
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="otp"
                                            className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-xl sm:text-2xl tracking-widest"
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            disabled={loading}
                                            maxLength={6}
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Enter the 6-digit code sent to your email
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className={`w-full py-2 sm:py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                                        loading || otp.length !== 6
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
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 3: Reset Password */}
                        {step === 3 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="newPassword"
                                            className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10 sm:pr-12"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 px-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex="-1"
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="w-full px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10 sm:pr-12"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 px-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex="-1"
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                {/* Password requirements */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                                    <p className="text-xs font-medium text-gray-700 mb-2.5">
                                        Password Requirements
                                    </p>
                                    <ul className="space-y-1.5 text-xs text-gray-600">
                                        <li className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-emerald-600' : ''}`}>
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                            At least 6 characters
                                        </li>
                                        <li className={`flex items-center gap-2 ${newPassword === confirmPassword && newPassword ? 'text-emerald-600' : ''}`}>
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${newPassword === confirmPassword && newPassword ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                    className={`w-full py-2 sm:py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                                        loading || !newPassword || !confirmPassword || newPassword !== confirmPassword
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
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Sign In Link */}
                        <div className="text-center mt-6 sm:mt-8">
                            <span className="text-sm text-gray-600">
                                Remember your password?{' '}
                            </span>
                            <button
                                onClick={() => router.push("/Login")}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}