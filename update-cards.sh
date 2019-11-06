#!/bin/bash

cd config/www

load_card() {
  local sha=$(git ls-remote https://github.com/${1}.git HEAD | head -1 | cut -f 1)
  local short=$(echo $sha | cut -c1-8)
  echo $short $2
  curl -sSO "https://raw.githubusercontent.com/${1}/${sha}/${2}"
}

load_card "maykar/compact-custom-header" "compact-custom-header.js"
load_card "thomasloven/lovelace-card-tools" "card-tools.js"
load_card "thomasloven/lovelace-layout-card" "layout-card.js"

cd -
