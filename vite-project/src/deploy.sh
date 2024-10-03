echo "Building app..."
npm run build
echo "Deploy files to server..."
scp -r -i ~/Desktop/SWPKEY dist/* root@143.198.214.247:/var/www/SWPKOI/
echo "Done!"
