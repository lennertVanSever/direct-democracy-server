import { encrypt } from "./utils/AES";


const encryptKey = 'kZ5fusLDbq4vb5fk';

const organizationId = '796e5c77-8ec9-4d68-83dc-f020afac006c';
// console.log(encrypt(organizationId, encryptKey));

const choiced = '4735bd45-e04d-4cf9-a11f-2afc91eb4b96';
console.log(encrypt(choiced, encryptKey))

const password = 'password123';

const randomString = 'qwB0T5HR';

const id = 'af2321a2-72b8-483d-ba6d-ecf27ca749bd';

console.log(encrypt(id, encryptKey), encrypt(password, encryptKey), encrypt(randomString, encryptKey));

