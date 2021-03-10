# URI rewrite service

## Configuration

A `config.json`-file is used to configure which URI's need to be re-written. This config-file should be mounted in the containers' root folder.

- The `graphs`-part specifies in which graphs the service can perform re-writes. 
- The rewrite is a batched operation. `batch-size` allows tweaking the batch size to your DB/dataset. `100` works well for us.
- `types` is an array objects. Each object contains the rewrite instructions for a certain rdf type.
  - `rdf-type`: specify the rdf-type of uri's to be rewritten
  - `uri-base`: specifies how the first portion (the static part) of the URI should look
  - `suffix-predicate`: predicate that needs to be used to look up the dynamic portion of the uri.

example: 
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

### docker-compose snippet

```yaml
  uri-rewrite:
    build: https://github.com/kanselarij-vlaanderen/uri-rewrite-service.git
    volumes:
      - "/data/my-project/config.json:/config.json"
    links:
      - my-triplestore-service:database
```

## Limitations

- The scope of the rewrite is limited to URI's in the **"subject"- or "object"-part** of a certain triple. URI's in the **"predicate"-part won't be affected**.
- This service rewrites URI's based on the rdf type of the resource they identify. Resource that don't have a type (within the graphs you specified) won't be affected.
- All URI's of a certain type will be affected. In some cases -think of the `share://` uri's originating from files created by the [mu-file-service](https://github.com/mu-semtech/file-service)- this might not be desired.