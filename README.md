# check-contributor-allowlist-action

This action checks PR contributors against a configurable allowlist.

## Inputs

### `allowlist-path`

**Required** The path to the contributor allowlist. Default `"doc/team.md"`. Please follow the format in [doc/team.md](doc/team.md)

## Outputs

Fails if a PR contributor is not listed in the contributor allowlist.

## Example usage

```yaml
uses: check-contributor-allowlist-action@v0.1
with:
  allowlist-path: relative/path-to/my/team.md
  token: ${{ secrets.GITHUB_TOKEN }}
```

### Optional parameters

See `RegExp` [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) for more information/options on pattern and flags.

```
  filter_out_pattern: "author-exempted"
  filter_out_flags: "i"
```
