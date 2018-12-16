import { ApolloServer } from 'apollo-server';

import { resolvers } from './data/resolvers';
import { typeDefs } from './data/Schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'light',
      'editor.cursorShape': 'line'
    },
  }
});


const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
  console.log(`🚀  ${url}`);
});



/*
import { encrypt, decrypt } from './utils/AES';
import { randomBytes } from 'crypto';

let randomString = randomBytes(6).toString('base64');
const password = 'password123';

randomString = 'qwB0T5HR';

const encryptedRandomStringPassword = encrypt(randomString, password);

const voterId = "6";

const token = encrypt(encryptedRandomStringPassword, voterId);

console.log(token);

console.log(decrypt(decrypt(token, voterId), password));
*/