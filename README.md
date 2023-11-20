<h1 align="center">
    impactMarket subgraph
</h1>


<img src="https://storage.googleapis.com/graph-blog/_notion/952e2e1a-0732-41e2-a657-9b7f2dc337f9/headerImage/Header_BuildersDAO2x.jpg" alt="thegraph_logo_on_space" />

<p align="center">
  This subgraph is deployed on the <a href="https://thegraph.com/explorer/subgraphs/BKAHVvabuGZF8DtoB5g8VwQNv2iF54Nsz496bi11QAwy?view=Overview&chain=arbitrum-one">Decentralized Network<a/>!
</p>

<p align="center">
  <a href="https://dl.circleci.com/status-badge/redirect/gh/impactMarket/subgraph/tree/main">
    <img src="https://dl.circleci.com/status-badge/img/gh/impactMarket/subgraph/tree/main.svg?style=svg" alt="Current CircleCI build status." />
  </a>
  <a href="https://www.npmjs.com/package/@impact-market/subgraph">
    <img src="https://img.shields.io/npm/v/@impact-market/subgraph?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
</p>

## Test
In order to test, you need matchstick. You can use docker or the binary

### With docker

Follow https://github.com/LimeChain/matchstick#quick-start-

The first time you need to build the docker image (with `$ docker build -t matchstick .`). From that onwards, it's only necessary if you change dependencies versions.

```
$ docker run -it --rm --mount type=bind,source=<absolute/path/to/project>,target=/matchstick matchstick
```

## Deploy
```
$ yarn prepare:alfajores # or mainnet
$ yarn codegen
$ yarn build
$ yarn deploy:alfajores # or mainnet
```

## Generate types and pre-package
At the top of *[schema.graphql](schema.graphql)*  add
```
scalar Bytes
scalar BigDecimal
```
And then
```
$ yarn types
$ yarn package
```