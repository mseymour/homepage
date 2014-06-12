# Mark Seymour's (in-progress) homepage

Just something that I was working on for a few hours initially. Right now it just has a search box that has a list-based "dropdown" selector that can be navigated by your arrow keys.

Later on I may have widgets and possibly a photographic background.

## Dependencies

### JavaScript

* jQuery 2.1.1 (included in `/js`)

### RubyGems

* sass
* susy
* bourbon
* breakpoint
* compass (--pre)

## Developing

Just run `compass watch` in your terminal and it will compile everything in `/sass` to `/css`.

Also, in order to allow automated pushes to the `gh-pages` branch, I added this to `/.git/config` under `[remote "origin"]` as per [MCSDWVL in this Stack Overflow answer about mirroring gh-pages to master](http://stackoverflow.com/a/22943952/780109):

    push = refs/heads/master:refs/heads/gh-pages
    push = refs/heads/master:refs/heads/master
