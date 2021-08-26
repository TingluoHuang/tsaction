import * as core from '@actions/core'
import {wait} from './wait'
import jwtDecode, {JwtPayload} from 'jwt-decode'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    const token1 = await core.getIDToken()
    const decoded1 = jwtDecode<JwtPayload>(token1)
    core.info(decoded1.sub || 'Bad')
    core.info(decoded1.aud?.toString() || 'Bad Aud')

    const token2 = await core.getIDToken('api://AzureADTokenExchange')
    const decoded2 = jwtDecode<JwtPayload>(token2)
    core.info(decoded2.sub || 'Bad')
    core.info(decoded2.aud?.toString() || 'Bad Aud')

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
