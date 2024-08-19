import fs from 'fs'
import csv from 'csv-parser'

const results = []
process.stdin
  .pipe(csv())
  .on('data', (data) => {
    for (let key in data) {
      if (data[key] === "") delete data[key]
    }
    if ("id" in data) {
      data.id = "http://data.nfdi4objects.net/collection/" + data.id
        data.type = ["fabio:Database","dcat:Dataset"]
    } else if ("wikidata" in data) {
      data.id = "http://www.wikidata.org/entity/" + data.id
      // TODO: type
    }
    results.push(data)
  })
  .on('end', () => console.log(JSON.stringify(results, null, 2)))
