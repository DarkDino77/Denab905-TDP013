import express from 'express';

const app = express();

// Use express to host static pages (public/index.html) 

app.use(express.static('./'));

// Parse messages as json by default
app.use(express.json());

const port = 8080;
app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}/`);
})
