const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Articles Endpoints', () => {


    describe('GET /bookmarks with data', () => {
        context('given there are bookmarks in the db', () => {
            it('GET /bookmarks returns all articles in the db', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, )
            })
        })
    })





})