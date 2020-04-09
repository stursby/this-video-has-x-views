// Dependencies
const { google } = require('googleapis')
const { createInterface } = require('readline')
const { readJSON, writeJSON } = require('fs-extra')

// Constants
const SCOPES = ['https://www.googleapis.com/auth/youtube']
const TOKEN = 'token.json'
const CLIENT_ID = 'client_id.json'
const YOUTUBE_VIDEO_ID = '17uGdxLtas0'

// YouTube
const youtube = google.youtube('v3')
let auth = null

// Main function
async function init() {
  // Setup auth
  auth = await authorize()

  // Get the video view count
  const { viewCount } = await getVideoStatistics(YOUTUBE_VIDEO_ID)

  // Format the new title with view count
  const newTitle = `This video has ${viewCount} views`

  // Update the video title
  await updateVideoInfo(YOUTUBE_VIDEO_ID, {
    title: newTitle,
    categoryId: '1'
  })

  // Done!
  console.log(
    `Video title updated! https://youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`
  )
}

// Authorize
async function authorize() {
  let token = ''
  const data = await readJSON(CLIENT_ID)
  const { client_secret, client_id, redirect_uris } = data.installed
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )
  try {
    token = await readJSON(TOKEN)
  } catch (err) {
    token = await getNewToken(oauth2Client)
  }
  oauth2Client.credentials = token
  return oauth2Client
}

// Get token
function getNewToken(oauth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    console.log('Authorize this app by visiting this url: ', authUrl)

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('Enter the code from that page here: ', code => {
      rl.close()
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.err('Error while trying to retrieve access token', err)
          reject(err)
        }
        storeToken(token)
        resolve(token)
      })
    })
  })
}

// Write the JSON token to local file
async function storeToken(json) {
  try {
    await writeJSON(TOKEN, json)
  } catch (err) {
    console.error(err)
  }
}

// Get video statistics (https://developers.google.com/youtube/v3/docs/videos/list)
async function getVideoStatistics(id) {
  try {
    const { data } = await youtube.videos.list({
      id,
      auth,
      part: 'statistics'
    })
    return data.items[0].statistics
  } catch (err) {
    console.error(err)
  }
}

// Update video info (https://developers.google.com/youtube/v3/docs/videos/update)
async function updateVideoInfo(id, snippet) {
  try {
    await youtube.videos.update({
      auth,
      part: 'snippet',
      resource: {
        id,
        snippet
      }
    })
  } catch (err) {
    console.error(err)
  }
}

// Blastoff 🚀
init()
