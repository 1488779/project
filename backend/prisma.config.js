import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: "postgresql://postgres:_Z7x83636_@localhost:5432/animal_shelter",
    provider: "postgresql",
  },
});