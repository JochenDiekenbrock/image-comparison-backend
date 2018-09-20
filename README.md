# Image comparison backend

The image comparison backend works together with the
[image comparison frontend](https://github.com/jochendiekenbrock/image-comparison-frontend)
to provide the creation and management of automated image comparisons in an continous 
integration environment.

The image comparison frontend is used in end to end tests run in the CI environment to 
take images during the test
and compare these images to base images that are known to be correct. The frontend stores
these images together with test result information and difference images, if applicable.
If a test fails, the CI process should report this.

Using the image comparison backend, the test results can be evaluated. If the comparison failed
because of a bug, a developer can fix this and the CI should report now that the comparison no longer fails.
If the comparison failed but the new image is correct, perhaps because of a new feature,
the image comparison backend offers an option to accept the new image. The test result will be updated 
and the new image will be used from now on as new base image.

Requirements:
 * Node v8
 * Docker

## Getting Started
```sh
yarn install
yarn start
```

## License

[GPL-3.0-or-later](./LICENSE.txt)
