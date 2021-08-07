import CryptoJS from 'react-native-crypto-js';
import base64 from 'react-native-base64';

const EncryptionHelper = {
    encrypt: function(toEncrypt) {
        let encrypted = CryptoJS.AES.encrypt(toEncrypt, "sp@18~~");
        return base64.encode(encrypted);
    },
    decrypt: function(toDecrypt) {
        let decoded = base64.decode(toDecrypt);
        return CryptoJS.AES.decrypt(decoded, "sp@2018~~");
    }
}

export default EncryptionHelper;