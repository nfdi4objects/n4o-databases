import fs from "fs"
import { program } from 'commander'
import jsonld from 'jsonld'
import { write } from '@jeswr/pretty-turtle'
import ParserN3 from '@rdfjs/parser-n3'
import { Readable } from 'readable-stream'

const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'))

program
  .name("jsonld2rdf")
  .argument("[file]","JSON-LD input file (- for stdin)")
  .option('-c, --context <file>', 'JSON-LD context document')
  .option('-p, --prefixes <file>', 'RDF Prefix map (as JSON object) for Turtle output')
  .action(async (file, options) => {
    file = (!file || file == '-') ?  process.stdin.fd : file
    const data = readJSON(file) 

    if (options.context) {
      const context = readJSON(options.context)
      if (Array.isArray(data)) {
        data.forEach(item => (item["@context"] = context))
      } else {
        data["@context"] = context
      }
    }

    const nt = await jsonld.toRDF(data, {format: 'application/n-quads'})

    // pretty-print Turtle
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
