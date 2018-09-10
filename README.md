# NodebucksHQ
> Admin are for bucking nodes.
---

NodebucksHQ is a React single page application using Redux.
- Node 10.10
- NPM 6.2
- Yarn 1.9.4

---
## Requirements
This section assumes you have MacOS. If not, replicate steps appropriate for your OS.

### Install required pacakges
```
$ brew install node
```

### Update your node version
```
$ npm install --global n
$ n 10.10.0
$ npm install --global yarn@^1.9.4
```

## Setup
__Initialize Project__

Clone the project if you have not yet
```
$ git clone git@github.com:rolme/nodebuckshq.git
$ cd nodebuckshq
```

__Enviroment Setup__
Prior to running, you will need to setup your local environment variable(s)
```
# Make a copy of .env.local.template
~/nodebuckshq $ cp .env.local.template .env.local
```

After cloning the project and cd'ing into the directory.
```
~/nodebuckshq $ yarn install
```

__Start Project__
```
~/nodebuckshq $ yarn start
```

If you want to use a local instance of Nodebucks
```
# edit .env.local and replace the value to your local instance
REACT_APP_NODEBUCKS_API=http://localhost:3000
```

The application should automatically start or you can visit it here:
Visit: [https://localhost:3000](https://localhost:3000)

## Running the tests
And run the following command:
```
~/nodebuckshq $ npm run test
```
