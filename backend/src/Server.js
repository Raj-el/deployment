import 'dotenv/config';
import http from 'http';
import app from './App.js';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


server.listen(PORT, () => {
    console.log(`Server running at ${PORT}...`);
});