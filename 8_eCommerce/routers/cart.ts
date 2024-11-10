import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma";
import { auth } from "../middlewares/auth";
import CartService from "../services/cart_service";

const router = express.Router();
const cartService = new CartService(prisma);

router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const cart = await prisma.cart.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
            include: {
                user: true,
                items: true,
            }
        });
        res.status(200).json({ cart: cart });
    } catch (e) {
        res.status(500).json({ msg: `Something went wrong ${e}` });
    }
});

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const { items } = req.body; // Expecting items to be an array of { productId, quantity }
        const user = res.locals.user; // The authenticated user

        if (!items || items.length === 0) {
            res.status(400).json({ msg: "Items are required" });
        }


        // Check if the user already has a cart
        let cart = await cartService.findCartByUserId(user.id);

        if (!cart) {
            // Create a new cart for the user if one doesn't exist
            cart = await cartService.createNewCart(user.id, items);
        } else {
            // Update existing cart items or add new ones
            cartService.updateExistingCartItem(cart.id, items);
        }

        // Re-fetch the cart with all related items and calculate total price
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart?.id },
            include: { items: { include: { product: true } } }
        });

        if (!updatedCart) {
            res.status(404).json({ msg: "Cart not found" });
        }

        // Calculate total price based on product prices and quantities
        const totalPrice = updatedCart?.items.reduce((sum, item) => {
            const productPrice = item.product?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        // Respond with the updated cart and total price
        res.status(200).json({ data: { cart: updatedCart, totalPrice } });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.delete('/', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const user = res.locals.user;
        console.log(`User id is ${user.id}`);

        const shoppingCart = await prisma.cart.findFirst({
            where: { userId: user.id },
        });

        if (!shoppingCart) {
            res.status(400).json({ msg: "Cart not found!" });
        }

        await prisma.cart.update({
            where: { id: shoppingCart?.id },
            data: {
                items: {
                    disconnect: {
                        id: id
                    }
                }
            }
        });

        const updatedCart = await prisma.cart.findUnique({
            where: { id: shoppingCart?.id },
            include: { items: { include: { product: true } } }
        });
        
        if (!updatedCart) {
            res.status(404).json({ msg: "Cart not found" });
        }

        // Calculate total price based on product prices and quantities
        const totalPrice = updatedCart?.items.reduce((sum, item) => {
            const productPrice = item.product?.price || 0;
            return sum + productPrice * item.quantity;
        }, 0);

        // Respond with the updated cart and total price
        res.status(200).json({ data: { cart: updatedCart, totalPrice } });
    } catch (e) {
        res.status(500).json({ msg: `Something went wrong ${e}` });
    }
});


export default router;