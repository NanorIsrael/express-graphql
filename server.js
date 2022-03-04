const express = require('express');
const app = express();

const {graphqlHTTP} = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const authors = [
    {id: 1, name: 'J. R. R. Tolkien'},
    {id: 2, name: 'Brent Weeks'},
    {id: 3, name: 'Dominic Acquah'}
]

const books = [
    {id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1},
    {id: 2, name: 'Harry Potter and the Deadly Hallows', authorId: 1},
    {id: 3, name: 'Harry Potter and the Goblets of Fire', authorId: 1},
    {id: 4, name: 'Harry Potter and the Prisoner of Askaban', authorId: 2},
    {id: 5, name: 'The fellowship of the ring', authorId: 2},
    {id: 6, name: 'The return of the king', authorId: 2},
    {id: 7, name: 'The two towers', authorId: 3},
    {id: 8, name: 'The way of shadows', authorId: 3},
    {id: 9, name: 'Beyond the shadows', authorId: 3},
]

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents a book written by an author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => authors.find(author => author.id === book.authorId)
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This is an author who wrote a book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => books.filter(book => book.authorId === author.id)
        }
    })
})

const rootQuery =  new GraphQLObjectType({
    name: "Query",
    description: "root query",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        }
    })
})

const schema = new GraphQLSchema({
    query:rootQuery
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql:true,
}))

app.listen(5000, () => console.log('server running'));