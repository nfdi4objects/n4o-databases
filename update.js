import fs from 'fs'
import { pgformat } from 'pgraphs'
import jsonld from 'jsonld'
import wdk from 'wikibase-sdk/wikidata.org'
import { parse } from 'csv-parse/sync'
import { TurtleSerializer } from '@rdfjs-elements/formats-pretty'

const wdquery = async query =>
    fetch(wdk.getEntities(query)).then(res => res.json()).then(res => Object.values(res.entities))

const csv = fs.readFileSync('n4o-databases.csv', 'utf-8')
const dbs = parse(csv, { columns: true, trim: true })
const context = JSON.parse(fs.readFileSync('context.json'))

// get dabases with known Wikidata identifier   
var ids = dbs.map(db => db.wikidata).filter(Boolean)

const items = (await wdquery({ ids })).map(item => {
  const { id, labels, claims } = wdk.simplify.entity(item)
  const api = (wdk.simplify.claims(item.claims, { keepQualifiers: true }).P6269 || [])
    .map(({value, qualifiers}) => ({
        url: value,
        protocol: qualifiers.P2700 || [],
        format: qualifiers.P2701 || [],
    }))
  return {
    name: labels.de,
    wikidata: 'http://www.wikidata.org/entity/' + id,
    publisher: claims.P98 || [],
    url: claims.P856?.[0],
    re3data: claims.P5874?.[0],
    api,
  }
})

// get names of referenced QIDs
ids = items.map(({api,publisher})=>(
  [api.map(api => [api.protocol, api.format]),...publisher])).flat(4).filter(Boolean)
const known = {}
for (let e of (await wdquery({ ids, props: ['labels'] }))) {
    known[e.id] = { name: e.labels.de.value, wikidata: e.id }
}

const rdf = []

for (let item of items) {
  for (let api of item.api) {
    api.format = api.format.map(qid => known[qid] || qid)
    api.protocol = api.protocol.map(qid => known[qid] || qid)
  }
  item.publisher = item.publisher.map(qid => known[qid] || qid)
}

// Serialize JSON
const json = JSON.stringify(items, null, 2)
fs.writeFileSync('n4o-databases.json',json)

// Serialize PG-JSON (TODO: simplify)
const nodes = [], edges = []
for (let item of items) {
  const properties = {
    uri: ["http://www.wikidata.org/entity/"+item.wikidata],
  }
  if (item.re3data) { properties.uri.push("https://www.re3data.org/repository/"+item.re3data) }
  if (item.url) { properties.url = [item.url] }
  if (item.label) { properties.label = [item.label] }
  nodes.push({
    id: item.wikidata,
    labels: ['Database'],
    properties
  })

  for (let p of item.publisher) {
    edges.push({
      from: item.wikidata,
      to: p.wikidata,
      labels: ["publisher"]
    })
    const properties = {}
    if (p.name) { properties.label = [p.name] }
    nodes.push({
      id: p.wikidata,
      labels: ["Agent"],
      properties
    })
  }
  // TODO: include API
}
const graph = { nodes, edges }
fs.writeFileSync('n4o-databases-pg.json', JSON.stringify(graph, null, 2))
fs.writeFileSync('n4o-databases.pg', pgformat.pg.serialize(graph))


// serializes RDF/NTriples
for (let item of items) {
  item["@context"] = context
  item.type = ['dcat:Catalog','nfdicore:DataPortal','fabio:Database']
}
const nquads = await jsonld.toRDF(items, {format: 'application/n-quads'})

console.log(`Angaben zu ${items.length} Datenbanken aktualisiert (${nquads.split("\n").length-1} RDF triple).`)

fs.writeFileSync('n4o-databases.nt',nquads)

// serialize RDF/Turtle
import ParserN3 from '@rdfjs/parser-n3'
import { Readable } from 'readable-stream'
import getStream from 'get-stream'

const prefixes = {
  "dcat": "http://www.w3.org/ns/dcat#",
  "dcterms": "http://purl.org/dc/terms/",
  "fabio": "http://purl.org/spar/fabio/",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "nfdicore": "https://nfdi.fiz-karlsruhe.de/ontology/",
  "owl": "http://www.w3.org/2002/07/owl#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "schema": "http://schema.org/",
  "skos": "http://www.w3.org/2004/02/skos/core#",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "wd": "http://www.wikidata.org/entity/",
}

const sink = new TurtleSerializer({ prefixes })
const parserN3 = new ParserN3()
const ttl = await getStream(sink.import(parserN3.import(Readable.from(nquads))))
fs.writeFileSync('n4o-databases.ttl',ttl)

