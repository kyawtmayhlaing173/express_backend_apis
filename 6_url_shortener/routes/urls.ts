import express, { Express, Request, Response, Router } from "express";
import { nanoid } from 'nanoid';
import Url from '../models/Url';
import { validateUrl } from '../utils/utils';
import dotenv from 'dotenv';

dotenv.config();

const defaultRoute =  Router();
  
defaultRoute.post('/short', async (req, res): Promise<any> => {
    const { origUrl } = req.body;
    const base = process.env.BASE;

    const urlId = nanoid();
    if (validateUrl(origUrl)) {
        try {
            let url = await Url.findOne({ origUrl });
            if (url) {
                res.json(url);
            } else {
                const shortUrl = `${base}/${urlId}`;
                url = new Url({
                    origUrl, shortUrl, urlId, date: new Date(),
                });
                await url.save();
                res.json(url);
            }
        } catch (error) {
            res.status(500).json('Server Error');
        }
    } else {
        return res.status(400).json({ error: 'Invalid Original Url' });
    }
});

export default defaultRoute;