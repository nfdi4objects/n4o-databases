#!/usr/bin/env node

import fs from 'fs'
import wdk from 'wikibase-sdk/wikidata.org'
import { parse } from 'csv-parse/sync'
const csv = fs.readFileSync('n4o-databases.csv', 'utf-8')
const dbs = parse(csv, { columns: true, trim: true })

const wdquery = async url => fetch(url).then(res => res.json()).then(res => Object.values(res.entities))
/*
const items = fs.readFileSync('items.json', 'utf-8')

const items = {
  Q2430433: "OAI-PMH",
  Q1249973: "LIDO"
}

const lookup = qid => {
  if (qid in items) {
      return items[qid].prefLabel.de : qid
}
*/
// get dabases with known Wikidata identifier   
var ids = dbs.map(db => db.wikidata).filter(Boolean)

var url = wdk.getEntities({ ids })
const dbitems = await wdquery(url)
const items = dbitems.map(item => {
  const { id, labels, claims } = wdk.simplify.entity(item)
  const apis = (wdk.simplify.claims(item.claims, { keepQualifiers: true }).P6269 || [])
    .map(({value, qualifiers}) => ({
        url: value,
        protocol: qualifiers.P2700 || [],
        format: qualifiers.P2701 || [],
    }))
  return {
    name: labels.de,
    wikidata: `http://www.wikidata.org/entity/${id}`,
    publisher: claims.P98 || [],
    url: claims.P856[0],
    apis,
  }
})

// get names of referenced QIDs
ids = items.map(({apis,publisher})=>(
  [apis.map(api => [api.protocol, api.format]),...publisher])).flat(4).filter(Boolean)
url = wdk.getEntities({ ids, props: ['labels'] })
const known = {}
for (let e of (await wdquery(url))) {
    known[e.id] = e.labels.de.value
}

for (let item of items) {
  for (let api of item.apis) {
    api.format = api.format.map(qid => known[qid] || qid)
    api.protocol = api.protocol.map(qid => known[qid] || qid)
  }
  item.publisher = item.publisher.map(qid => known[qid] || qid)
}

const json = JSON.stringify(items, null, 2)
fs.writeFileSync('n4o-databases.json',json)
console.log(`Angaben zu ${items.length} Datenbanken aktulisiert.`)
