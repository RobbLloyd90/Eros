import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Fingerprint, LogOut, Trash2, ShieldCheck, ShieldAlert, EyeOff, Download, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import type { ThemeType, PrivacyMode } from '../types';
import { getLabelFontFamily, getContrastTextColor } from '../utils/themeUtils';

const AVAILABLE_THEMES: { id: ThemeType; label: string }[] = [
  { id: 'aero_g3', label: 'AERO GLASS G3' },
  { id: 'nothing_glow', label: 'NOTHING GLOW' },
  { id: 'nothing_os', label: 'NOTHING METRIC' },
  { id: 'bondi', label: 'BONDI G3 DARK' },
  { id: 'cybercore', label: 'CYBERCORE' },
  { id: 'softtech', label: 'SOFT INDUSTRIAL' }
];

export const SettingsView: React.FC = () => {
  const { theme, tStyle, isLight, handleThemeChange: onThemeSelect, privacySettings: privacy, setPrivacySettings: setPrivacy } = useAppState();
  const { currentUser, logout, deleteAccount, enrollBiometrics, removeBiometrics, exportUserData, importUserData } = useAuth();
  const [fidoStatus, setFidoStatus] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [backupStatus, setBackupStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const handleExport = async () => {
    const payload = exportUserData(currentUser.id);
    const json = JSON.stringify(payload, null, 2);
    const safeName = currentUser.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `eros-backup-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;

    // Android's WebView doesn't support <a download> blob saves like a real browser does,
    // so on-device we write to app cache and hand off to the native share sheet instead.
    if (Capacitor.isNativePlatform()) {
      try {
        const { uri } = await Filesystem.writeFile({
          path: filename,
          data: json,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });
        await Share.share({
          title: 'Eros Budget Backup',
          text: `Backup for ${currentUser.name}`,
          url: uri,
          dialogTitle: 'Save or share your backup file'
        });
      } catch {
        setBackupStatus('Export failed — could not save the backup file.');
        setTimeout(() => setBackupStatus(''), 6000);
      }
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const profile = importUserData(payload);
      setBackupStatus(`Restored "${profile.name}". Log out and sign back in to view the restored profile.`);
    } catch {
      setBackupStatus('Import failed: invalid or corrupted backup file.');
    }
    setTimeout(() => setBackupStatus(''), 6000);
  };

  const handleEnroll = async () => {
    setFidoStatus('Awaiting biometrics...');
    const success = await enrollBiometrics();
    setFidoStatus(success ? 'Biometrics registered successfully.' : 'Biometric enrollment failed.');
    setTimeout(() => setFidoStatus(''), 3000);
  };

  const boxStyle = {
    ...tStyle.bladeContainer({ color: tStyle.colors.secondary }),
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    backgroundColor: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'
  };
  
  const labelStyle = {
    fontSize: '10px',
    color: tStyle.colors.secondary,
    letterSpacing: '1px',
    fontWeight: 700,
    fontFamily: getLabelFontFamily(theme)
  };
  
  const buttonStyle = {
    backgroundColor: tStyle.colors.pos,
    color: getContrastTextColor(theme),
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: getLabelFontFamily(theme),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const selectStyle = {
    backgroundColor: tStyle.colors.metricBg,
    color: tStyle.colors.primary,
    border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)`,
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    outline: 'none',
    width: '100%',
    fontFamily: getLabelFontFamily(theme),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        padding: '0 16px 24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      {/* USER PROFILE DECK */}
      <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '8px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: getLabelFontFamily(theme) }}>
        USER PROFILE
      </div>
      <div style={boxStyle}>
        <div>
          <label style={labelStyle as any}>DESIGNATION</label>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: getLabelFontFamily(theme) }}>
            {currentUser.name.toUpperCase()}
          </div>
        </div>
        <div>
          <label style={labelStyle as any}>PROFILE ID</label>
          <div style={{ fontSize: '12px', color: tStyle.colors.secondary, fontFamily: 'monospace' }}>
            {currentUser.id}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={logout} style={{ ...buttonStyle, flex: 1, backgroundColor: tStyle.colors.metricBg, color: tStyle.colors.primary, border: `1px solid ${tStyle.colors.secondary}33` }}>
            <LogOut size={14} /> LOGOUT
          </button>

          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{ ...buttonStyle, flex: 1, backgroundColor: 'transparent', border: `1px dashed ${tStyle.colors.neg}`, color: tStyle.colors.neg }}>
              <Trash2 size={14} /> PURGE ACCOUNT
            </button>
          ) : (
            <button onClick={() => deleteAccount(currentUser.id)} style={{ ...buttonStyle, flex: 1, backgroundColor: tStyle.colors.neg, color: '#fff' }}>
              CONFIRM DELETION
            </button>
          )}
        </div>
        {confirmDelete && (
          <div style={{ fontSize: '9px', color: tStyle.colors.neg, textAlign: 'center', marginTop: '2px' }}>
            WARNING: THIS COMPLETELY DESTROYS DATA BINDINGS AND LOCAL STORAGE KEYS.
          </div>
        )}
      </div>

      {/* DATA BACKUP / RESTORE */}
      <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '16px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: getLabelFontFamily(theme) }}>
        DATA BACKUP
      </div>
      <div style={boxStyle}>
        <div style={{ fontSize: '10px', color: tStyle.colors.secondary, fontFamily: getLabelFontFamily(theme), lineHeight: 1.4 }}>
          Export a full backup of this profile (ledger, food, savings, debt, goals, theme) as a JSON file, or restore one from a previous backup.
        </div>
        <button onClick={handleExport} style={buttonStyle}>
          <Download size={14} /> EXPORT MY DATA
        </button>
        <button
          onClick={handleImportClick}
          style={{ ...buttonStyle, backgroundColor: tStyle.colors.metricBg, color: tStyle.colors.primary, border: `1px solid ${tStyle.colors.secondary}33` }}
        >
          <Upload size={14} /> IMPORT BACKUP FILE
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={handleImportFile} />
        {backupStatus && (
          <div style={{ fontSize: '10px', color: tStyle.colors.pos, textAlign: 'center', fontFamily: getLabelFontFamily(theme) }}>
            {backupStatus}
          </div>
        )}
      </div>

      {/* THEMES MANAGEMENT PLUG */}
      <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '16px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: getLabelFontFamily(theme) }}>
        VISUAL CORE THEME
      </div>
      <div style={boxStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {AVAILABLE_THEMES.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeSelect(t.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: isSelected ? `2px solid ${tStyle.colors.pos}` : `1px solid ${tStyle.colors.secondary}33`,
                  backgroundColor: isSelected ? `${tStyle.colors.pos}15` : tStyle.colors.metricBg,
                  color: isSelected ? tStyle.colors.pos : tStyle.colors.primary,
                  fontFamily: getLabelFontFamily(theme),
                  fontSize: '10px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* NEW: DASHBOARD PRIVACY PLUG */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '16px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: getLabelFontFamily(theme) }}>
        <EyeOff size={14} /> DASHBOARD PRIVACY
      </div>
      <div style={boxStyle}>
        <div>
          <label style={{ ...labelStyle as any, display: 'block', marginBottom: '6px' }}>SAVINGS METRIC VISIBILITY</label>
          <select style={selectStyle} value={privacy.savings} onChange={(e) => setPrivacy({...privacy, savings: e.target.value as PrivacyMode})}>
            <option value="on">Visible (Always On)</option>
            <option value="blurred">Blurred (Hold to Reveal)</option>
            <option value="off">Hidden (Completely Off)</option>
          </select>
        </div>

        <div>
          <label style={{ ...labelStyle as any, display: 'block', marginBottom: '6px' }}>CREDIT METRIC VISIBILITY</label>
          <select style={selectStyle} value={privacy.credit} onChange={(e) => setPrivacy({...privacy, credit: e.target.value as PrivacyMode})}>
            <option value="on">Visible (Always On)</option>
            <option value="blurred">Blurred (Hold to Reveal)</option>
            <option value="off">Hidden (Completely Off)</option>
          </select>
        </div>
      </div>

      {/* SECURE BIOMETRICS LINK */}
      <div style={{ fontSize: '11px', color: tStyle.colors.secondary, letterSpacing: '2px', fontWeight: 'bold', marginTop: '16px', borderBottom: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', fontFamily: getLabelFontFamily(theme) }}>
        SIGN-IN OPTIONS (FIDO2)
      </div>
      <div style={boxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          {currentUser.fidoCredential ? (
            <ShieldCheck size={24} color={tStyle.colors.pos} />
          ) : (
            <ShieldAlert size={24} color={tStyle.colors.secondary} />
          )}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: tStyle.colors.primary, fontFamily: getLabelFontFamily(theme) }}>
              BIOMETRIC AUTHENTICATION
            </div>
            <div style={{ fontSize: '10px', color: tStyle.colors.secondary, fontFamily: getLabelFontFamily(theme) }}>
              {currentUser.fidoCredential ? 'ACTIVE AND SECURED' : 'NOT CONFIGURED'}
            </div>
          </div>
        </div>

        {currentUser.fidoCredential ? (
          <button onClick={removeBiometrics} style={{ ...buttonStyle, backgroundColor: 'transparent', border: `1px dashed ${tStyle.colors.neg}`, color: tStyle.colors.neg }}>
            REMOVE BIOMETRICS
          </button>
        ) : (
          <button onClick={handleEnroll} style={buttonStyle}>
            <Fingerprint size={16} /> REGISTER DEVICE BIOMETRICS
          </button>
        )}
        {fidoStatus && (
          <div style={{ fontSize: '10px', color: tStyle.colors.pos, textAlign: 'center', marginTop: '4px', fontFamily: getLabelFontFamily(theme) }}>
            {fidoStatus}
          </div>
        )}
      </div>
    </motion.div>
  );
};