import crypto from 'crypto';
const algorithm = 'aes-256-ctr';
const encryptKey = 'kZ5fusLDbq4vb5fk';

export const encrypt = (text, password) => {
    const cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

export const decrypt = (text, password) => {
    const decipher = crypto.createDecipher(algorithm, password)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const getToken = (encryptedId, encryptedPassword, encryptedRandomString) => {
    const id = decrypt(encryptedId, encryptKey);
    const password = decrypt(encryptedPassword, encryptKey);
    const randomString = decrypt(encryptedRandomString, encryptKey);

    const encryptedIdPassword = encrypt(id, password);
    let token = encrypt(encryptedIdPassword, randomString);
    token = crypto.createHash('sha256').update(token).digest('base64');
    return token;
}
