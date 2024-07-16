npm run build
rm -r /var/www/schools/assets
cp dist/index.html /var/www/schools/
cp -r dist/assets/ /var/www/schools/
