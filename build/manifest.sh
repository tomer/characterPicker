echo Creating manifest file
cd ..
echo CACHE MANIFEST   > manifest.appcache
echo \# v1.0.3 `date` >> manifest.appcache
ls *.html *.otf       >> manifest.appcache
ls res/*.json         >> manifest.appcache
