import fs from 'fs';
import path from 'path';
import { sparqlEscapeUri, sparqlEscapeString } from 'mu';

function constructListSubjects (type, uriBase, graphs, batchSize) {
  const p = path.resolve(__dirname, './queries/1-list-subjects.sparql');
  let query = fs.readFileSync(p, { encoding: 'utf8' });
  query = query.replace('%GRAPHS', graphs.map(sparqlEscapeUri).join('\nFROM '));
  query = query.replace('%TYPE', sparqlEscapeUri(type));
  query = query.replace('%URI_BASE', sparqlEscapeString(uriBase));
  query = query.replace('%LIMIT', batchSize);
  return query;
}

function constructRewriteUris (subjects, uriBase, suffixPredicate, graphs) {
  const p = path.resolve(__dirname, './queries/2-rewrite-uris.sparql');
  let query = fs.readFileSync(p, { encoding: 'utf8' });
  query = query.replace('%GRAPHS', graphs.map(sparqlEscapeUri).join('\n        '));
  query = query.replace('%URI_BASE', sparqlEscapeString(uriBase));
  query = query.replace('%SUFFIX_PREDICATE', sparqlEscapeUri(suffixPredicate));
  query = query.replace('%SUBJECTS', subjects.map(sparqlEscapeUri).join('\n        '));
  return query;
}

export {
  constructListSubjects,
  constructRewriteUris
};
