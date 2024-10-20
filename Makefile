prisma_init:
	npx prisma init --datasource-provider sqlite

prisma_migrate:
	npx prisma migrate dev --name=init

nodemon:
	npx nodemon index.js

prisma_studio:
	npx prisma studio

prisma_migrate_reset:
	npx prisma migrate reset