echo Creating manifest file
cd ..
echo CACHE MANIFEST   > manifest.appcache
echo \# v1.0.6 `LANG=en date` >> manifest.appcache
echo                  >> manifest.appcache
echo CACHE:           >> manifest.appcache
ls *.html *.js *.css  >> manifest.appcache
ls *.otf *.ttf        >> manifest.appcache
ls res/*.json         >> manifest.appcache
echo                  >> manifest.appcache
echo NETWORK:         >> manifest.appcache
echo \*               >> manifest.appcache
