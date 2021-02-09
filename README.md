# wikigem
A Wikipedia proxy for the Gemini protocol.

Run `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'` to generate TLS keys for the server.

`node_modules` contains a patch to the `gemini-server` module to support async.
