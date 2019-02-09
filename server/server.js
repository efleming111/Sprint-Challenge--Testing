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

server.post('/games', async (req, res)=>{
    const body = req.body;
    if(body.title && body.genre){
        body.id = id;
        id++;
        gamesDB.push(body);
        res.status(201).json({id: body.id});
    }
    else{
        res.status(422).json({
            errorMessage: 'Failed to add game to database'
        })
    }
})

module.exports = {
    server,
    resetServer
}