Los certificados SSL se generan automáticamente al ejecutar `./install.sh`.

Si necesitas generarlos manualmente:

```bash
cd backend/certs

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -sha256 -days 365 -nodes \
  -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"
```