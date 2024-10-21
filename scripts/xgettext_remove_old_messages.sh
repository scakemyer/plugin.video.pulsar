#!/usr/bin/env bash

set -o nounset
set -o errexit

which rg > /dev/null || (echo "No ripgrep found, exit" && exit 1)
[[ ! -d ../elementum ]] && (echo "No elementum folder found, exit" && exit 1)

grep -oP 'msgctxt "#\K\d+' resources/language/messages.pot > ids.pot

while read -r line; do rg -q -g '!*.po' -g '!*.pot' $line . || echo $line; done < ids.pot > orphaned_ids.pot

while read -r line; do rg -q -g '!*.po' -g '!*.pot' $line ../elementum || echo $line; done < orphaned_ids.pot > not_found_ids.pot

while read -r line
do
    sed -i "/$line/,+3d" resources/language/messages.pot
done < not_found_ids.pot

# from https://stackoverflow.com/questions/10435926/how-to-automatcially-remove-unused-gettext-strings/26469640
for file in resources/language/*/*.po
do
    msgattrib --no-wrap --set-obsolete --ignore-file=resources/language/messages.pot -o "$file" "$file"
    msgattrib --no-wrap --no-obsolete -o "$file" "$file"
done

rm -f ids.pot orphaned_ids.pot not_found_ids.pot
