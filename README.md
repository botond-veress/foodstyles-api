# Foodstyles API

Foodstyles API is responsible of:

- User authentication & registration
- User authorization
- Todo management

## Dependencies

- yarn
- docker (in case you want to run the database locally)

## Installation

```bash
$ yarn
```

## Create the .env file

```bash
$ cp .env.example .env
```

_For testing purposes I hardcoded the database credentials and JWT secrets._
_In real life systems we can remove the hardcoded values or encrypt them with [ejson](https://github.com/Shopify/ejson)._

```bash
PORT="4000"
MYSQL_URI="mysql://jma_FKY6vfa9unj0rfj:mwQMP378g6tHbK_V64jK@127.0.0.1:3307/foodstyles"
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIICWwIBAAKBgQDR8EZNCfn4TR4TKo9cW/qestugodsyUbjXBZVjaqF0DI55rsw3\neNmqqFXwL86dLFrgjcM+k375RS4Z6Bdd8UgYPx69mBUiXxFDhqZHc2wDiYcFe0wd\ni2tc1gWwfHRf4UxxJNgIlTrTuICWtkeE7pcdIaZi7fH+nCZ7niNszqLIMQIDAQAB\nAoGAXSnOWMOznT/Dt+esJOVga2qd0kPhfQwNBcahi7O3IEOuOkuaroc/uN7o/CSL\nAO69CWd/nFZiA4ZyteZr8DFxtxsAjBXJSYwRSGBjeoQhb8Fvm1C1KqtokZYJhfpc\nyJdKGSAPHSBj0zrd4EdVptWPK/HtavSr6EkMvVULPwlI2tECQQDt1nAaXSYkn3LU\n+C0Z6H0H4XOnWuDZrSfgXOqQ5LbV5qnflppZrMVWLnXLWEWamDQ+EVDQvdeqVCb+\nS4T9tlCtAkEA4fht1AFZq9+siWbQLOLUdigMuWGa6PnVltJCOEIunIQ9ZbL4lY9P\nOacfiu1uvqd/XXLAUkrK0bOSVwHdp0oSFQJAIu7uRFEOOy7YVQOmzDljs/afYCNv\nB0nxo3jCU0nkuQJKTTb3sNg5m/DzCE0M3Coi8kLk1eQsey4lFBDPldxjeQJAMjPf\nMpqaMXUf/+a3mUFLsnRzXzwwDlJzAW71B0qs0FkQyudYEuIj18spVtQpJnJP+ZLk\n52N2a+BZQrtHY0MxgQJAWxqbTF4kBorAXYU/GVYlVz3mhavIlmghm3QAZRioUnbu\nf9UZ0YwX7e2ahmKnN3MyxO9L4SXojpX9eHYzxbPijQ==\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDR8EZNCfn4TR4TKo9cW/qestug\nodsyUbjXBZVjaqF0DI55rsw3eNmqqFXwL86dLFrgjcM+k375RS4Z6Bdd8UgYPx69\nmBUiXxFDhqZHc2wDiYcFe0wdi2tc1gWwfHRf4UxxJNgIlTrTuICWtkeE7pcdIaZi\n7fH+nCZ7niNszqLIMQIDAQAB\n-----END PUBLIC KEY-----"
```

## Running the database

```bash
$ docker-compose up
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
$ yarn migration:run

# rever migration
$ yarn migration:revert migrations/create-user
```
