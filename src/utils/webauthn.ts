// Helper to convert strings to standard ArrayBuffers for WebAuthn
const bufferEncode = (value: string) => new TextEncoder().encode(value);
const bufferDecode = (value: ArrayBuffer) => new TextDecoder().decode(value);

// Helper to convert ArrayBuffer to Base64 for storing in localStorage
const bufferToBase64 = (buffer: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

export const WebAuthnAPI = {
  // 1. Registers a new Biometric Credential (FaceID/TouchID)
  register: async (userId: string, userName: string) => {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometrics not supported on this device/browser.');
    }

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: crypto.getRandomValues(new Uint8Array(32)), // Random challenge
      rp: { name: 'OS Finance Core', id: window.location.hostname },
      user: {
        id: bufferEncode(userId),
        name: userName,
        displayName: userName
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Forces use of device built-in biometrics
        userVerification: 'required'
      },
      timeout: 60000
    };

    try {
      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      })) as PublicKeyCredential;

      // In a real app, we send this to a server. Here, we format it for LocalStorage.
      return {
        id: credential.id,
        rawId: bufferToBase64(credential.rawId),
        publicKey: 'simulated-local-key' // Real parsing requires complex CBOR logic
      };
    } catch (err) {
      console.error('FIDO Registration failed:', err);
      throw err;
    }
  },

  // 2. Authenticates a user using their saved biometric credential
  authenticate: async (credentialId: string) => {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometrics not supported.');
    }

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
          type: 'public-key'
        }
      ],
      userVerification: 'required',
      timeout: 60000
    };

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });
      return !!assertion; // If it doesn't throw, biometrics succeeded
    } catch (err) {
      console.error('FIDO Auth failed:', err);
      return false;
    }
  }
};
