'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import {
  Search, Users2, Mail, Phone, ShieldCheck, Download,
  ChevronLeft, ChevronRight, UserRound,
} from 'lucide-react';

/* ── Design tokens — Gulf Hotel gold-on-ivory (matches HallsVenuesCom) ── */
const gold = '#C6A43F';
const goldDeep = '#9C7F2C';
const ink = '#26231D';
const ivory = '#FBF9F4';
const line = 'rgba(198,164,63,0.22)';
const lineSoft = 'rgba(198,164,63,0.12)';
const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

const displayFont = "'Cormorant Garamond', serif";
const bodyFont = "'DM Sans', sans-serif";

/* ── Small building blocks ───────────────────────────────────────────── */

const StatusPill = ({ status, deactivated }) => {
  const isActive = deactivated === true ? false : (status ? status.toLowerCase() === 'active' : true);
  const label = status || (deactivated ? 'Deactivated' : 'Active');
  const isInvited = status && status.toLowerCase() === 'invited';

  let bg = '#EAF4EA', fg = '#3D7A45', bd = 'rgba(61,122,69,0.18)';
  if (!isActive && !isInvited) { bg = '#FBEAEA'; fg = '#B23B3B'; bd = 'rgba(178,59,59,0.18)'; }
  if (isInvited) { bg = '#FBF1DC'; fg = goldDeep; bd = line; }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
      background: bg, color: fg, border: `1px solid ${bd}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />
      {label}
    </span>
  );
};

/* ── Main component ──────────────────────────────────────────────────── */

const SystemUsersCom = () => {
  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/user/v1/user/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      // Backend returns { message, count, data: [...] } — data is the array directly.
      // Some endpoints nest it one level deeper as { data: { count, data: [...] } },
      // so we check both shapes to be safe.
      const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
      const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

      if (Array.isArray(list)) {
        setRecords(list);
        setCount(total ?? list.length);
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Could not load users');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((u) => {
      const idMatch = u.id?.toString() === q;
      const nameMatch = (u.full_name || `${u.first_name || ''} ${u.last_name || ''}`).toLowerCase().includes(q);
      const emailMatch = u.email?.toLowerCase().includes(q);
      const mobileMatch = u.mobile?.toLowerCase().includes(q);
      const roleMatch = (u.role?.name || u.role_name || '').toLowerCase().includes(q);
      return idMatch || nameMatch || emailMatch || mobileMatch || roleMatch;
    });
  }, [records, searchTerm]);

  const totalUsers = count;
  const activeCount = records.filter((u) => !u.deactivated && (!u.status || u.status.toLowerCase() === 'active')).length;
  const invitedCount = records.filter((u) => u.status && u.status.toLowerCase() === 'invited').length;

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No users to export');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Mobile', 'Role', 'Status'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredRecords.map((u) => [
      u.id,
      u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      u.email,
      u.mobile,
      u.role?.name || u.role_name || '',
      u.status || (u.deactivated ? 'Deactivated' : 'Active'),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `system-users-export-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const initials = (u) => {
    const name = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || '?';
    return name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Staff Management
            </div>
            <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              System Users
            </h1>
          </div>

          <button
            onClick={exportCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
              padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.02em', boxShadow: shadowCard,
            }}
          >
            <Download size={15} color={goldDeep} />
            Export CSV
          </button>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Users', value: totalUsers, icon: Users2 },
            { label: 'Active', value: activeCount, icon: ShieldCheck, accent: '#3D7A45' },
            { label: 'Invited', value: invitedCount, icon: Mail, accent: goldDeep },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 600, color: accent || ink }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
          padding: 14, marginBottom: 22, boxShadow: shadowCard,
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, mobile, or role…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%', padding: '11px 14px 11px 42px', background: ivory,
                border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
              borderRadius: '50%', animation: 'su-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes su-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading users…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['User', 'Email', 'Mobile', 'Role', 'Status'].map((h, i) => (
                      <th key={i} style={{
                        textAlign: 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((u, idx) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {u.profile_image ? (
                            <img
                              src={u.profile_image}
                              alt={u.full_name}
                              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${line}`, flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                              background: 'rgba(198,164,63,0.12)', border: `1px solid ${line}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: goldDeep,
                            }}>
                              {initials(u)}
                            </div>
                          )}
                          <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>
                            {u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim()}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
                        {u.email ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Mail size={13} color="#A39C8A" /> {u.email}
                          </span>
                        ) : <span style={{ color: '#C8C0AC' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {u.mobile ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Phone size={13} color="#A39C8A" /> {u.mobile}
                          </span>
                        ) : <span style={{ color: '#C8C0AC' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {(u.role?.name || u.role_name) ? (
                          <span style={{
                            fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
                            border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
                          }}>{u.role?.name || u.role_name}</span>
                        ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <StatusPill status={u.status} deactivated={u.deactivated} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} user{count !== 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === 1 ? '#D8D2C0' : ink,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === totalPages ? '#D8D2C0' : ink,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredRecords.length === 0 && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: ivory,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <UserRound size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No users found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5 }}>
              {searchTerm ? 'Try a different search term' : 'No system users have been added yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemUsersCom;