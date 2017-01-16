#!/bin/sh
NC='\033[0m'
FAIL='\033[0;31m'
PASS='\033[0;32m'
rc=0
result=0
for d in resources/language/*/*.po; do
  printf "%-70s %s" "Checking ${d}"
  xgettext "$d" 2> out || rc=$?
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
done
rm -f messages.po
rm -f out
exit $result
