const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
// const dotenv = require("dotenv");

// if(process.env.NODE_ENV !== 'production'){
// dotenv.config();
// }
const q = faunadb.query

var client = new faunadb.Client({
  secret: process.env.FAUNA,
})

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    title: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(title: String): Todo
    deleteTodo(id: String): String
    updateTodo(id: String, done: Boolean): String
  }
`

const resolvers = {
  Query: {
    todos: async (parent, args) => {
      const results = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("get_todos"))),
          q.Lambda(x => q.Get(x))
        )
      )
      return results.data.map(todo => ({
        id: todo.ref.id,
        title: todo.data.title,
        done: todo.data.done,
      }))
    },
  },
  Mutation: {
    addTodo: async (_, { title }) => {
      const results = await client.query(
        q.Create(q.Collection("todos"), {
          data: {
            title,
            done: false,
          },
        })
      )
      return {
        ...results.data,
        id: results.data.ts,
      }
    },
    deleteTodo: async (_, { id }) => {
      const results = await client.query(
        q.Delete(q.Ref(q.Collection("todos"), `${id}`))
      )
      return results.ref.id
    },
    updateTodo: async (_, { id, done }) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todos"), `${id}`), {
          data: {
            done: !done,
          },
        })
      )
      return results.ref.id
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
