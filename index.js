import * as core from '@actions/core'
import * as github from '@actions/github'
import { readFile } from 'fs/promises'

const validEvent = ['pull_request']

async function content(path) {  
  return await readFile(path, 'utf8')
}

try {
  const { eventName, payload: {repository: repo, pull_request: pr} } = github.context
  const allowlist_path = core.getInput('allowlist-path');

  if (validEvent.indexOf(eventName) < 0) {
    core.error(`Invalid event: ${eventName}`)
  } else {
    const token = core.getInput('token')
    const filterOutPattern = core.getInput('filter_out_pattern')
    const filterOutFlags = core.getInput('filter_out_flags')
    const octokit = github.getOctokit(token)
  
    core.debug(`owner: ${repo.owner.login}`);
    core.debug(`repo: ${repo.name}`);
    core.debug(`pull_number: ${pr.number}`);
    let { data: commits } = await octokit.rest.pulls.listCommits({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
    });
    
    if (filterOutPattern) {
      const regex = new RegExp(filterOutPattern, filterOutFlags)
      commits = commits.filter(({ author }) => {
        core.debug(`commits.author`, author);
        return !regex.test(author.login)
      })
    }

    core.debug(`commits: ${JSON.stringify(commits, null, 2)}`);
    let commit_authors = commits.map((commit) => commit.author.login).reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      [],
    );
  
    console.log(`The commits authors: ${JSON.stringify(commit_authors, null, 2)}`);

    const allowlist = await content(`./${allowlist_path}`);
    
    let unknown_authors = commit_authors.filter((author) => {
      const regex = new RegExp(`@${author}`, "i");
      return !regex.test(allowlist);
    })

    console.log('Unknown authors:', unknown_authors);
    if (unknown_authors.length > 0) {
      core.setFailed(`Commits were authored by individuals not added to the allowlist at ${allowlist_path}. Please add them and commit the change to this PR.`)
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
