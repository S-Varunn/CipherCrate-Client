import CryptoJS from "crypto-js";
import { cipher } from "../../initVar";

export function aesCbc256(message) {
  const data = message;
  const iv = cipher.iv;
  const key = cipher.key;

  const fkey = CryptoJS.enc.Utf8.parse(key);
  const fiv = CryptoJS.enc.Utf8.parse(iv);

  const enc = CryptoJS.AES.encrypt(data, fkey, {
    iv: fiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return enc.ciphertext.toString(CryptoJS.enc.Base64);
}
