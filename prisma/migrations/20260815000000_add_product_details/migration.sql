-- Adds product detail fields used by the admin "Key features / Specifications /
-- What's in the box" editor and the redesigned product page.
ALTER TABLE "Product" ADD COLUMN "keyFeatures" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Product" ADD COLUMN "specifications" JSONB;
ALTER TABLE "Product" ADD COLUMN "boxContents" TEXT[] NOT NULL DEFAULT '{}';
