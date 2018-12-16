import { connection } from './connection';
import Mutation from './mutations';
import { getToken } from "../utils/AES";

const resolvers = {
  Organizer: {
    Statements({ id }){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM statement WHERE organizer_id = ?', [id], (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    },
    Voters({ id }){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM voter WHERE organizer_id = ?', [id], (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    }
  },
  Statement: {
    Choices({ id }){
      return new Promise((resolve, reject) => {
        const query = `
          SELECT choice.*, (SELECT COUNT(*) FROM vote WHERE vote.choice_id = choice.id) AS count
          FROM choice 
          WHERE statement_id = ?;
        `;
        connection.query(query, [id], (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    }
  },
  Vote: {
    Choice({ choice_id }){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM choice WHERE id = ?', [choice_id], (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        });
      });
    }
  },
  Choice: {
    Statement({ statement_id }){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM statement WHERE id = ?', [statement_id], (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        });
      });
    }
  },
  Statement: {
    Organizer({ organizer_id }){
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Organizer WHERE id = ?', [organizer_id], (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        });
      });
    }
  },
  Query: {
    organizer: () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * from organizer', (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        });
      });
    },
    votes: (root, { Authentication: { encryptedId, encryptedPassword, encryptedRandomString } }) => {
      return new Promise((resolve, reject) => {
        const token = getToken(encryptedId, encryptedPassword, encryptedRandomString);

        connection.query('SELECT id FROM voter_authentication WHERE token = ?', [token], (error, results) => {
          if (error) return reject(error);
          if(results.length === 0) return reject(new Error('invalid authentication'));
          const { id: voterAuthenticationId } = results[0];
          connection.query('SELECT * FROM vote WHERE voter_authentication_id = ?', [voterAuthenticationId], (error, results) => {
            if (error) return reject(error);
            if(results.length === 0) return reject(new Error('misconfiguration voter_authentication_id and vote'));
            resolve(results);
          });
        });
      });
    }
  },
  Mutation: Mutation.Mutation
}

module.exports = {
  resolvers
}