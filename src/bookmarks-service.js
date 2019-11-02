const BookmarksService = {
    getAllBookmarks(knex){
        return knex
            .select('*')
            .from('bookmark_data')
    },
    getBookmarkById(knex, id){
        return knex
            .from('bookmark_data')
            .select('*')
            .where('id', id)
            .first()
    }


}


module.exports = BookmarksService