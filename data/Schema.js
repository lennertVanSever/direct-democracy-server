import { gql } from 'apollo-server-express';


const typeDefs = gql`
  type Organizer {
    name: String
    Statements: [Statement]
    Voters: [Voter]
  }
  type Statement {
    statement: String
    Choices: [Choice]
    Organizer: Organizer
  }
  type Choice { 
    choice: String
    count: Int
    Statement: Statement
  }
  type Voter {
    email: String
  }
  type Vote {
    Choice: Choice
  }
  type Query {
    organizer(id: String): Organizer
    votes(Authentication: inputAuthentication!): [Vote]
  }
  input inputAuthentication {
    encryptedId: String!
    encryptedPassword: String!
    encryptedRandomString: String!
  }
  input inputVoterRegistration {
    Authentication: inputAuthentication!
    encryptedOrganizerId: String!
  }
  input inputVoteCast {
    Authentication: inputAuthentication!
    encryptedChoiceID: String!
  }
  type Mutation {
    registerVoter(VoterRegistration: inputVoterRegistration!): Voter
    castVote(VoteCast: inputVoteCast!): Vote
  }
`;

module.exports = {
  typeDefs
}
