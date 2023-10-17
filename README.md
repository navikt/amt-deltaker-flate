# amt-pamelding-flate

## Test produskjonsbygg av bare mikrofrontenden lokalt med docker
1. `pnpm build`
2. `docker-compose down && docker-compose rm && docker-compose up --build`
3. Gå til http://localhost:8080/amt/amt-pamelding-flate/bundle.js