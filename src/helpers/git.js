export const gitRepoRegex = /^(?:github|gitlab|bitbucket)@/
export const domains = {
  GITHUB: 'https://github.com',
  GITLAB: 'https://gitlab.com',
  BITBUCKET: 'https://bitbucket.org',
}

export function extract(path) {
  return {
    domain: domains[path.replace(/^(.*)@.*\/.*/, '$1').toUpperCase()],
    username: path.replace(/^.*@(.*)\/.*/, '$1'),
    repo: path.split('#')[0].replace(/^.*@.*\/(.*)(?:#.+)?/, '$1'),
    branch: path.indexOf('#') > -1 ? path.split('#')[1] : null,
  }
}
