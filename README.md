# wikigem
A Wikipedia proxy for the Gemini protocol.

Run `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'` to generate TLS keys for the server.

`gemini-server` has to be patched to support async. Run `patch -p1 < geminiserver.patch` after `npm i` to allow the code to function correctly.
