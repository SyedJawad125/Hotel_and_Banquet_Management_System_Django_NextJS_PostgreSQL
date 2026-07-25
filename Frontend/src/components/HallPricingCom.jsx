'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, DollarSign, Calendar,
  ChevronLeft, ChevronRight, Clock, MapPin,
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
    .hp-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .hp-header { flex-direction: column !important; align-items: flex-start !important; }
    .hp-title { font-size: 28px !important; }
    .hp-header-actions { width: 100% !important; }
    .hp-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .hp-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .hp-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .hp-table thead { display: none !important; }
    .hp-table, .hp-table tbody, .hp-table tr, .hp-table td {
      display: block !important; width: 100% !important;
    }
    .hp-table { min-width: 0 !important; }
    .hp-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .hp-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .hp-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .hp-table td.hp-empty-label { justify-content: flex-end !important; }
    .hp-table td.hp-empty-label::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .hp-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

const TimeSlotPill = ({ slot }) => {
  const config = {
    morning: { bg: '#EAF4EA', color: '#3D7A45', border: 'rgba(61,122,69,0.18)' },
    afternoon: { bg: '#FEF7E6', color: '#B8860B', border: 'rgba(184,134,11,0.18)' },
    night: { bg: '#F0F4FF', color: '#3B82F6', border: 'rgba(59,130,246,0.18)' },
  };
  const c = config[slot?.toLowerCase()] || config.morning;
  
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      }}
    >
      <Clock size={12} />
      {slot || 'Morning'}
    </span>
  );
};

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

const HallPricingCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [halls, setHalls] = useState([]);

  const emptyForm = {
    hall: '', time_slot: 'morning', base_price: '', valid_from: '', valid_until: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPricing();
    fetchHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/hall/pricing/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      let list;
      let total;

      // Handle response structure: data can be array or single object
      if (Array.isArray(payload?.data)) {
        list = payload.data;
        total = payload.count;
      } else if (typeof payload?.data === 'object' && payload?.data !== null) {
        // Single object response
        list = [payload.data];
        total = payload.count || 1;
      } else if (Array.isArray(payload?.data?.data)) {
        list = payload.data.data;
        total = payload.data.count;
      } else {
        list = [];
        total = 0;
      }

      setRecords(list);
      setCount(total);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching pricing');
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/hall/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setHalls(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((p) => {
      const idMatch = p.id?.toString() === q;
      const hallMatch = (p.hall_name_en || p.hall?.name_en)?.toLowerCase().includes(q);
      const slotMatch = p.time_slot?.toLowerCase().includes(q);
      const priceMatch = p.base_price?.toString().includes(q);
      return idMatch || hallMatch || slotMatch || priceMatch;
    });
  }, [records, searchTerm]);

  const totalPricing = count;
  const avgPrice = records.length > 0 
    ? records.reduce((sum, p) => sum + Number(p.base_price || 0), 0) / records.length 
    : 0;
  const morningCount = records.filter((p) => p.time_slot === 'morning').length;
  const afternoonCount = records.filter((p) => p.time_slot === 'afternoon').length;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingPricing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (pricing) => {
    setEditingPricing(pricing);
    setForm({
      hall: pricing.hall || '',
      time_slot: pricing.time_slot || 'morning',
      base_price: pricing.base_price || '',
      valid_from: pricing.valid_from || '',
      valid_until: pricing.valid_until || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const savePricing = async (e) => {
    e.preventDefault();
    if (!form.hall || !form.base_price || !form.valid_from) {
      toast.error('Hall, base price, and valid from date are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        hall: form.hall,
        time_slot: form.time_slot,
        base_price: form.base_price,
        valid_from: form.valid_from,
        valid_until: form.valid_until || null,
      };

      if (editingPricing) {
        await AxiosInstance.patch(`/api/hotel/v1/hall/pricing/?id=${editingPricing.id}`, payload);
        toast.success('Pricing updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/hall/pricing/', payload);
        toast.success('Pricing created successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchPricing();
    } catch (error) {
      console.error('Error saving pricing:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving pricing';
      toast.error(typeof msg === 'string' ? msg : 'Error saving pricing');
    } finally {
      setSaving(false);
    }
  };

  const deletePricing = async (pricing) => {
    if (!window.confirm(`Remove this pricing rule? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/hall/pricing/?id=${pricing.id}`);
      if (res) {
        toast.success('Pricing deleted successfully');
        setCurrentPage(1);
        fetchPricing();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting pricing');
    }
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="hp-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="hp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Pricing Management
            </div>
            <h1 className="hp-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Hall Pricing
            </h1>
          </div>

          <div className="hp-header-actions" style={{ display: 'flex' }}>
            {permissions.create_hall_pricing && (
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
              New Pricing
            </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="hp-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Rules', value: totalPricing, icon: DollarSign },
            { label: 'Avg Price', value: `SAR ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: MapPin, accent: goldDeep },
            { label: 'Morning Slots', value: morningCount, icon: Clock, accent: '#3D7A45' },
            { label: 'Afternoon Slots', value: afternoonCount, icon: Clock, accent: '#B8860B' },
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
              placeholder="Search by hall, time slot, or price…"
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
              borderRadius: '50%', animation: 'cc-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading pricing…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="hp-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="hp-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Hall ID', 'Hall', 'Time Slot', 'Base Price', 'Valid From', 'Valid Until', 'Created By', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 8 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((p, idx) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{p.id}
                      </td>
                      <td data-label="Hall ID" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {p.hall || '—'}
                      </td>
                      <td data-label="Hall" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        {p.hall_name_en || p.hall?.name_en || '—'}
                      </td>
                      <td data-label="Time Slot" style={{ padding: '14px 18px' }}>
                        <TimeSlotPill slot={p.time_slot_display || p.time_slot} />
                      </td>
                      <td data-label="Base Price" style={{ padding: '14px 18px', fontSize: 13.5, color: goldDeep, fontWeight: 600 }}>
                        SAR {Number(p.base_price || 0).toLocaleString()}
                      </td>
                      <td data-label="Valid From" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {p.valid_from || '—'}
                      </td>
                      <td data-label="Valid Until" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {p.valid_until || '—'}
                      </td>
                      <td data-label="Created By" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {p.created_by_name || '—'}
                      </td>
                      <td data-label="" className="hp-empty-label" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {permissions.update_hall_pricing && (
                            <button
                              onClick={() => openEdit(p)}
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
                          {permissions.delete_hall_pricing && (
                            <button
                              onClick={() => deletePricing(p)}
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
              <div className="hp-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} pricing rule{count !== 1 ? 's' : ''}
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
              <DollarSign size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No pricing rules found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first pricing rule to get started'}
            </p>
            {permissions.create_hall_pricing && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                New Pricing
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingPricing ? 'Update Pricing' : 'New Pricing'}
          subtitle={editingPricing ? `Editing pricing for ${editingPricing.hall?.name_en}` : 'Add a new pricing rule'}
          onClose={closeModal}
        >
          <form onSubmit={savePricing}>
            <FormGroup label="Hall" required>
              <select
                style={inputStyle}
                value={form.hall}
                onChange={(e) => setForm({ ...form, hall: e.target.value })}
              >
                <option value="">Select Hall</option>
                {halls.map((h) => (
                  <option key={h.id} value={h.id}>{h.name_en}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Time Slot" required>
              <select
                style={inputStyle}
                value={form.time_slot}
                onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
              >
                <option value="morning">Morning Shift</option>
                <option value="afternoon">Afternoon Shift</option>
                <option value="night">Night Shift</option>
              </select>
            </FormGroup>

            <FormGroup label="Base Price (SAR)" required>
              <TextField
                type="number"
                min="0"
                step="0.01"
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                placeholder="0.00"
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Valid From" required>
                <TextField
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Valid Until" hint="Leave blank for no end date">
                <TextField
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                />
              </FormGroup>
            </div>

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
              {saving ? 'Saving…' : editingPricing ? 'Save Changes' : 'Create Pricing'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HallPricingCom;
