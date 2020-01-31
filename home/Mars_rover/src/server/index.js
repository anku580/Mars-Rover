require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/rover', async (req, res) => {
    try{
        let {rover_name} = req.query;
        let roverInformation = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover_name}?api_key=${process.env.API_KEY}`)
        let output = await roverInformation.json();
        res.send(output);
    }
    catch (err) {
        
    }
})

app.get('/rover/images', async(req, res) => {
    try{
        let {rover_name, sol} = req.query;
        let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?sol=${sol}&api_key=${process.env.API_KEY}`)
        let output = await images.json();
        res.send(output);
    }
    catch (err) {

    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))