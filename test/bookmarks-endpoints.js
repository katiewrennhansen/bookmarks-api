const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    before('clean the table', () => db('bookmark_data').truncate())
    
    after('disconnect from db', () => db.destroy)

    afterEach('cleanup', () => db('bookmark_data').truncate())

    describe('GET /bookmarks with data', () => {
        context('given there is no data in the db', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200, [])
            })
        })

        context('given there are bookmarks in the db', () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert test bookmarks', () => {
                return db 
                    .into('bookmark_data')
                    .insert(testBookmarks)
            })

            it('GET /bookmarks returns all articles in the db', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200, testBookmarks)
            })
        })
    })

    describe('GET /bookmarks/:bookmark_id with bookmarks in the db', () => {
        context('give there is no data in the db', () => {
            it('responds with 404', () => {
                const bookmarkId = 1234
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(404, { error: { message: 'Not found'}})
            })
        })

        context('given there are bookmarks in the db', () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert test bookmarks', () => {
                return db 
                    .into('bookmark_data')
                    .insert(testBookmarks)
            })

            it('GET /bookmarks returns all articles in the db', () => {
                const bookmarkId = 2
                const expectedBookmark = testBookmarks[bookmarkId - 1]
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200, expectedBookmark)
            })
        })
    })





})