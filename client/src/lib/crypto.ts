export class CryptoService {
  private static instance: CryptoService;
  private keyCache: Map<string, CryptoKey> = new Map();

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      publicKey: this.arrayBufferToBase64(publicKey),
      privateKey: this.arrayBufferToBase64(privateKey),
    };
  }

  async generateAESKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encryptMessage(message: string, method: "AES-256-GCM" | "RSA-2048" = "AES-256-GCM"): Promise<{
    encryptedData: string;
    key?: string;
    iv?: string;
  }> {
    if (method === "AES-256-GCM") {
      const key = await this.generateAESKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        new TextEncoder().encode(message)
      );

      const exportedKey = await crypto.subtle.exportKey("raw", key);
      
      return {
        encryptedData: this.arrayBufferToBase64(encrypted),
        key: this.arrayBufferToBase64(exportedKey),
        iv: this.arrayBufferToBase64(iv),
      };
    } else {
      // RSA encryption - simplified for demo
      const keyPair = await this.generateKeyPair();
      const publicKey = await this.importPublicKey(keyPair.publicKey);
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        new TextEncoder().encode(message)
      );

      return {
        encryptedData: this.arrayBufferToBase64(encrypted),
        key: keyPair.privateKey,
      };
    }
  }

  async decryptMessage(
    encryptedData: string,
    key: string,
    iv?: string,
    method: "AES-256-GCM" | "RSA-2048" = "AES-256-GCM"
  ): Promise<string> {
    if (method === "AES-256-GCM") {
      if (!iv) throw new Error("IV is required for AES decryption");
      
      const importedKey = await crypto.subtle.importKey(
        "raw",
        this.base64ToArrayBuffer(key),
        "AES-GCM",
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: this.base64ToArrayBuffer(iv),
        },
        importedKey,
        this.base64ToArrayBuffer(encryptedData)
      );

      return new TextDecoder().decode(decrypted);
    } else {
      const privateKey = await this.importPrivateKey(key);
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        this.base64ToArrayBuffer(encryptedData)
      );

      return new TextDecoder().decode(decrypted);
    }
  }

  async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    return this.arrayBufferToHex(hashBuffer);
  }

  private async importPublicKey(keyData: string): Promise<CryptoKey> {
    const cacheKey = `pub-${keyData}`;
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const key = await crypto.subtle.importKey(
      "spki",
      this.base64ToArrayBuffer(keyData),
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"]
    );

    this.keyCache.set(cacheKey, key);
    return key;
  }

  private async importPrivateKey(keyData: string): Promise<CryptoKey> {
    const cacheKey = `priv-${keyData}`;
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const key = await crypto.subtle.importKey(
      "pkcs8",
      this.base64ToArrayBuffer(keyData),
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["decrypt"]
    );

    this.keyCache.set(cacheKey, key);
    return key;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateAddress(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(20));
    return "0x" + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export const cryptoService = CryptoService.getInstance();
