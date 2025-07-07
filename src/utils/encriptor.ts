import * as lzEncrypt from 'lz-string'
import { encode, decode } from 'js-base64';

export const encodeBase64 = (data: string) => {
  return encode(data)
}

/**Returns the base64 value of an string */
export const decodeBase64 = (data: string) => {
  return decode(data)
}

/**Returns an encrypted string with LZ*/
export const encryptLZ = (data: string) => {
  const base64String = encode(data);
  return lzEncrypt.compressToEncodedURIComponent(base64String);
}

/**Returns an encrypted string with LZ*/
export const decryptLZ = (data: string) => {
  const base64String = lzEncrypt.decompressFromEncodedURIComponent(data);
  return decode(base64String)
}