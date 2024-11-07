echo "Building app..."
npm run build
echo "Deploy files to server..."
scp -r -i ~/Desktop/SWPKEY dist/* root@178.128.63.180:/var/www/SWPKOI/
echo "Done!"
