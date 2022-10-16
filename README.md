# Prodigy IoT - API

## Useful commands

Start Compose:

```bash
docker-compose up -d
```

Test database connection:

```bash
psql -h localhost -p 5438 -U $MY_DB_USER prodigy_api -W
```

Install packages and migrate all:

```bash
npm install
npm run prepare
npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
```

Start development mode:

```bash
npm start
```

Dispose Compose:

```bash
docker-compose down -v
```
