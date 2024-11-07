import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { updatedAt: "desc" }
        });
        res.json({ products: products })
    } catch (e) {
        res.status(500).json("Something went wrong");
    }
});

router.post('/product', async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            res.status(400).json({ msg: "Name, description or price cannot be empty" });
        }
        console.log(`${name}, ${description} ${price}`);

        const product = await prisma.product.create({
            data: { name, description, price },
        });

        res.json({ product: product });
    } catch (e) {
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.put('/product/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        console.log(`Product Id ${id} ${name} ${description}`);

        if (!id) { res.status(400).json({ msg: "Product id should be included" }); }


        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: { name, description, price },
        });
        res.json(updatedProduct);

    } catch (e) {
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.delete('/product/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: id }
        });
        res.status(201).json({ msg: `Product #${id} is successfully deleted` });
    } catch (e) {
        res.status(500).json({ msg: `Something went wrong ${e}` });
    }
});

export default router;