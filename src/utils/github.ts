import { Team, Repo, Permission, CreateTeamInput } from './types'
import { info } from '@actions/core'

export async function getOrgTeams (octokit: any, org: string): Promise<Team[]> {
  const { data, status } = await octokit.rest.teams.list({
    org,
    per_page: 100
  })

  if (status !== 200) {
    throw Error(`Failed to get org teams: ${status}\n${data}`)
  }

  return data
}

export async function getOrgRepos (octokit: any, org: string): Promise<Repo[]> {
  const { data, status } = await octokit.rest.repos.listForOrg({
    org,
    per_page: 100
  })

  if (status !== 200) {
    throw Error(`Failed to get org repos: ${status}\n${data}`)
  }

  return data
}

export async function createTeam (octokit: any, org: string, name: string, parentId: number | null): Promise<Team> {
  const opts: CreateTeamInput = {
    org,
    name,
    privacy: 'closed'
  }

  if (parentId) {
    opts.parent_team_id = parentId
  }

  const { data, status } = await octokit.rest.teams.create(opts)

  if (status !== 201) {
    throw Error(`Failed to create team ${name}: ${status}\n${data}`)
  }

  return data
}

export async function updateTeamAccess (octokit: any, teamSlug: string, org: string, repo: string, permission: Permission): Promise<void> {
  info(`teamSlug is ${teamSlug}`)
  info(`org is ${org}`)
  info(`owner is ${org}`)
  info(`repo is ${repo}`)
  info(`permission is ${permission}`)

  const { data, status } = await octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
    team_slug: teamSlug,
    org,
    owner: org,
    repo,
    permission
  })

  info(`Status is ${status}`)

  if (status !== 204) {
    throw Error(`Failed to add repo ${repo} to team ${teamSlug}: ${status}\n${data}`)
  }
}
