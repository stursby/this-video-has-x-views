# This video has "X" views

> A YouTube bot that will update the video title to match the view count

## Setup

[TODO]

- clone
- install node deps

### Setup YouTube API

A lof of the code is copied over from [https://developers.google.com/youtube/v3/quickstart/nodejs](https://developers.google.com/youtube/v3/quickstart/nodejs).

1. Log into the Google Developers Console:

https://console.developers.google.com/

2. Create New Project

On the right side you should see a button to create a new project.

I'll name mine "This video has x views"

Next, click "Create".

3. Enable the YouTube Data API v3

Click the "Enable APIs and Services" button

Search for "YouTube" and then enable the "YouTube Data API v3"

4. Generate Credentials

Click the "Create Credentails" button and the select the following:

Which API are you using?

- YouTube Data API v3

Where will you be calling the API from?

- Other UI (eg: Windows, CLI tool)

What data will you be accessing?

- User data

5. Set up consent screen

Select "External" for the User Type

Fill out your Application Name, then hit "Save" at the very bottom

Rename the file `client_id.json`

## Run the bot

`node bot.js`

If this is the first time running the bot, it you'll be prompted in the CLI to visit a Google URL which walks you through the OAuth flow.

Once you accept all the app permissions, you'll be give a code. Enter that back into your CLI.

If successful, your video title was just updated!
