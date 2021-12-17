# Subgraph

## Test
In order to test, you need matchstick. You can use docker or the binary

### With docker

Follow https://github.com/LimeChain/matchstick#quick-start-

The first time you need to build the docker image (with `$ docker build -t matchstick .`). From that onwards, it's only necessary if you change dependencies versions.

```
$ docker run -it --rm --mount type=bind,source=<absolute/path/to/project>,target=/matchstick matchstick
```

If you get a permission error while building the docker image, use
```
$ sudo chown yours:yours -R <this-folder>/node_modules
$ chmod +r <this-folder>/node_modules/binary-install-raw/bin/0.2.2/binary-linux-20
```

## Deploy
```
$ yarn codegen
$ yarn build
$ yarn deploy
```