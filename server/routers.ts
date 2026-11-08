import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createCustomerOrder, createSupportTicket, getOrdersForUser } from "./db";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

const catalog = {
  "p-001": { name: "Pocket Snap Camera", price: 89.9, image: "/catalog/camera.jpg" },
  "p-002": { name: "Olive Countertop Mixer", price: 149, image: "/catalog/mixer.jpg" },
  "p-003": { name: "Daily Glow Face Mist", price: 24.5, image: "/catalog/beauty.jpg" },
  "p-004": { name: "Terracotta Table Set", price: 48, image: "/catalog/tableware.jpg" },
  "p-005": { name: "Everyday Linen Overshirt", price: 58, image: "/catalog/beauty.jpg" },
  "p-006": { name: "Desk Light Mini", price: 36, image: "/catalog/camera.jpg" },
  "p-007": { name: "Soft Start Journal", price: 18, image: "/catalog/tableware.jpg" },
  "p-008": { name: "Woven Market Tote", price: 31.5, image: "/catalog/mixer.jpg" },
} as const;

const orderInput = z.object({
  customerName: z.string().trim().min(2).max(160),
  email: z.string().email().max(320),
  address: z.string().trim().min(8).max(600),
  couponCode: z.string().trim().max(32).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
    variant: z.record(z.string(), z.string()).optional(),
  })).min(1).max(50),
});

const money = (value: number) => value.toFixed(2);

function buildServerTotals(input: z.infer<typeof orderInput>) {
  const items = input.items.map(item => {
    const product = catalog[item.productId as keyof typeof catalog];
    if (!product) throw new TRPCError({ code: "BAD_REQUEST", message: "One of the products is no longer available." });
    return { ...item, product, unitPrice: product.price };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const normalizedCoupon = input.couponCode?.toUpperCase();
  const discount = normalizedCoupon === "GOLDEN10" && subtotal >= 50 ? Math.min(10, subtotal * 0.1) : 0;
  const shipping = subtotal - discount >= 75 ? 0 : 6.95;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal + shipping + tax - discount;
  return { items, subtotal, discount, shipping, tax, total, couponCode: discount > 0 ? normalizedCoupon : undefined };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  orders: router({
    create: publicProcedure.input(orderInput).mutation(async ({ input, ctx }) => {
      const totals = buildServerTotals(input);
      const orderNumber = `GC-${nanoid(8).toUpperCase()}`;
      const created = await createCustomerOrder({
        orderNumber,
        userId: ctx.user?.id ?? null,
        customerName: input.customerName,
        email: input.email,
        address: input.address,
        subtotal: money(totals.subtotal),
        shipping: money(totals.shipping),
        tax: money(totals.tax),
        discount: money(totals.discount),
        total: money(totals.total),
        couponCode: totals.couponCode ?? null,
        status: "Processing",
      }, totals.items.map(item => ({
        orderId: 0,
        productId: item.productId,
        productName: item.product.name,
        image: item.product.image,
        unitPrice: money(item.unitPrice),
        quantity: item.quantity,
        variantJson: item.variant ? JSON.stringify(item.variant) : null,
      })));
      return {
        id: created.order.orderNumber,
        createdAt: created.order.createdAt,
        customerName: created.order.customerName,
        email: created.order.email,
        address: created.order.address,
        subtotal: Number(created.order.subtotal),
        shipping: Number(created.order.shipping),
        tax: Number(created.order.tax),
        discount: Number(created.order.discount),
        total: Number(created.order.total),
        status: created.order.status,
        items: created.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          variant: item.variantJson ? JSON.parse(item.variantJson) : undefined,
        })),
      };
    }),
    mine: protectedProcedure.query(async ({ ctx }) => {
      const records = await getOrdersForUser(ctx.user.id);
      return records.map(({ order, items }) => ({
        id: order.orderNumber,
        createdAt: order.createdAt,
        customerName: order.customerName,
        email: order.email,
        address: order.address,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        discount: Number(order.discount),
        total: Number(order.total),
        status: order.status,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          variant: item.variantJson ? JSON.parse(item.variantJson) : undefined,
        })),
      }));
    }),
  }),
  support: router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(160),
      email: z.string().email().max(320),
      orderNumber: z.string().trim().max(32).optional(),
      issue: z.string().trim().min(2).max(120),
      message: z.string().trim().min(10).max(5000),
      photoName: z.string().trim().max(255).optional(),
    })).mutation(async ({ input, ctx }) => {
      const ticket = await createSupportTicket({
        ticketNumber: `GC-${nanoid(8).toUpperCase()}`,
        userId: ctx.user?.id ?? null,
        name: input.name,
        email: input.email,
        orderNumber: input.orderNumber || null,
        issue: input.issue,
        message: input.message,
        photoName: input.photoName || null,
        status: "Open",
      });
      return { ticketNumber: ticket.ticketNumber, status: ticket.status };
    }),
  }),
});

export type AppRouter = typeof appRouter;
