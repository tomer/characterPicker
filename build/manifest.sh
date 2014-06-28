echo Creating manifest file
cd ..
echo CACHE MANIFEST   > manifest.appcache
echo \# v1.0.5 `date` >> manifest.appcache
ls *.html *.js *.css  >> manifest.appcache
ls *.otf *.ttf        >> manifest.appcache
ls res/*.json         >> manifest.appcache
