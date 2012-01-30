#!/bin/bash
cp $1 $1.tmp



#sed -i 's/^\n\t\* /"description":"/g' $1.tmp


echo -e '['  > $1.tmp
cat $1  >> $1.tmp
echo -e "\t\t]" >> $1.tmp
echo -e '\t}' >> $1.tmp
echo -e ']' >> $1.tmp


sed --binary -i -r 's/^@\W*(.*)$/\t\t]\n\t},\n\t{"name":"\1", "content":\n\t\t[/g' $1.tmp
sed -i -r 's/^([1234567890ABCDEF]+)\t(.*)$/\t\t\t{"charcode":"0x\1", "title":"\2"},/g' $1.tmp
sed -i -r 's/^\t+[*x=].$//g' $1.tmp

diff $1 $1.tmp
