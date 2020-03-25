/* eslint-disable no-console */

const tag = 'SCID: '

function getAssetUrls() {
  const assetRegex = /https:\/\/a-v2\.sndcdn\.com\/assets\/[0-9a-z-]+\.js/gm
  const matches = document.body.innerHTML.matchAll(assetRegex)
  return [...matches].map((match) => match[0])
}

function fetchUrl(url, method = 'GET', responseType = 'json') {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      responseType,
      onload: (result) => {
        if (result.status === 200) {
          resolve(result.response)
        } else {
          reject(result.status)
        }
      },
      onerror: (error) => reject(error),
    })
  })
}

async function getClientId(assetUrl) {
  const response = await fetchUrl(assetUrl, 'GET', 'text')

  const clientIdRegex = /{\s*client_id:\s*"([^"]+)"\s*}/
  const match = clientIdRegex.exec(response)
  if (!match) return null
  return match[1]
}

async function postClientId(clientId) {
  console.log(tag, 'Posting client_id...')
  const url = `https://jake.cafe/api/sc/add?clientId=${encodeURIComponent(
    clientId
  )}`
  return fetchUrl(url)
    .then((response) => {
      console.log(tag, 'Successfully posted!')
      return response
    })
    .catch((err) => {
      console.log(tag, 'Failed to post.')
      throw err
    })
}

function main() {
  const assetUrls = getAssetUrls()
  const clientId = assetUrls.find(getClientId)
  if (clientId) {
    console.log(tag, 'Found client_id!')
    postClientId(clientId)
  } else {
    console.log(tag, 'No client_id found.')
  }
}

main()
