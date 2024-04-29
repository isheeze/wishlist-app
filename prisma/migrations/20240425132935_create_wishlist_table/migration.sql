-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL
);
