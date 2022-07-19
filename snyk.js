const util = require('util')
const execPromise = util.promisify(require('child_process').execSync)

async function snykAuth () {
  const token = '72261da0-7f19-45aa-a256-ef928e30df97'
  try {
    // eslint-disable-next-line no-undef
    const authResult = ({ stdout, stderr } = await execPromise(
      'snyk auth ' + token
    ))
    return authResult
  } catch (error) {
    return error
  }
}
async function snykTest () {
  try {
    const testResult = ({ stdout, stderr } = await execPromise('snyk test'))
    return testResult
  } catch (error) {
    return error
  }
}

async function snykMonitor () {
  try {
    const testResult = ({ stdout, stderr } = await execPromise('snyk monitor'))
    return testResult
  } catch (error) {
    return error
  }
}

Promise.all([snykAuth(), snykTest(), snykMonitor()]).then(data => {
  console.log(data)
})
