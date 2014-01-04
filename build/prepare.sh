#!/bin/bash
#rm *.txt
rm *.json
python generate_maps.py
mv *.json ../res/ 
mv *.txt old/ # Cleanup data files
./manifest.sh
