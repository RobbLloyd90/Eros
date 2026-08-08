import React, { useState } from 'react';
import { Fingerprint, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalStyles } from './GlobalStyles';

export const LockScreen: React.FC = () => {
  const { users, usersLoaded, loginWithPin, loginWithBiometrics, registerUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  // null = not yet manually toggled; falls back to "no saved users" once loaded.
  // Avoids flashing the create-user screen for existing users while storage is still loading.
  const [manualIsCreating, setManualIsCreating] = useState<boolean | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const userList = Object.values(users);
  const isCreating = manualIsCreating ?? userList.length === 0;

  const handlePinSubmit = () => {
    if (!selectedUser) return;
    const success = loginWithPin(selectedUser, pin);
    if (!success) setError('Invalid PIN');
  };

  const handleCreate = () => {
    if (newName.length < 2 || pin.length < 4) {
      setError('Name > 2 chars, PIN >= 4 digits.');
      return;
    }
    // Fixed initialization assignment logic to default to aero_g3
    registerUser(newName, pin, 'aero_g3');
    setNewName('');
    setPin('');
    setError('');
    // Return to the sign-in list so the new profile must be explicitly signed into, not auto-logged in.
    setManualIsCreating(false);
  };

  if (!usersLoaded) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#060706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#060706',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Quicksand', sans-serif",
        color: '#fff'
      }}
    >
      <GlobalStyles />
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            letterSpacing: '2px',
            marginBottom: '12px',
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 800
          }}
        >
          AERO_G3 SYSTEM CORE
        </h1>

        {isCreating ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h2 style={{ fontSize: '14px', textAlign: 'center', fontWeight: 700 }}>INITIALIZE NEW USER</h2>
            <input
              placeholder="USER DESIGNATION"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
            <input
              placeholder="ACCESS PIN (4+ DIGITS)"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
            {error && <div style={{ color: '#f43f5e', fontSize: '11px', textAlign: 'center' }}>{error}</div>}
            <button
              onClick={handleCreate}
              style={{
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                marginTop: '8px'
              }}
            >
              CREATE & ENTER
            </button>
            {userList.length > 0 && (
              <button
                onClick={() => setManualIsCreating(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                  opacity: 0.7
                }}
              >
                CANCEL
              </button>
            )}
          </div>
        ) : !selectedUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '14px', textAlign: 'center', color: '#aaa' }}>SELECT PROFILE</h2>
            {userList.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u.id)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {u.name.toUpperCase()}
                <ArrowRight size={16} />
              </button>
            ))}
            <button
              onClick={() => setManualIsCreating(true)}
              style={{
                backgroundColor: 'transparent',
                border: '1px dashed rgba(255, 255, 255, 0.3)',
                color: '#fff',
                padding: '16px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'inherit',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                opacity: 0.8
              }}
            >
              <UserPlus size={16} /> ADD SECURE USER
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h2 style={{ fontSize: '14px', textAlign: 'center', fontWeight: 700 }}>
              AUTH: {users[selectedUser].name.toUpperCase()}
            </h2>
            <input
              autoFocus
              placeholder="ENTER PIN"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '4px',
                fontSize: '18px'
              }}
            />
            {error && <div style={{ color: '#f43f5e', fontSize: '11px', textAlign: 'center' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={handlePinSubmit}
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'inherit'
                }}
              >
                UNLOCK
              </button>
              {users[selectedUser].fidoCredential && (
                <button
                  onClick={() => loginWithBiometrics(selectedUser)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Fingerprint size={20} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setPin('');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'inherit',
                textDecoration: 'underline',
                marginTop: '8px',
                opacity: 0.7
              }}
            >
              SWITCH USER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
