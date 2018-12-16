import { connection } from './connection';
import { decrypt, getToken } from "../utils/AES";

export default {
    Mutation: {
        registerVoter(root, { VoterRegistration: { Authentication: { encryptedId, encryptedPassword, encryptedRandomString }, encryptedOrganizerId } }) {
            return new Promise((resolve, reject) => {
                const token = getToken(encryptedId, encryptedPassword, encryptedRandomString);
                const organizerId = decrypt(encryptedOrganizerId, encryptKey);
                const query = `
                    INSERT INTO voter_authentication SET ?
                `;
                const values = {token, organizer_id: organizerId};

                connection.query(query, values, (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });
        },
        castVote(root, { VoteCast: { Authentication: { encryptedId, encryptedPassword, encryptedRandomString }, encryptedChoiceID } }) {
            return new Promise((resolve, reject) => {
                const token = getToken(encryptedId, encryptedPassword, encryptedRandomString);
                const choiceId = decrypt(encryptedChoiceID, encryptKey);

                connection.query('SELECT id FROM voter_authentication WHERE token = ?', [token], (error, results) => {
                    if (error) return reject(error);
                    if(results.length === 0) return reject(new Error('invalid authentication'));
                    const { id: voterAuthenticationId } = results[0];


                    connection.query('SELECT statement_id FROM choice WHERE id = ?', [choiceId], (error, results) => {
                        if (error) return reject(error);
                        if(results.length === 0) return reject(new Error('statement not found'));
                        const { statement_id } = results[0];
                        const query = `
                            INSERT INTO vote SET ?
                        `;
                        const values = {voter_authentication_id: voterAuthenticationId, choice_id: choiceId, statement_id};
                        connection.query(query, values, (error, results) => {
                            if (error) reject(error);
                            resolve(results);
                        });
                    });
                });
            });
        },
    }
}
