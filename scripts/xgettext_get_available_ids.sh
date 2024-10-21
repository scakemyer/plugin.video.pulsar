#!/usr/bin/env bash

set -o nounset
set -o errexit

firstID=$(grep msgctxt resources/language/messages.pot | grep -oP '\d+' | head -1)
lastID=$(grep msgctxt resources/language/messages.pot | grep -oP '\d+' | tail -1)

seq -w $firstID $lastID | grep -vwFf <(grep msgctxt resources/language/messages.pot | grep -oP '\d+')
