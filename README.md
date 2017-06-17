# Rails DB Scheme

Autocomplete+ provider for Rails db schema.

## Features

**Autocomplete activerecord**

![A screenshot](https://i.gyazo.com/5dc09fb3ac9d18881e6d7e32d244698c.gif)

**Open schema file depending on current context**

![A screenshot](https://i.gyazo.com/7657febab1170ca47deaac26a577de4c.gif)

## Settings
Set Rails syntax as default.
```coffeescript
"*":
  core:
    customFileTypes:
      "source.ruby.rails": [
        "rb"
      ]
```

## Keymap

No keymap by default.

edit `~/.atom/keymap.cson`

```coffeescript
'atom-workspace':
  'ctrl-r s': 'rails-db-scheme:open-scheme'
```

## TODO

- [ ] Multi-Folder Projects
