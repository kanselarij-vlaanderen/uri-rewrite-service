import fs from 'fs';
import { query, update } from 'mu';
import * as queries from './construct-queries';
import { parseSparqlResults } from './util';

const CONFIG_LOCATION = '/config.json';

function readConfig (location) {
  const configText = fs.readFileSync(location, { encoding: 'utf8' });
  const config = JSON.parse(configText);
  return config;
}

async function rewriteUrisOfType (type, uriBase, suffixPredicate, graphs, batchSize) {
  console.log(`Rewriting URI's for type ${type} (batch size ${batchSize})`);
  let i = 1;
  while (true) {
    console.log(`Batch ${i} ...`);
    const items = await rewriteBatch(type, uriBase, suffixPredicate, graphs, batchSize);
    i++;
    if (items.length < batchSize) {
      console.log(`Done rewriting for type ${type}`);
      break;
    }
  }
}

async function rewriteBatch (type, uriBase, suffixPredicate, graphs, batchSize) {
  const listSubjectsQuery = queries.constructListSubjects(type, uriBase, graphs, batchSize);
  const queryResult = parseSparqlResults(await query(listSubjectsQuery));
  const subjectUris = queryResult.map((r) => r.subject);

  if (subjectUris.length) {
    const rewriteQuery = queries.constructRewriteUris(subjectUris, uriBase, suffixPredicate, graphs);
    await update(rewriteQuery);
  }
  return subjectUris;
}

// Begin execution here
(async function () {
  console.log('Reading config ...');
  const config = readConfig(CONFIG_LOCATION);
  const BATCH_SIZE = config['batch-size'] || 200;
  for (const typeConfig of config.types) {
    await rewriteUrisOfType(typeConfig['rdf-type'],
      typeConfig['uri-base'],
      typeConfig['suffix-predicate'],
      config.graphs,
      BATCH_SIZE);
  }
}());
