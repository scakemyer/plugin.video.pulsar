Building plugin.video.elementum for release:

```
#!/bin/bash

set -e

TAG=$(git describe --tags)

export GH_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaa # This is an access token from Github
export PATH=$HOME/go/bin:/usr/lib/go-1.9/bin/:$PATH
export GOPATH=$HOME/go

git checkout master

rm -rf plugin.video.elementum

# Get current binaries, for bundling into zip files
wget https://github.com/elgatito/elementum-binaries/archive/master.zip && \
unzip master.zip && \
mv elementum-binaries-master/* resources/bin/ && \
rm -rf elementum-binaries-master && \
rm master.zip

sudo -S true

# Check if current system has all the Python modules
pip install -r requirements.txt

# Check python syntax with flake8
python -m flake8

# Check localozations, to make sure they are not broken
./scripts/xgettext.sh
make

if [[ $TAG != *-* ]]
then
    # Create zip files
	make zipfiles

    # Upload zip files with github-release
    make upload
fi

```