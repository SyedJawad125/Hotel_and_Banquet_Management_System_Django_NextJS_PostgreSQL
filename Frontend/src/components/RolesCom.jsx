'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, ShieldCheck, Hash,
  Download, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';

/* ── Design tokens — Gulf Hotel gold-on-ivory (matches CustomersCom / EmployeeCom) ── */
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
    .ro-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .ro-header { flex-direction: column !important; align-items: flex-start !important; }
    .ro-title { font-size: 28px !important; }
    .ro-header-actions { width: 100% !important; flex-wrap: wrap !important; }
    .ro-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .ro-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .ro-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .ro-table thead { display: none !important; }
    .ro-table, .ro-table tbody, .ro-table tr, .ro-table td {
      display: block !important; width: 100% !important;
    }
    .ro-table { min-width: 0 !important; }
    .ro-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .ro-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .ro-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .ro-table td.ro-empty-label { justify-content: flex-end !important; }
    .ro-table td.ro-empty-label::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .ro-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

const FormGroup = ({ label, required, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600, fontFamily: bodyFont,
    }}>
      {label}{required && <span style={{ color: gold }}> *</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 5, fontFamily: bodyFont }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: '100%', background: ivory, border: `1px solid ${line}`,
  borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontFamily: bodyFont,
  outline: 'none', color: ink, boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function TextField({ value, onChange, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...inputStyle, borderColor: focused ? gold : line }}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

