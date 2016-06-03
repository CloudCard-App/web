# Flashcard-App-TeacherUI
Online Teacher UI for the Flashcard App

[![Build Status](https://travis-ci.org/Flashcard-App/Flashcard-App-TeacherUI.svg?branch=master)](https://travis-ci.org/Flashcard-App/Flashcard-App-TeacherUI)

This server allows teachers to create accounts, manage decks of cards, and view student studying progress. 

## How to run

Assuming you properly used [gcloud-setup](https://github.com/Flashcard-App/gcloud-setup) to download and install, here are the steps to success. To start, run `node server.js` these flags: 

```
Usage: server [options]
  Options:
    -h, --help               output usage information
    -d --dbIP <dbIP>         Internal IP address of database (mongodb://localhost:27017 by default)
    -e --extIP <externalIP>  External IP address (localhost by default)
    -p --port <port>         Port to listen on (80 by default)
```

For example:

```
sudo node server.js -d 10.128.0.3:8080 -e 10.128.0.2 -p 80
```

will start my server:
* Connects to MongoDB server running at 10.128.0.3:8080
* Listens on external IP address of 10.128.0.2
* Listening on port 80
