# GitHub Packages

The GitHub repository's Packages panel lists `@marcebollin/simplest-sdd`, a copy of the CLI published to GitHub's npm registry. The package on npmjs.org remains `simplest-sdd`, and the usual `npx simplest-sdd@latest` commands keep using npmjs.org.

## Publish a version

Publishing a stable GitHub Release triggers `.github/workflows/publish-github-package.yml`. The workflow checks out the release tag, verifies its version, runs the CLI tests, and publishes the scoped copy using GitHub's built-in workflow token. No additional token secret is needed.

For an existing release, start the workflow manually:

```sh
gh workflow run publish-github-package.yml --ref main -f tag=v0.16.0
gh run list --workflow publish-github-package.yml
```

Use an existing stable tag whose version matches its `package.json`. Each package version can be published only once; do not rerun a successful publication for the same version. Publishing an older tag manually also moves the GitHub registry's `latest` tag to that version.

For future releases, push the version commit and tag, then create the GitHub Release:

```sh
gh release create vX.Y.Z --verify-tag --generate-notes --latest
```

The workflow changes the package name only in its disposable checkout. The source repository and npmjs.org publication retain their unscoped name. npmjs.org publishing and website deployment are separate operations.

## First publication visibility

GitHub Packages initially creates npm packages as private. To display the package to everyone, open the package's **Package settings**, then **Danger Zone → Change visibility → Public**. Its `repository` metadata links it to this repository.

Even public packages in GitHub's npm registry require authentication to install. npmjs.org remains the easiest installation option for users.

See GitHub's [npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) and [package access and visibility documentation](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility).
