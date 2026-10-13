import { definePrismaConfig } from "@prisma/cli-engine";

export default definePrismaConfig({
  schemas: ["./prisma/schema.prisma"],
  orm: {
    adapter: "postgresql",
    family: "postgres",
    target: "prisma-dbml-syntax",
  },
});