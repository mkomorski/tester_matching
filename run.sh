cd ./client
echo -e "*** Installing client application dependencies *** \n"
npm install
echo -e "*** Building client application ***"
npm run-script build
echo -e "*** Copying client application dist to server application *** \n"
rm -rf ../server/public
mkdir -p ../server/public
cp -r ./build/* ../server/public
cd ../server
echo -e "*** Installing server application dependencies *** \n"
npm install
echo -e "*** Running server app on http://localhost:4000 *** \n"
npm start

