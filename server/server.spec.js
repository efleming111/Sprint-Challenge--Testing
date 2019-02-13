const request = require('supertest');

const {server, resetServer} = require('./server');

describe('the route handlers', ()=>{
    describe('post /games', ()=>{
        afterEach(async()=>{
            await resetServer();
        })

        it('returns status code 201', async ()=>{
            const body = {title: 'Frogger', genre: 'Arcade', releaseYear: 1981}
            const res = await request(server).post('/games').send(body);
            expect(res.status).toBe(201);
        })

        it('returns an id', async ()=>{
            const res = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            expect(res.body).toEqual({id: 1});
        })

        it('returns status code 422 on failure', async ()=>{
            const body = {title: 'Frogger'}
            const res = await request(server).post('/games').send(body);
            expect(res.status).toBe(422);
        })

        it('returns an error message on failure', async ()=>{
            const body = {title: 'Frogger'}
            const res = await request(server).post('/games').send(body);
            expect(res.body).toEqual({
                errorMessage: 'Failed to add game to database'
            })
        })

        it('returns status code 405 on duplicate game', async ()=>{
            const res1 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const res2 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            expect(res2.status).toBe(405);
        })
    })
    
    describe('get /games', ()=>{
        afterEach(async()=>{
            await resetServer();
        })

        it('returns status code 200', async ()=>{
            const res = await request(server).get('/games');
            expect(res.status).toBe(200);
        })

        it('returns an array', async ()=>{
            const post = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const games = await request(server).get('/games');
            expect(games.body).toEqual([{id: 1, title: 'Frogger', genre: 'Arcade', releaseYear: 1981}])
        })

        it('returns an empty array', async ()=>{
            const games = await request(server).get('/games');
            expect(games.body).toEqual([])
        })
    })

    describe('get /games', ()=>{
        afterEach(async()=>{
            await resetServer();
        })

        it('returns status code 200', async ()=>{
            const post = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const res = await request(server).get('/games/1');
            expect(res.status).toBe(200);
        })

        it('returns status code 404 when game not found', async ()=>{
            const post = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const res = await request(server).get('/games/2');
            expect(res.status).toBe(404);
        })

        it('returns game', async ()=>{
            const post1 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const post2 = await request(server).post('/games').send({title: 'Asteroids', genre: 'Arcade', releaseYear: 1979});
            const games = await request(server).get('/games/2');
            expect(games.body).toEqual({id: 2, title: 'Asteroids', genre: 'Arcade', releaseYear: 1979})
        })
    })
    
    describe('delete /games/:id', ()=>{
        afterEach(async()=>{
            await resetServer();
        })

        it('returns status code 200', async ()=>{
            const post1 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const post2 = await request(server).post('/games').send({title: 'Asteroids', genre: 'Arcade', releaseYear: 1979});
            const res = await request(server).delete('/games/2');
            expect(res.status).toBe(200);
        })

        it('returns the deleted games id', async ()=>{
            const post1 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const post2 = await request(server).post('/games').send({title: 'Asteroids', genre: 'Arcade', releaseYear: 1979});
            const res = await request(server).delete('/games/2');
            expect(res.body).toEqual({id: 2});
        })
        
        it('returns status code 404 if game does not exist', async ()=>{
            const post1 = await request(server).post('/games').send({title: 'Frogger', genre: 'Arcade', releaseYear: 1981});
            const post2 = await request(server).post('/games').send({title: 'Asteroids', genre: 'Arcade', releaseYear: 1979});
            const res = await request(server).delete('/games/3');
            expect(res.status).toBe(404);
        })
    })
})