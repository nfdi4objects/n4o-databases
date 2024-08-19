import fs from "fs"
import { program } from 'commander'
import jsonld from 'jsonld'
import { write } from '@jeswr/pretty-turtle'
import ParserN3 from '@rdfjs/parser-n3'
import { Readable } from 'readable-stream'

const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'))

program
  .name("jsonld2rdf")
  .argument("[file...]","JSON-LD input file")
  .option('-c, --context <file>', 'JSON-LD context document')
  .option('-p, --prefixes <file>', 'RDF Prefix map (as JSON object) for Turtle output')
  .action(async (files, options) => {

    const input = files.length ? files.map(readJSON) : readJSON(process.stdin.fd)

    if (options.context) {
      const context = readJSON(options.context)
      for (let data of input) {
        if (Array.isArray(data)) {
          data.forEach(item => (item["@context"] = context))
        } else {
          data["@context"] = context
        }
      }
    }

    const nt = (await Promise.all(input.map(
        data => jsonld.toRDF(data, {format: 'application/n-quads'})
      ))).join("\n")

    if (options.prefixes) {
      const prefixes = readJSON(options.prefixes) 
      const quads = []
      const parserN3 = new ParserN3()
      const output = parserN3.import(Readable.from(nt))
      output.on('data', quad => quads.push(quad))
        .on('end', async () => {
            console.log(await write(quads, { prefixes }))
        })
    } else {
      console.log(nt)
    }
  })

program.parse()    
