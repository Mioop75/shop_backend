-- AlterTable
CREATE SEQUENCE product_id_seq;
ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT nextval('product_id_seq');
ALTER SEQUENCE product_id_seq OWNED BY "Product"."id";

-- AlterTable
CREATE SEQUENCE role_id_seq;
ALTER TABLE "Role" ALTER COLUMN "id" SET DEFAULT nextval('role_id_seq');
ALTER SEQUENCE role_id_seq OWNED BY "Role"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- AlterTable
CREATE SEQUENCE user_sessions_id_seq;
ALTER TABLE "User_Sessions" ALTER COLUMN "id" SET DEFAULT nextval('user_sessions_id_seq');
ALTER SEQUENCE user_sessions_id_seq OWNED BY "User_Sessions"."id";
