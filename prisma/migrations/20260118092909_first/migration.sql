-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('general', 'trade');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');

-- CreateTable
CREATE TABLE "enquiries" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "EnquiryType" NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'new',
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "message" TEXT NOT NULL,
    "company" VARCHAR(255),
    "role" VARCHAR(100),
    "country" VARCHAR(100),
    "product_interest" JSONB,
    "quantity" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enquiries_created_at_idx" ON "enquiries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "enquiries_status_idx" ON "enquiries"("status");

-- CreateIndex
CREATE INDEX "enquiries_email_idx" ON "enquiries"("email");

-- CreateIndex
CREATE INDEX "enquiries_type_idx" ON "enquiries"("type");
