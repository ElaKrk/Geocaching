#!/bin/bash
# rm ./src/data/db.json
# touch ./src/data/db.json

curl -d '{"location":"Warsaw"}' -H "Content-Type: application/json" -X POST http://localhost:3000/geocaching
curl -d '{"location":"Wroclaw"}' -H "Content-Type: application/json" -X POST http://localhost:3000/geocaching
curl -d '{"location":"Krakow, Dluga 72"}' -H "Content-Type: application/json" -X POST http://localhost:3000/geocaching
curl -d '{"location":"Cmisnk"}' -H "Content-Type: application/json" -X POST http://localhost:3000/geocaching
curl -d '{"location":"Piaseczno, Pulawska"}' -H "Content-Type: application/json" -X POST http://localhost:3000/geocaching

# curl -H "Content-Type: application/json" -X GET http://localhost:3000/geocaching

# curl -d '{"location":"Krakow"}' -H "Content-Type: application/json" -X PUT http://localhost:3000/geocaching/2df3991e-ee38-4934-af00-799c9ab83de4
# curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/geocaching/2df3991e-ee38-4934-af00-799c9ab83de4