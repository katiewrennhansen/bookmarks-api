const express = require('express')
const logger = require('../logger')
const { bookmarks } = require('../store')
const uuid = require('uuid/v4')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const BookmarksService = require('../bookmarks-service')



bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(mark => {
                res.json(mark)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body
        
        if(!title){
            logger.error('Title required')
            res.status(400).send('Not complete')
        }
        if(!url){
            logger.error('url required')
            res.status(400).send('Not complete')
        }
        if(!description){
            logger.error('description required')
            res.status(400).send('Not complete')
        }
        if(!rating){
            logger.error('rating required')
            res.status(400).send('Not complete')
        }
        const id = uuid()
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarks.push(bookmark)

        res.status(201).json({id})
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const { id } = req.params
        BookmarksService.getBookmarkById(knexInstance, id)
            .then(mark => {
                if(!mark){
                    logger.error(`Bookmark with id ${id} not found`)
                    res.status(404).json({
                        error: { message: 'Not found' }
                    })
                }
                res.json(mark)
            })
            .catch(next)
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(mark => mark.id == id)
    
        if(bookmarkIndex === -1){
            logger.error(`Bookmark with the id ${id} not found`)
            res.status(404).send('not found')
        }
        bookmarks.splice(bookmarkIndex, 1)
    
        logger.info('Bookmark deleted')
        res.status(204).end()
    })


module.exports = bookmarksRouter;