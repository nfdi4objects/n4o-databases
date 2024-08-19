import fs from "fs"
import { pgformat, ParsingError } from "pgraphs"

const graph = pgformat.pg.parse(fs.readFileSync("n4o-collections.pg").toString())

const nodes = {}

for (let n of graph.nodes) {
  var ld = {
      id: n.id,
      type: n.labels // TODO: how to convert to URI
  }
  for (let [key, values] of Object.entries(n.properties)) {
    if (key !== "id" && key !== "type") {
      ld[key] = values
    }
  }
  nodes[n.id] = ld
}

for (let e of graph.edges) {
  const from = (nodes[e.from] ||= {})
  from [e.labels[0]] = e.to
}

for (let nd of Object.values(nodes)) {
  console.log(JSON.stringify(ld,null,2))
}
