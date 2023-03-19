import CryptoJS from "crypto-js";
import { cipher } from "../../initVar";

export function aesCbc256(message) {
  const data = message;
  const iv = CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex);
  console.log(iv);
  const key = cipher.key;

  const fkey = CryptoJS.enc.Utf8.parse(key);
  const fiv = CryptoJS.enc.Utf8.parse(iv);

  const enc = CryptoJS.AES.encrypt(data, fkey, {
    iv: fiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return hideIV(iv, enc.ciphertext.toString(CryptoJS.enc.Base64));
  // return enc.ciphertext.toString(CryptoJS.enc.Base64);
}

function deCipher(message) {}

function hideIV(iv, cipherText) {
  let ivArr = iv.split("");
  let cipherTextArr = cipherText.split("");
  for (let i = 0; i < ivArr.length; i++) {
    cipherTextArr.splice(i + 1, 0, ivArr[i]);
  }
  console.log(cipherTextArr.join(""));
  return cipherTextArr.join("");
}
