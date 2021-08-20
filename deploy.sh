#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd client

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# create a new git repository
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:derdis14/ethereum-dapp-moon-kitties.git master:gh-pages

# delete the new git repository
rm -r -f .git

# jump back to last location
cd -
