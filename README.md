# Tester Matching App

This project contains two applications. Client powered by ReactJS and Server powered by NodeJS/Express.
Server application provides REST API to fetch information about testers and their experience. Client application is single page application
running in browser. Make sure you have got NodeJS(^v8.0) and npm(^v.5.0) properly installed on your OS in order to run project.

## How to run

### Using run.sh script

Run run.sh shell script from root directory to install all dependencies, build client and copy its dist version to server application to serve it together.

```
./run.sh
```

Client application has been implemented as single page application so it can be deployed on different server but just for convenience I prepared route /panel in server application which will serve dist version of client application inside. After executing run.sh script application will be ready to explore on http://localhost:4000/panel URL in browser.

### Manual

If you would like to build and run applications independently then you should run these commands in both ./server and ./client directories

```
npm install
npm start
```

After running 'npm start' in ./client directory development server will start and open a browser on 3000 port, where there will be client application served. Server application by default is being served on 4000 port.

## Running tests

### Client

Run following command to run test with coverage report in ./client directory

```
npm test -- --coverage
```

Coverage report will be displayed not only in terminal but also there will be generated html version of it in ./client/coverage/lcov-report/index.html

### Server

Run following command to run test with coverage report in ./server directory

```
npm run-script test-with-coverage
```

Coverage report will be displayed in terminal
