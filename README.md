# URI rewrite service


## Configuration

```json
{
  "batch-size": 100,
  "graphs": [
    "http://mu.semte.ch/graphs/organizations/my-organization",
  ],
  "types": [
    {
      "rdf-type": "https://data.vlaanderen.be/ns/dossier#Dossier",
      "uri-base": "http://themis.vlaanderen.be/id/dossier/",
      "suffix-predicate": "http://mu.semte.ch/vocabularies/core/uuid"
    }
  ]
}
```

```yaml
  uri-rewrite:
    build: 
    links:
      - my-triplestore-service:database
```