# Nodebucks Admin
> The admins are the difference
---

Nodebucks Admin is a single page application using React/Redux.
- Node 10.4.1

---
## Requirements
This section assumes you have MacOS. If not, replicate steps appropriate for your OS.

### Install required pacakges
```
$ brew install node
```

## Setup
__Initialize Project__

Clone the project if you have not yet
```
$ cd ~/code
~/code $ git clone git@github.com:rolme/nodebuckshq.git
~/code $ cd nodebuckshq
```

After cloning the project and cd'ing into the directory.
```
~/code/nodebuckshq $ yarn install
```

__Update Environment__
The application will make API calls to your local server. Ex. http://localhost:3001
```
$ export REACT_APP_API_SOURCE=http://localhost:3001
```

__Start Project__
```
~/project/nodebuckshq $ yarn start
```
The application may ask you to choose a different port if you have the server running.
Visit: [http://localhost:3002](http://localhost:3002)
