# check-contributor-allowlist-action

This action checks PR contributors against a configurable allowlist.

## Inputs

### `allowlist-path`

**Required** The path to the contributor allowlist. Default `"/doc/team.md"`.

## Outputs

Fails if a PR contributor is not listed in the contributor allowlist.

## Example usage

```yaml
uses: check-contributor-allowlist-action@v0.1
with:
  allowlist-path: /doc/team.md
```
