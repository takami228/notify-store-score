# notify store score

This application post your mobile application's scores distributed in Goole Play and AppStore using npm modules([google-play-scraper](https://www.npmjs.com/package/google-play-scraper), [app-store-scraper](https://www.npmjs.com/package/app-store-scraper)).

# Requirements

- Node.js
- Slack or Mattermost webhook URL
  - [Slack](https://my.slack.com/services/new/incoming-webhook)
  - [Mattermost](https://docs.mattermost.com/developer/webhooks-incoming.html)

# Settings

Set envirment variables in `.env` file.

|name|value|Example|
|---|---|---|
|ANDROID_APP_ID| Your Android App Id | com.example.yourapp |
|IOS_APP_ID| Your iOS App Id | 123456789 (without prefix "id")|
|DIALECT| Notification Chat Application | `slack` or `mattermost`|
|WEBHOOK_URL| slack or mattermost webhook url | https://hooks.slack.com/services/xxxx/yyyy <br> https://mattermost.hostname/hooks/xxxxxx |
|UERNAME| Notification usename in your Chat Application | StoreScoreNotifier |
|CHANNEL| Notification Channel in your Chat Application | bot|

```
# .env file
ANDROID_APP_ID=com.example.yourapp
IOS_APP_ID=123456789
DIALECT=slack
WEBHOOK_URL=https://hooks.slack.com/services/xxxx/yyyy
USERNAME=StoreScoreNotifier
CHANNEL=bot
```

# How to run

Install packages and run apps.

```
# install packages
$ package install

# run
$ node app.js
```

# Daily CI settings

You can set this application in CI Runner and set daily job.

## GitLab CI Sample

```yml
dailyScoreNotifier:
  stage: build
  tags:
    - ci-runner-name
  script:
    - npm install
    - node app.js
  only:
    - schedules
```

# ToDo

- Dockerize application 
