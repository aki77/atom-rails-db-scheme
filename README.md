# Rails DB Scheme

Autocomplete+ provider for Rails db schema.

## Features

**Autocomplete activerecord**

![A screenshot](https://i.gyazo.com/5dc09fb3ac9d18881e6d7e32d244698c.gif)

**Open schema file depending on current context**

![A screenshot](https://i.gyazo.com/7657febab1170ca47deaac26a577de4c.gif)

## Keymap

No keymap by default.

edit `~/.atom/keymap.cson`

```coffeescript
'atom-text-editor[data-grammar~="ruby"]':
  'ctrl-r s': 'rails-db-scheme:open-scheme'
```

## TODO

- [ ] Watch schema file
- [ ] Multi-Folder Projects
