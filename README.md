# Flashcard-App-TeacherUI
Online Teacher UI for the Flashcard App

This server allows teachers to create accounts, manage decks of cards, and view student studying progress. 

## How to run

Assuming you properly used [gcloud-setup](https://github.com/Flashcard-App/gcloud-setup) to download and install, here are the steps to success. To run server.js, pass in the following arguments to `nodejs server.js`:

0. Boolean | noDBTesting: true if you don't want to connect to a database. Setting to true will mean `config/database.js` will not be read.
1. Boolean | noExternalIPTesting: true if you don't want to use an external IP, such as if you're running in a cloud provider. Setting to true will mean the server will run on `localhost:`
2. String  | externalIP: the IP address to listen on. On Google Cloud, this should be the instance's external IP address listed in the configuration panel of the machine. If `noExternalIPTesting` is set to true, put an empty string here.
 
For example:
```
nodejs server.js false false "10.0.8.2"
```
will start the server listening at whatever external IP is configured at 10.0.8.2. Note that this IP is the internal IP that should redirect to the external one. The database IP is listed in 

```
nodejs server.js true false "10.0.8.2"
```
will start the server without connecting to a DB, but listening still listening at the external IP 10.0.8.2.

```
nodejs server.js true true ""
```
will start the server without connecting to a DB nor an external IP. Instead, access the server at localhost:8080.


## TODO:

- [x] Use [Commander](https://github.com/tj/commander.js) for arguments
- [x] Make database IP accessible as a flag
- [ ] Ensure Google OAuth works properly
- [ ] Write a better README
