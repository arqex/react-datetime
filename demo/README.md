# react-datetime demo app

[Demo](https://YouCanBookMe.github.io/react-datetime)

#### How to Start

```bash
npm start
```

#### How to Deploy

Run "deploy" from the demo directory:

```bash
cd ~/react-datetime/demo
npm run deploy
```

#### How to Run the demo with your local changes

If you are working on some change and you want to use the demo to test them out, you have to link your local "react-datetime" directory to the demo:

```bash
cd ~/react-datetime
npm link

cd demo
npm link react-datetime

npm start
```
