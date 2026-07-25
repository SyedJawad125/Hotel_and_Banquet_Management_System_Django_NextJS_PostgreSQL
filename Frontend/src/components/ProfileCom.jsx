'use client';
import React, { useState, useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  User, Mail, Phone, Shield, Calendar, Clock, Key, Eye, EyeOff,
  Lock, CheckCircle, XCircle, ArrowLeft,
} from 'lucide-react';

/* ── Design tokens — Gulf Hotel gold-on-ivory ───────────────────────── */
const gold = '#C6A43F';
const goldDeep = '#9C7F2C';
const ink = '#26231D';
const ivory = '#FBF9F4';
const line = 'rgba(198,164,63,0.22)';
const lineSoft = 'rgba(198,164,63,0.12)';
const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

const displayFont = "'Cormorant Garamond', serif";
const bodyFont = "'DM Sans', sans-serif";

/* ── Responsive styles ───────────────────────────────────────────────────── */
const responsiveStyles = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .pf-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .pf-title { font-size: 28px !important; }
    .pf-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
    .pf-card { padding: 20px !important; }
  }
`;

const ProfileCom = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/user/v1/profile/');
      console.log('Profile response:', res.data);
      // Handle different response structures
      const data = res.data.data || res.data;
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response?.data);
      // Fallback to AuthContext user data if API fails
      if (user) {
        setProfileData({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          profile_image: user.profile_image,
          role: user.role,
          is_staff: user.is_staff,
          is_superuser: user.is_superuser,
          last_login: user.last_login,
          date_joined: user.created_at,
        });
      }
      toast.error('Using cached profile data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await AxiosInstance.post('/api/user/v1/change/password/', passwordForm);
      toast.success('Password changed successfully');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error changing password';
      toast.error(typeof msg === 'string' ? msg : 'Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{
            width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
            borderRadius: '50%', animation: 'pf-spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes pf-spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="pf-container" style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
            Account Settings
          </div>
          <h1 className="pf-title" style={{ fontFamily: displayFont, fontSize: 42, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
            My Profile
          </h1>
          <p style={{ color: '#A39C8A', fontSize: 14, marginTop: 8 }}>
            Manage your account information and security settings
          </p>
        </div>

        {/* Content Grid */}
        <div className="pf-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

          {/* Profile Information Card */}
          <div className="pf-card" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 32, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(160deg, #E7C766 0%, #C6A43F 60%, #9C7C28 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#1a1a1a', fontSize: 20,
                boxShadow: '0 4px 16px rgba(198,164,63,0.35)',
                marginTop: '-18px',
              }}>
                {profileData?.first_name?.[0] || profileData?.username?.[0] || 'U'}
                {profileData?.last_name?.[0] || ''}
              </div>
              <div>
                <h2 style={{ fontFamily: displayFont, fontSize: 24, color: ink, fontWeight: 600, marginBottom: 4, lineHeight: 1.2 }}>
                  {profileData?.full_name || profileData?.username || 'User'}
                </h2>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 999,
                  background: `${gold}12`, color: gold,
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                }}>
                  <Shield size={12} />
                  {profileData?.role?.name || 'User'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Username */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={18} color={goldDeep} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8270', fontWeight: 600, marginBottom: 2 }}>
                    Username
                  </div>
                  <div style={{ fontSize: 14, color: ink, fontWeight: 500 }}>
                    {profileData?.username || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Mail size={18} color={goldDeep} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8270', fontWeight: 600, marginBottom: 2 }}>
                    Email
                  </div>
                  <div style={{ fontSize: 14, color: ink, fontWeight: 500 }}>
                    {profileData?.email || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Phone size={18} color={goldDeep} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8270', fontWeight: 600, marginBottom: 2 }}>
                    Mobile
                  </div>
                  <div style={{ fontSize: 14, color: ink, fontWeight: 500 }}>
                    {profileData?.mobile || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Join Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={18} color={goldDeep} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8270', fontWeight: 600, marginBottom: 2 }}>
                    Member Since
                  </div>
                  <div style={{ fontSize: 14, color: ink, fontWeight: 500 }}>
                    {formatDate(profileData?.date_joined)}
                  </div>
                </div>
              </div>

              {/* Last Login */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Clock size={18} color={goldDeep} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A8270', fontWeight: 600, marginBottom: 2 }}>
                    Last Login
                  </div>
                  <div style={{ fontSize: 14, color: ink, fontWeight: 500 }}>
                    {formatDate(profileData?.last_login)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="pf-card" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 32, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${gold}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Key size={22} color={goldDeep} />
              </div>
              <div>
                <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
                  Change Password
                </h2>
                <p style={{ fontSize: 13, color: '#A39C8A' }}>
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '14px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              >
                <Lock size={16} color={gold} />
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Old Password */}
                  <div>
                    <label style={{
                      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600,
                    }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        value={passwordForm.old_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                        placeholder="Enter current password"
                        required
                        style={{
                          width: '100%', padding: '11px 42px 11px 14px', background: ivory,
                          border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                          color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#A39C8A',
                        }}
                      >
                        {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{
                      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600,
                    }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        placeholder="Enter new password"
                        required
                        style={{
                          width: '100%', padding: '11px 42px 11px 14px', background: ivory,
                          border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                          color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#A39C8A',
                        }}
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{
                      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600,
                    }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        placeholder="Confirm new password"
                        required
                        style={{
                          width: '100%', padding: '11px 42px 11px 14px', background: ivory,
                          border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                          color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#A39C8A',
                        }}
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      style={{
                        flex: 1, background: ink, color: '#FBF6E8', border: 'none',
                        borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 600,
                        cursor: changingPassword ? 'not-allowed' : 'pointer',
                        opacity: changingPassword ? 0.6 : 1, letterSpacing: '0.02em',
                      }}
                    >
                      {changingPassword ? 'Changing...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
                      }}
                      disabled={changingPassword}
                      style={{
                        flex: 1, background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                        borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 600,
                        cursor: changingPassword ? 'not-allowed' : 'pointer',
                        opacity: changingPassword ? 0.6 : 1,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileCom;
