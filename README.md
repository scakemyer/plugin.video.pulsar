![](http://i.imgur.com/4eQhijh.png)

[![Build Status](https://travis-ci.org/scakemyer/plugin.video.quasar.svg?branch=master)](https://travis-ci.org/scakemyer/plugin.video.quasar)
[![Join the chat at https://gitter.im/QuasarHQ/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/QuasarHQ/Lobby)

What it is
----------
Quasar is a torrent finding and streaming engine. It doesn't go on torrent websites for legal reasons. However, it calls specially crafted add-ons (called providers) that are installed separately. They are normal Kodi add-ons, and thus can be installed/updated/distributed just like any other add-on.

This project is a fork of the well known, but no longer maintained Pulsar project from [steeve](https://github.com/steeve/plugin.video.pulsar).
Big thanks for his great job.

Supported platforms
-------------------
- Windows 32/64 bits
- Linux 32/64 bits (starting Ubuntu 12.04)
- Linux ARM (Raspberry Pi, Cubox i4Pro, etc)
- OS X 64 bits
- Android ARM (4.4.x, L and M), x86 and x64 (L and M)

Download
--------
See the [Releases](https://github.com/scakemyer/plugin.video.quasar/releases) page. **Do NOT use the `Download ZIP` button on this page.**


Installation
------------
- Install Quasar like any other add-on
- Go to Settings > Services > Remote Control and **enable both options**
- Restart Kodi

Build
-----
The entire build process of Quasar is automated using Travis CI, and that's a
good thing because it's quite a complicated one with many dependencies and
repositories. Here's the stack from top to bottom:

- [quasar](https://github.com/scakemyer/quasar) - The Quasar daemon itself, built on top of the cross-compiled libtorrent-go
- [libtorrent-go](https://github.com/scakemyer/libtorrent-go) - The libtorrent library with Go bindings, built using cross-compiler
- [cross-compiler](https://github.com/scakemyer/cross-compiler) - Builds the base images to, you guessed it, cross-compile Quasar

#### Build status of each project
| quasar daemon | libtorrent-go | cross-compiler |
| ------------- | ------------- | -------------- |
| [![Build Status](https://travis-ci.org/scakemyer/quasar.svg?branch=master)](https://travis-ci.org/scakemyer/quasar) | [![Build Status](https://travis-ci.org/scakemyer/libtorrent-go.svg?branch=master)](https://travis-ci.org/scakemyer/libtorrent-go) | [![Build Status](https://travis-ci.org/scakemyer/cross-compiler.svg?branch=master)](https://travis-ci.org/scakemyer/cross-compiler) |

There are different ways to build the Quasar daemon. You can either pull the different Docker images or build it all yourself. If you want to go for the latter, start by building the cross-compiler images, then libtorrent-go, and come back to Quasar afterwards. There should be enough info in each of the projects to get you started, but you'll obviously have to dive into the code at some point.

Since the whole build process is now automated, this repository is using [pre-built binaries](https://github.com/scakemyer/quasar-binaries) from the last Quasar daemon build as a submodule. Here's how you'd build this add-on using those:
```
git clone https://github.com/scakemyer/plugin.video.quasar
cd plugin.video.quasar
git submodule update --init
make
```

How it works
------------
Quasar is a torrent finding and streaming engine. **It doesn't go on torrent websites for legal reasons**. It calls specially crafted add-ons (called **providers**) that are installed separately. They are normal Kodi add-ons, and thus can be installed/updated/distributed just like any other add-on.

Quasar is centered around media: it browses media from [TheMovieDB](https://www.themoviedb.org/) and [TheTVDB](http://thetvdb.com/).
And so, when you decide you want to watch a media (i.e. given an IMDB or TVDB Id), here's what Quasar does:

- Enumerate the installed providers
- Call each provider to find the media you want to watch (in parallel)
- Each provider returns a list of BT links they found
- Collects and de-duplicates all the links
- Goes on the BitTorrent network to find out the number of seeds and peers in real time (i.e. not provided by the provider)
- Finds out of which quality are the different links (thanks to their name)
- Ranks the links by quality and availability (Quasar privileges quality over availability, but it's not dumb. However, you can get a full list to choose from manually it you want, or enable 'Choose stream by default' to always choose manually)
- Sends the chosen link to the BitTorrent streaming engine (brand new, and completely rewritten)

All of this is done in less than 1s. Quasar is around 95% Go, and thus, it's *fast*. Very fast, actually.

The BitTorrent streaming engine is brand new and very resilient (or at least it's designed to be). It's built on top of the brand new libtorrent 1.0 (which had special patches for the streaming case). So it's very optimized, especially for low CPU machines. I have yet to find a media that doesn't play with the engine.


Providers
---------
As said before, Quasar **relies on providers to find streams**. Providers are easy to write, and average ~20 lines of Python. As they are normal Kodi add-ons, which can have their own configuration (although it is not recommended because it complicates things).

Sample Quasar provider: [https://github.com/scakemyer/script.quasar.dummy](https://github.com/scakemyer/script.quasar.dummy)

Providers are given a max amount of time to run before Quasar considers them to be too slow. The timeouts are as follow:
- 10 seconds on Intel CPUs
- 20 seconds on multi-core ARM CPUs
- 30 seconds on single core ARM CPUs (Raspberry Pi)

Please note that for legal reasons, **I won't discuss, develop nor distribute any providers connecting to illegal sources**. So there is no need to ask me.
While I can partake in general discussions regarding provider development, **I won't do so for illegal sources specific problems**.


FAQ
---
##### I can't code. How can I help?
Spread the word. Talk about it with your friends, show them, make videos, tutorials. Talk about it on social networks, blogs, etc...

##### The plugin doesn't work, what can I do?
Please search currently [open and closed issues](https://github.com/scakemyer/plugin.video.quasar/issues) to see if it has already been reported and/or fixed. If not then add a new issue with a short but descriptive title, a detailed description and of course a link to the logs. If you don't know how to do that, just follow the guide at: [http://kodi.wiki/view/Log_file/Easy](http://kodi.wiki/view/Log_file/Easy). If you actually went through the logs and know the relevant part, you can instead paste that, as long as it's shorter than a hundred lines or so, and please enclose it in triple back-quotes for readability.

##### Can I seek in a video?
Yes, but it can fail.

##### What about seeding?
When watching a torrent, **you will be seeding while you watch the stream**.

##### Does it downloads the whole file? Do I need the space? Is it ever deleted?
Yes, yes and yes.

##### Can I keep the file after watching it?
Yes, change it in the add-on settings.

##### Can I set it to download directly to my NAS?
Yes, but **you need to mount your NAS via the OS, not via Kodi**.

##### Provider X is blocked in my country/ISP, how can I set another domain?
Sorry, I won't comment of specific providers.


Screenshots
-----------
![](http://i.imgur.com/uchej1p.png)
![](http://i.imgur.com/0ybvekN.jpg)
![](http://i.imgur.com/L103Xt1.jpg)
![](http://i.imgur.com/8qSwVk1.jpg)
