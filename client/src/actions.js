import store from './store.js';
import randomInt from 'random-int';
import axios from 'axios';
import { range } from 'lodash';

///////////////////
// BOARD ACTIONS //
///////////////////

/**
 * Dispatches a createBoard action to the state via boardReducer
 * No params necessary.
 * Invoke to create a new board state from scratch. 
 */
export const createBoard = () => {
  store.dispatch({ type: 'createBoard' });
  store.dispatch({ type: 'infoInit' });
};

export const setBoard = (board) => {
  store.dispatch({ type: 'setBoard', payload: { board }});
};

/**
 * Performs a 'guess' action on a single tile. Depending on whether or not there is
 * bread on that tile, different actions will occur.
 * @param {string} player either 'p1' or 'p2'. Represents TARGET player's board.
 * @param {string} id the ID of the guessed tile, ex: '1,1' or '4,3'
 */
export const guess = (player, id) => {
  store.dispatch({
    type: 'guess', 
    payload: { player, id },
  });
  store.dispatch({ type: 'toggleTurn' });
};

/**
 * Sets a single piece, which is represented by an array of its coordinates
 * @param {string} player either 'p1' or 'p2'
 * @param {array} piece an array of tile ID strings, ex: ['1,1','4,3']
 */
export const setPiece = (player, piece) => {
  store.dispatch({
    type: 'setPiece',
    payload: { player, piece },
  });
  store.dispatch({
    type: 'updatePieces',
    payload: { player, pieces: piece.length },
  });
};

/**
 * Sets a 2x1, 3x1, 4x1, and 5x1 piece on one player's board. TODO - prevent overlaps.
 * @param {string} player  either 'p1' or 'p2'
 */
export const setRandomPieces = (player) => {
  const pieces = range(2, 6)
    .map((len) => {
      const rotate = randomInt(0, 1);
      const scalar = randomInt(0, 7);
      return range(0, len).map((el, j) => (rotate) ? [scalar, j] : [j, scalar]);
    })
    .forEach(piece => setPiece(player, piece));
};

/**
 * OLD/FOR TESTING ONLY: randomly selects 14 tiles to have bread
 */
export const randomPieces = () => store.dispatch({ type: 'randomPieces' });

//////////////////
// CHAT ACTIONS //
//////////////////

/**
 * Adds a chat to the chat store
 * @param {string} player either 'p1' or 'p2'
 * @param {string} text the text of the message
 */
export const setChat = (player, text) => store.dispatch({
  type: 'setChat',
  payload: { player, text },
});

/**
 * Returns the entire chat store
 */
export const getChats = () => store.dispatch({ type: 'getChats' });

///////////////////////
// GAME INFO ACTIONS //
///////////////////////

/**
 * Simply returns entire gameInfo state
 */
export const getInfo = () => store.dispatch({ type: 'getInfo' });

/**
 * Updates a player's piece count in the state
 * @param { string } player 'p1' || 'p2'
 * @param { number } pieces The updated piece count total
 */
export const updatePieces = (player, pieces) => store.dispatch({
  type: 'updatePieces',
  payload: { player, pieces },
});

///////////////////////
// USER INFO ACTIONS //
///////////////////////

/**
 * Simply retrieves both user's info
 */
export const getUsers = () => store.dispatch({ type: 'getUsers' });

/**
 * Takes in the player's username, level, and chats, and modifies state to reflect
 * @param { string } player 'p1' || 'p2'
 * @param { string } username
 * @param { number } level 
 * @param { object } chats @todo figure out shape of this
 */
export const setUser = ( player, username, level = 1, chats = [] ) => {
  store.dispatch({
    type: 'setUser',
    payload: { player, username, level, chats },
  });
};

/////////////////////////
// SERVER INTERACTIONS //
/////////////////////////

const url = 'http://localhost:3000';

export const newUser = ( username, password ) => {
  axios.post('/users', {username, password}).then(response => console.log(response));
};

export const getUser = ( username ) => {
  axios.get(`${url}/users/${username}`)
    .then(response => console.log(response));
};

export const login = ( username, password ) => {
  axios.post(`${url}/login`, { username, password });
};

export const getGame = gameId => {
  axios.get(`${url}/games/${gameId}`)
    .then(response => {
      console.log(response);
      setBoard(response.data.board);
    });
};

export const updateGame = (gameId) => {
  const gameState = store.getState();
  axios.post(`${url}/games/${gameId}`, gameState.board)
    .then(getGame(gameId));
  // .then(response => console.log('AAAH', response));
};