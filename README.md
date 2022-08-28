# Foodstyles API

Foodstyles API is responsible of:

- User authentication & registration
- User authorization
- Todo management

## Installation

```bash
$ yarn
```

## Running the app

```bash
# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Migrations

```bash
# generate migration based on entity changes (preferred)
$ yarn migration:generate migrations/create-user

# create migration manually
$ yarn migration:create migrations/create-user

# run migrations
$ yarn migration:run migrations/create-user

# rever migration
$ yarn migration:revert migrations/create-user
```
