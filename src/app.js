require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

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

app.use(bookmarksRouter);


app.get('/', (req, res) => {
    res.send('Welcome to the bookmarks API. Please make a request to the /bookmark endpoint to gather data')
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
