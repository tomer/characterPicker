#/usr/bin/python

import os.path
import urllib2
import csv
import json

def get_file(url):
    my_file = urllib2.urlopen(url)
    output = open(url.split('/')[-1],'wb')
    output.write(my_file.read())
    output.close()

class characterSet:

    def __init__(self):
        self.data = dict()
        self.blocks = dict()
        self.categories = dict()
        self.files = dict()
        self.get_blocks()
        self.get_entities()
        self.get_categories()
        
        
    def get_file_if_missing(self, filename, url):
        if not os.path.isfile(filename):
            print ("Downloading data file. Please wait...")
            get_file(url)
    
    def get_categories(self):
        ## http://www.unicode.org/notes/tn36/ A Categorization of Unicode Characters 	2011-08-11
        self.get_file_if_missing("Categories.txt", "http://www.unicode.org/notes/tn36/Categories.txt")
        content = csv.reader(open("Categories.txt", "rb"), delimiter='\t')
        for row in content:
            key = int(row[0],16)
            if self.data.has_key(key):
                self.data[key]['cat1'] = row[2]
                self.data[key]['cat2'] = row[3]
                self.data[key]['cat3'] = row[4]                
                self.data[key]['cat4'] = row[5]

        
    def get_entities(self):         
        self.get_file_if_missing("UnicodeData.txt", "http://www.unicode.org/Public/UNIDATA/UnicodeData.txt")       
        content = csv.reader(open('UnicodeData.txt', 'rb'), delimiter=';')
        for row in content:
            item = dict()
            # file specs http://www.unicode.org/reports/tr44/tr44-8.html#UnicodeData.txt
            item['title'] = row[1]
            item['description'] = row[10]
            key = int(row[0],16)          
            self.data[key] = item
        
        
    def get_blocks(self):
        self.get_file_if_missing("Blocks.txt", "http://www.unicode.org/Public/UNIDATA/Blocks.txt") 
        content = csv.reader(open('Blocks.txt', 'rb'), delimiter=';')
        
        for row in content:
            if len(row)>0 and row[0].startswith('#'): continue # Ignore comments

            if len(row) == 2:
                item = dict()
                item['start'] = int(row[0].split('..')[0],16)
                item['end']   = int(row[0].split('..')[1],16)
                item['name']  = row[1].strip()
                self.blocks[item['start']] = item
             
                
        
    def show(self):
        print self.data
    
    def getBlockFrom(self, start):
        out = dict();
        if (self.blocks.has_key(start)): 
            end = self.blocks[start]['end']
            name = self.blocks[start]['name']
            out['name'] = name
            out['content'] = []
            for i in range(start,end):
                if (self.data.has_key(i)): 
                    item = dict();
                    item['title'] = self.data[i]['title']
                    item['charcode'] = hex(i)
                    item['description'] = self.data[i]['description']
                    if (self.data[i].has_key('cat1')):  item['cat1'] = self.data[i]['cat1']
                    if (self.data[i].has_key('cat2')):  item['cat2'] = self.data[i]['cat2']
                    if (self.data[i].has_key('cat3')):  item['cat3'] = self.data[i]['cat3']
                    if (self.data[i].has_key('cat4')):  item['cat4'] = self.data[i]['cat4']
                    
                    out['content'].append(item)
        else: print ("Not found")
        return out
        
    def create_json_block(self, start):
        out = []
        out.append(self.getBlockFrom(start))
        return json.dumps(out, sort_keys=True, indent=4)
    
    def save_json_block(self, start, filename):
        content = self.create_json_block(start)
        f = open(filename, 'w')
        f.write(content)
        f.close()
        self.register_file(start, filename)
        
    def register_file(self, key, filename):
        item = dict()
        item['filename'] = filename
        item['start'] = key
        item['title'] = self.blocks[key]['name']
        #self.files.append(item)
        self.files[item['title']] = item

    def generate_file_listing(self):
        content = json.dumps(self.files, sort_keys=True, indent=4)
        f = open('list.json', 'w')
        f.write(content)
        f.close()
        
    def generate_all_blocks(self):
        for key in self.blocks:
            name = self.blocks[key]['name']
            name = name.lower()
            name = name.replace(" ", "_")
            #name.join (filename, '.json')
            filename = "{block}-{name}.json".format(block=hex(self.blocks[key]['start']), name=name)
            print ("Building file {0}...".format(filename))
            self.save_json_block(self.blocks[key]['start'], filename)

mySet = characterSet()
#mySet.show()

#print mySet.blocks
#print mySet.create_json_block(0x1f300)

mySet.generate_all_blocks()
mySet.generate_file_listing()


