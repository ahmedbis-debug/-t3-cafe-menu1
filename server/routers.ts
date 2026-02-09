import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getAllProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(() => getAllProducts()),
    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => getProductsByCategory(input.category)),
    create: protectedProcedure
      .input(z.object({
        nameEn: z.string(),
        nameAr: z.string(),
        category: z.enum(["hot", "cold", "desserts", "meals"]),
        price: z.number().int().positive(),
        calories: z.number().int().nonnegative().optional(),
        image: z.instanceof(File).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        let imageUrl: string | undefined;
        let imageKey: string | undefined;
        
        if (input.image) {
          const buffer = await input.image.arrayBuffer();
          const key = `products/${Date.now()}-${input.image.name}`;
          const { url } = await storagePut(key, Buffer.from(buffer), input.image.type);
          imageUrl = url;
          imageKey = key;
        }
        
        await createProduct({
          nameEn: input.nameEn,
          nameAr: input.nameAr,
          category: input.category,
          price: input.price,
          calories: input.calories || 0,
          imageUrl,
          imageKey,
        });
        
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number().int(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        category: z.enum(["hot", "cold", "desserts", "meals"]).optional(),
        price: z.number().int().positive().optional(),
        calories: z.number().int().nonnegative().optional(),
        image: z.instanceof(File).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        const updateData: any = {};
        if (input.nameEn) updateData.nameEn = input.nameEn;
        if (input.nameAr) updateData.nameAr = input.nameAr;
        if (input.category) updateData.category = input.category;
        if (input.price) updateData.price = input.price;
        if (input.calories !== undefined) updateData.calories = input.calories;
        
        if (input.image) {
          const buffer = await input.image.arrayBuffer();
          const key = `products/${Date.now()}-${input.image.name}`;
          const { url } = await storagePut(key, Buffer.from(buffer), input.image.type);
          updateData.imageUrl = url;
          updateData.imageKey = key;
        }
        
        await updateProduct(input.id, updateData);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        await deleteProduct(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
