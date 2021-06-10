/*
 * Review schema and data accessor methods.
 */

const bcrypt = require('bcryptjs');
const { extractValidFields } = require('../lib/validation');
const mysqlPool = require('../lib/mysqlPool');

const UserSchema = {
  name: { required: true },
  id: { required: false },
  password: { required: true },
  followed_artists: { required: false },
  favSong: { required: false },
  favAlbumArt: { required: false },
  labelOwned: {required: false}
};
exports.UserSchema = UserSchema;
async function getusersPage(page) {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
    const count = await getuserCount();
    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;
  
    const [ results ] = await mysqlPool.query(
      'SELECT * FROM user ORDER BY id LIMIT ?,?',
      [ offset, pageSize ]
    );
  
    return {
      users: results,
      page: page,
      totalPages: lastPage,
      pageSize: pageSize,
      count: count
    };
  }
  exports.getusersPage = getusersPage;

async function getuserCount() {
    const [ results ] = await mysqlPool.query(
        'SELECT COUNT(*) AS count FROM user'
      );
      return results[0].count;
}
async function getusersAll() {
  return users;
}
exports.getusersAll = getusersAll;

async function insertNewuser(user) {
    users = extractValidFields(user, UserSchema);
    const [ result ] = await mysqlPool.query(
      'INSERT INTO user SET ?',
      users
    );
  
    return result.insertId;
}
exports.insertNewuser = insertNewuser;


async function getuserById(id) {
    const [ results ] = await mysqlPool.query(
        'SELECT * FROM user WHERE id = ?',
        [ id ]
      );
      return results[0];
}
exports.getuserById = getuserById;


async function replaceuserById(id, user) {
    users = extractValidFields(user, UserSchema);
    const [ result ] = await mysqlPool.query(
      'UPDATE user SET ? WHERE id = ?',
      [ users, id ]
    );
    return result.affectedRows > 0;
  }
exports.replaceuserById = replaceuserById;

async function deleteuserById(id) {
    const [ result ] = await mysqlPool.query(
        'DELETE FROM user WHERE id = ?',
        [ id ]
      );
      return result.affectedRows > 0;
    }
exports.deleteuserById = deleteuserById;



  async function validateUser(id, password) {
    const user = await getuserById(id);
    return user && !(password.localeCompare(user.password));
  }
  exports.validateUser = validateUser;

async function addSongToFavorites(id, songID){
  var favSong = {"id":`/songs/${songID}`};
  users[id].favSong.push(favSong);
  console.log(users[id].favSong)
  return favSong;
}
exports.addSongToFavorites = addSongToFavorites;

async function addFollowedArtist(id, artistID){
  var followedArtist = {"id":`/artists/${artistID}`};
  users[id].followed_artists.push(followedArtist);
  console.log(users[id].followedArtist)
  return followedArtist;
}
exports.addFollowedArtist = addFollowedArtist;

async function addAlbumArt(id, albumID){
  var favAlbumArt = {"id":`/artists/${albumID}`};
  users[id].favAlbumArt.push(favAlbumArt);
  console.log(users[id].favAlbumArt)
  return favAlbumArt;
}
exports.addAlbumArt = addAlbumArt;

async function removeFollowedArtist(id, artistID){
  var i = 0;
  for(i = 0; i < users[id].followed_artists.length - 1; i++){
    var followedArtist = {"id":`/artists/${artistID}`};
    if(users[id].followed_artists[i] == followedArtist){
      users[id].followed_artists[i] = null;
      return users[id].followedArtist;
    }
  }
  return null;
}
exports.removeFollowedArtist = removeFollowedArtist;

async function removeSongFromFavorites(id, songID){
  var i = 0;
  for(i = 0; i < users[id].favSong.length - 1; i++){
    var favSong = {"id":`/songs/${songID}`};
    if(users[id].favSong[i] == favSong){
      users[id].favSong[i] = null;
      return users[id].favSong;
    }
  }
  return null;
}
exports.removeSongFromFavorites = removeSongFromFavorites;

async function removeAlbumArt(id, albumID){
  var i = 0;
  for(i = 0; i < users[id].favAlbumArt.length - 1; i++){
    var favSong = {"id":`/songs/${albumID}`};
    if(users[id].favAlbumArt[i] == favSong){
      users[id].favAlbumArt[i] = null;
      return users[id].favAlbumArt;
    }
  }
  return null;
}
exports.removeAlbumArt = removeAlbumArt;
