#!/bin/sh

# This script is looping through the *po files inside of 'language/*' directories
# and merges them with _pot_ file.
# Merging will add missing entries and fix some of them if they were changed in the pot file.

NC='\033[0m'
FAIL='\033[0;31m'
PASS='\033[0;32m'
rc=0
result=0
for d in resources/language/*/*.po; do
  printf "%-70s %s \n" "Merging ${d}"
  msgmerge "$d" resources/language/messages.pot --update --no-fuzzy-matching --no-wrap --backup=none 2> out || rc=$?
  if [ $rc = 1 ]; then
    printf "[ ${FAIL}FAIL${NC} ]\n"
    while read i; do
      printf "  %s\n" "$i"
    done < out
    result=1
  else
    printf "[ ${PASS} OK ${NC} ]\n"
  fi
  rc=0

  printf "\n"
done

rm -f out
exit $result
