# Loop Assignment

This repository contains the solution to the Loop assigment for creating a weight management app. A user can signup/login and then add/edit/remove a weight record from their profile. 

The code is split into `/web` and `/server` which can both be run independently.

## Getting Started

Before getting started, you'll need to have the following installed:
```
yarn: 1.22.19
node: 18.7.0
docker-compose: 2.6.1
```

Once installed, you'll need to run the following services:

### MongoDB
To get the MongoDB instance running, run the following command:
```sh
docker-compose up mongodb_container
```

To shut down MongoDB, run the following from another terminal:
```sh
docker-compose down
```

### Server
To get the server running, run the following command from within the `./server` directory:
```sh
yarn
yarn start
```

This should be running on `PORT=8000` provided by `./server/.env`.

### Web
To get the website running, run the following command from within the `./web` directory:
```sh
yarn
yarn start
```

This should be running on `localhost:3000`, which is the default `PORT` for `create-react-app`.


## Improvements

The following improvements would have been made if time allowed:

### docker-compose
There were issues getting the `server` to connect to `mongodb_container` when all services were run via docker-compose. Both the `web` and `server` services built and ran in docker-compose successfully (code has been commented out) but the connection to `mongodb_container` kept timing out.

Additionally, the Dockerfiles for `server` and `web` definitely need to be improved and optimised (so that layers can be cached effectively).

### Styling
I used MaterialUI for the components for the `web` service, but would have enjoyed refining the UI more.

### Loading States
Implement loading states on the `web` for every request to the `server`. It's currently handled with disabling buttons and forcing the user back to the dashboard view, but ideally the UX can be improved.

### Logging and testing
Improve the logging on the `server` to aid in troubleshooting and conduct thorough testing.

