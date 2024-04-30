-- CreateTable
CREATE TABLE "Wishlist" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "shop_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
