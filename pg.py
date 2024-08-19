#!/usr/bin/env python3
import sys
import json
import csv

n4oc = "https://nfdi4objects.net/collection/"

def main():
    with open('n4o-collections.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        collections = [row for row in reader]

    for col in collections:
        col["name"] = col['name'].split('|')
        names = ",".join([f'"{n}"' for n in col['name']])
        print(f'{n4oc}{col["id"]} :Collection name:{names} url:"{col["url"]}"')
        if col['db']:
            print(f'{n4oc}{col["id"]} -> http://www.wikidata.org/entity/{col["db"]} :partOf')
        else:
            del(col['db'])

if __name__ == "__main__":
    main()
