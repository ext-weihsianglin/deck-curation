#!/bin/sh
set -eu
mkdir -p build/assets
cp presentation.html build/index.html
cp presentation.html build/storyline-deck.html
cp -R assets/imported build/assets/
cp sources/prompts/rewrite-page-v7.txt build/baseline-rewrite-prompt.txt
printf 'Presentation ready: build/index.html (21 authored slides; 4.5 and 9.5 inserted, 17 removed)\n'
