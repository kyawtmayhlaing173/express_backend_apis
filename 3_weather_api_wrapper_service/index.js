const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 15 });

const verifyCache = (req, res, next) => {
    try {
        const { city } = req.query;
        if (cache.has(city)) {
            console.log('Calling from cache');
            return res.status(200).json(cache.get(city));
        }
        console.log('Calling from API');
        return next();
    } catch(e) {
        throw new Error(err);
    }
}

app.use("/weather", verifyCache, async (req, res) => {
    const city = req.query.city || 'Bangkok';
    
    try {
        const response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` + city + `?unitGroup=metric&key=2Z95JL3Z2YDZRKWELYZGA5CNV&contentType=json`);
        const weatherData = response.data;
        cache.set(city, weatherData);
        console.log(weatherData.latitude);
        return res.status(200).json(weatherData);
    } catch (e) {
        return res.json({ "error": e });
    }
});



app.listen(8000, () => {
    console.log("API started at 8000...")
});

const gracefulShutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log("Yaycha API closed");
        process.exit(0);
    });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);