import fs from 'fs'
import csv from 'csv-parser'

const results = []
process.stdin
  .pipe(csv())
  .on('data', (data) => {
    for (let key in data) {
      if (data[key] === "") delete data[key]
    }
    if ("id" in data) {                 // collections = named graphs
      data.uri = `https://graph.nfdi4objects.net/collection/${data.id}`
      data.type = ["fabio:Database","dcat:Dataset"]
      data.partOf = ["https://graph.nfdi4objects.net/collection/"]
      if (data.access) {
        data.access = {
          url: data.access,
          format: `https://format.gbv.de/${data.format}`
        }
      }
      delete data.format
    } else if ("wikidata" in data) {    // databases
      data.id = "http://www.wikidata.org/entity/" + data.id
      // TODO: type
    }
    results.push(data)
  })
  .on('end', () => console.log(JSON.stringify(results, null, 2)))
