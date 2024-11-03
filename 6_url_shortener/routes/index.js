import express from 'express';
import Url from '../models/Url.js';
const router = express.Router();

router.get('/:urlId', async (req, res) => {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        if (url) {
            await Url.updateOne(
                {
                    urlId: req.params.urlId,
                },
                { $inc: { clicks: 1 } }
            );
            return res.redirect(url.origUrl);
        } else {
            res.status(404).json('Not Found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Server error');
    }
});

export default router;