/* ── Modal shell ──────────────────────────────────────────────────────── */

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(38,35,29,0.45)',
        backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: 22, width: '100%',
        maxWidth: wide ? 640 : 480, maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 30px 60px -15px rgba(38,35,29,0.35)',
        border: `1px solid ${line}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '22px 26px', borderBottom: `1px solid ${lineSoft}`,
          position: 'sticky', top: 0, background: '#FFFFFF', borderRadius: '22px 22px 0 0',
        }}>
          <div>
            <div style={{ fontFamily: displayFont, fontSize: 23, color: ink, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: '#A39C8A', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              cursor: 'pointer', width: 30, height: 30, borderRadius: '50%',
              border: `1px solid ${line}`, background: ivory, color: '#8A8270',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

const RolesCom = () => {
  const { permissions: userPermissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  // Grouped permission catalogue: { module_label: [{id, name, code_name}, ...] }
  const [permissionGroups, setPermissionGroups] = useState({});
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: '', code_name: '', description: '', permissions: [] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/user/v1/role/', {
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
        toast.error('Could not load roles');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      // PermissionView returns data already grouped by module_label:
      // { message, count, data: { "Module Label": [{id, name, code_name, ...}], ... } }
      const res = await AxiosInstance.get('/api/user/v1/permission/');
      const payload = res?.data;
      const grouped = payload?.data && !Array.isArray(payload.data) ? payload.data : null;
      if (grouped) {
        setPermissionGroups(grouped);
      } else {
        console.error('Unexpected permission response structure:', res);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setPermissionsLoaded(true);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      const idMatch = r.id?.toString() === q;
      const nameMatch = r.name?.toLowerCase().includes(q);
      const codeMatch = r.code_name?.toLowerCase().includes(q);
      const descMatch = r.description?.toLowerCase().includes(q);
      return idMatch || nameMatch || codeMatch || descMatch;
    });
  }, [records, searchTerm]);

  const totalRoles = count;
  const totalPermissionsAvailable = Object.values(permissionGroups).reduce((sum, list) => sum + list.length, 0);
  const avgPermsPerRole = records.length
    ? Math.round(records.reduce((sum, r) => sum + (r.permissions?.length || 0), 0) / records.length)
    : 0;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingRole(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setForm({
      name: role.name || '',
      code_name: role.code_name || '',
      description: role.description || '',
      permissions: (role.permissions || []).map((p) => p.id),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const togglePermission = (permId) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(permId)
        ? f.permissions.filter((id) => id !== permId)
        : [...f.permissions, permId],
    }));
  };

  const toggleModuleGroup = (moduleLabel, modulePerms) => {
    const moduleIds = modulePerms.map((p) => p.id);
    const allSelected = moduleIds.every((id) => form.permissions.includes(id));
    setForm((f) => ({
      ...f,
      permissions: allSelected
        ? f.permissions.filter((id) => !moduleIds.includes(id))
        : [...new Set([...f.permissions, ...moduleIds])],
    }));
  };

  const saveRole = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code_name.trim() || !form.description.trim()) {
      toast.error('Role name, code name, and description are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code_name: form.code_name,
        description: form.description,
        permissions: form.permissions,
      };

      if (editingRole) {
        await AxiosInstance.patch(`/api/user/v1/role/?id=${editingRole.id}`, payload);
        toast.success('Role updated successfully');
      } else {
        await AxiosInstance.post('/api/user/v1/role/', payload);
        toast.success('Role created successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving role';
      toast.error(typeof msg === 'string' ? msg : 'Error saving role');
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (role) => {
    if (!window.confirm(`Remove the "${role.name}" role? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/user/v1/role/?id=${role.id}`);
      if (res) {
        toast.success('Role deleted successfully');
        setCurrentPage(1);
        fetchRoles();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'This role has users assigned and cannot be deleted');
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No roles to export');
      return;
    }
    const headers = ['ID', 'Role Name', 'Code Name', 'Description', 'Permissions'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredRecords.map((r) => [
      r.id, r.name, r.code_name, r.description,
      (r.permissions || []).map((p) => p.name).join('; '),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `roles-export-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="ro-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="ro-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Access Control
            </div>
            <h1 className="ro-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Roles
            </h1>
          </div>

          <div className="ro-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

            {userPermissions.create_role && (
              <button
                onClick={openCreate}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              >
                <Plus size={16} color={gold} />
                New Role
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="ro-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Roles', value: totalRoles, icon: Shield },
            { label: 'Permissions Available', value: totalPermissionsAvailable, icon: ShieldCheck, accent: '#3D7A45' },
            { label: 'Avg. Permissions / Role', value: avgPermsPerRole, icon: Hash, accent: goldDeep },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
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
              placeholder="Search by name, code, or description…"
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
              borderRadius: '50%', animation: 'rc-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes rc-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading roles…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="ro-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="ro-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Role', 'Code', 'Description', 'Permissions', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 5 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, idx) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{r.id}
                      </td>
                      <td data-label="Role" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                            background: 'rgba(198,164,63,0.12)', border: `1px solid ${line}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Shield size={17} color={goldDeep} />
                          </div>
                          <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>{r.name}</div>
                        </div>
                      </td>
                      <td data-label="Code" style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                          background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                        }}>{r.code_name}</span>
                      </td>
                      <td data-label="Description" style={{ padding: '14px 18px', fontSize: 13, color: ink, maxWidth: 280 }}>{r.description}</td>
                      <td data-label="Permissions" style={{ padding: '14px 18px' }}>
                        {r.permissions && r.permissions.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxWidth: 260 }}>
                            {r.permissions.slice(0, 3).map((p) => (
                              <span key={p.id} style={{
                                fontSize: 10.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
                                border: `1px solid ${line}`, borderRadius: 999, padding: '3px 9px', fontWeight: 600,
                              }}>{p.name}</span>
                            ))}
                            {r.permissions.length > 3 && (
                              <span style={{
                                fontSize: 10.5, color: '#A39C8A', background: ivory,
                                border: `1px solid ${lineSoft}`, borderRadius: 999, padding: '3px 9px', fontWeight: 600,
                              }}>+{r.permissions.length - 3} more</span>
                            )}
                          </div>
                        ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>No permissions</span>}
                      </td>
                      <td data-label="" className="ro-empty-label" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {userPermissions.update_role && (
                            <button
                              onClick={() => openEdit(r)}
                              title="Update"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
                                color: goldDeep, cursor: 'pointer',
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {userPermissions.delete_role && (
                            <button
                              onClick={() => deleteRole(r)}
                              title="Delete"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
                                color: '#B23B3B', cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="ro-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} role{count !== 1 ? 's' : ''}
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
              <Shield size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No roles found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first role to get started'}
            </p>
            {userPermissions.create_role && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                New Role
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingRole ? 'Update Role' : 'New Role'}
          subtitle={editingRole ? `Editing "${editingRole.name}"` : 'Define a role and its permissions'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveRole}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Role Name" required>
                <TextField
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Event Manager"
                />
              </FormGroup>
              <FormGroup label="Code Name" required hint="Unique identifier, e.g. EVENT_MANAGER">
                <TextField
                  value={form.code_name}
                  onChange={(e) => setForm({ ...form, code_name: e.target.value })}
                  placeholder="EVENT_MANAGER"
                />
              </FormGroup>
            </div>

            <FormGroup label="Description" required>
              <TextField
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What this role is responsible for"
              />
            </FormGroup>

            <FormGroup
              label="Permissions"
              hint={`${form.permissions.length} selected`}
            >
              {!permissionsLoaded ? (
                <div style={{ fontSize: 12.5, color: '#A39C8A', padding: '10px 0' }}>Loading permissions…</div>
              ) : Object.keys(permissionGroups).length === 0 ? (
                <div style={{ fontSize: 12.5, color: '#A39C8A', padding: '10px 0' }}>No permissions available</div>
              ) : (
                <div style={{
                  border: `1px solid ${line}`, borderRadius: 12, maxHeight: 280,
                  overflowY: 'auto', padding: 14, background: ivory,
                }}>
                  {Object.entries(permissionGroups).map(([moduleLabel, perms]) => {
                    const allSelected = perms.every((p) => form.permissions.includes(p.id));
                    return (
                      <div key={moduleLabel} style={{ marginBottom: 14 }}>
                        <div
                          onClick={() => toggleModuleGroup(moduleLabel, perms)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer', marginBottom: 8,
                          }}
                        >
                          <span style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                            textTransform: 'uppercase', color: goldDeep,
                          }}>{moduleLabel}</span>
                          <span style={{
                            fontSize: 10.5, color: allSelected ? goldDeep : '#A39C8A',
                            fontWeight: 600, textDecoration: 'underline',
                          }}>{allSelected ? 'Clear all' : 'Select all'}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                          {perms.map((p) => {
                            const active = form.permissions.includes(p.id);
                            return (
                              <div
                                key={p.id}
                                onClick={() => togglePermission(p.id)}
                                title={p.description}
                                style={{
                                  padding: '6px 13px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                                  cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
                                  background: active ? gold : '#FFFFFF',
                                  color: active ? '#26231D' : '#8A8270',
                                  border: active ? `1px solid ${gold}` : `1px solid ${line}`,
                                }}
                              >
                                {p.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </FormGroup>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', background: ink, color: '#FBF6E8', border: 'none',
                borderRadius: 12, padding: '14px', fontSize: 13.5, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', marginTop: 6, opacity: saving ? 0.6 : 1,
                letterSpacing: '0.02em',
              }}
            >
              {saving ? 'Saving…' : editingRole ? 'Save Changes' : 'Create Role'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RolesCom;