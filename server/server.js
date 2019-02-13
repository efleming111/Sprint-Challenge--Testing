const express = require('express');

const server = express();
server.use(express.json());

// Database Schema
// {id: 1, title: 'Pacman', genre: 'Arcade', releaseYear: 1980},
// {id: 2, title: 'Asteroids', genre: 'Arcade', releaseYear: 1979}
let gamesDB = []
let id = 1;

function resetServer(){
    gamesDB = [];
    id = 1;
}

server.get('/games', async (req, res)=>{
    res.status(200).json(gamesDB);
})

server.get('/games/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    const game = gamesDB.find(game=>game.id === id);
    if(game){
        res.status(200).json(game);
    }
    else{
        res.status(404).json({
            errorMessage: 'Game not found'
        })
    }
})

server.post('/games', async (req, res)=>{
    const body = req.body;
    let isDuplicate = false;
    if(gamesDB.length){
        isDuplicate = gamesDB.find(game=>game.title === body.title) ? true : false;
    }
    
    if(body.title && body.genre && !isDuplicate){
        body.id = id;
        id++;
        gamesDB.push(body);
        res.status(201).json({id: body.id});
    }
    else if(isDuplicate){
        res.status(405).json({
            errorMessage: 'Failed to add duplicate game to database'
        })
    }
    else{
        res.status(422).json({
            errorMessage: 'Failed to add game to database'
        })
    }
})

server.delete('/games/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const gameToDelete = gamesDB.find(game=>game.id === id);
    if(gameToDelete){
        gamesDB.pop();
        res.status(200).json({id: gameToDelete.id});
    }
    else{
        res.status(404).json({
            errorMessage: 'Game not found'
        })
    }
})

module.exports = {
    server,
    resetServer
}