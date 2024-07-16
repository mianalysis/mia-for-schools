npm run build 
rm -r /var/www/schools/assets
cp -r dist/assets/ /var/www/schools/
cp dist/index.html /var/www/schools/
