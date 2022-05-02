## Description

API (DailyTrends)

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ docker-compose up -d
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
* Go to http://127.0.0.1:3000/api/feed/daily-trend for loading the last five news from elpais.com and elmundo.es and show them.
* Go to http://127.0.0.1:3000/api/doc to see the api doc

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

