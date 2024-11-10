import { Cart, CartItem, PrismaClient, Product } from "@prisma/client";
import { prisma } from "../prisma";

class CartService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findCartByUserId(userId: string): Promise<Cart | null> {
        let cart = await prisma.cart.findFirst({
            where: { userId: userId },
            include: { items: true }
        });
        return cart;
    }

    async findExistingCartItem(cartId: string, productId: string) {
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cartId, productId: productId }
        });
        return existingItem;
    }

    async createNewCart(userId: string, items: any): Promise<any> {
        return await prisma.cart.create({
            data: {
                userId: userId,
                items: {
                    create: items.map((item: { productId: string, quantity: number }) => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity,
                        price: 0,
                    }))
                }
            },
            include: { items: true }
        });
    }

    async updateExistingCartItem(cartId: string, items: CartItem[]): Promise<void> {
        for (const item of items) {
            const existingItem = await prisma.cartItem.findFirst({
                where: { cartId: cartId, productId: item.productId }
            });

            if (existingItem) {
                // Update quantity if the item already exists in the cart
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity }
                });
            } else {
                // Add new item to the cart
                await prisma.cartItem.create({
                    data: {
                        cartId: cartId,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: 0 // This will be updated based on the product price
                    }
                });
            }
        }
    }
}

export default CartService;