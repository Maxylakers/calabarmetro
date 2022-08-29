# CalabarMetro

> A property management project.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Run The API server

### Production

``` bash
# run MongoDB server
mongod

# or run MongoDB server with a data path
mongod --dbpath data/db

# run API production server with pm2
npm run start

# restart API production server with pm2
pm2 restart

# monitor server
pm2 monit
```

### Development

``` bash
# run MongoDB server
mongod

# or run MongoDB server with a data path
mongod --dbpath data/db

# or run API staging server with pm2
npm run start:staging

# restart API staging server with pm2
pm2 restart:staging

# monitor server
pm2 monit
```
