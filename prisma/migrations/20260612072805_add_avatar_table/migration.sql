-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
