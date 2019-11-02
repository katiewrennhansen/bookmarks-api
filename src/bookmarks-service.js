const BookmarksService = {
    getAllBookmarks(knex){
        return knex.select('*').from('bookmark_data')
    }


}


module.exports = BookmarksService