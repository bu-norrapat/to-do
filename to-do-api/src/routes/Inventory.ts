import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

export const inventoryRoutes = new Elysia({ prefix: "/inventory" })

  .get("/", async ({ query }) => {
    const { low_stock } = query;

    const where = low_stock ? { quantity: { lte: 10 } } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return products;
  }, {
    query: t.Object({
      low_stock: t.Optional(t.Boolean()),
    }),
  })

  .post("/", async ({ body }) => {
    const { name, sku, zone, quantity = 0 } = body;

    const newProduct = await prisma.product.create({
      data: { name, sku, zone, quantity },
    });

    return newProduct;
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      sku: t.String({ minLength: 1 }),
      zone: t.String({ minLength: 1 }),
      quantity: t.Optional(t.Integer()),
    }),
  })

  .patch("/:id/adjust", async ({ params, body, set }) => {
    const { id } = params;
    const { change } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      set.status = 404;
      return { message: "Product not found" };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { quantity: existing.quantity + change },
    });

    return updated;
  }, {
    params: t.Object({ id: t.String({ minLength: 1 }) }),
    body: t.Object({ change: t.Integer() }),
  })

  .delete("/:id", async ({ params, set }) => {
    const { id } = params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      set.status = 404;
      return { message: "Product not found" };
    }

    if (existing.quantity > 0) {
      set.status = 400;
      return { message: "ไม่สามารถลบสินค้าที่ยังมีอยู่ในสต็อกได้" };
    }

    await prisma.product.delete({ where: { id } });
    return { message: "Deleted successfully" };
  }, {
    params: t.Object({ id: t.String({ minLength: 1 }) }),
  });