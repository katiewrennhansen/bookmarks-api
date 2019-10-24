require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarks = require('./store')
const logger = require('./logger')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet())
app.use(cors())

app.use(function authenticate(req, res, next){
    const apiToken = process.env.API_KEY
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
        res.status(401).json({ error: 'Unauthorized request'})
    }
    next()
})


app.get('/', (req, res) => {
    res.send('Hello, bookmarks API!')
})

app.get('/bookmarks', (req, res) => {
    res.send(bookmarks)
})

app.get('/bookmarks/:id', (req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(mark => mark.id == id)

    if(!bookmark){
        logger.error(`Bookmark with id ${id} not found`)
        res.status(404).send('Not found')
    }

    res.send(bookmark)
})








app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app
