const googlePlay = require('google-play-scraper');
const appStore = require('app-store-scraper');
const request = require('request');
const dateFormat = require('dateformat');
require('dotenv').config();

function postMessage(dialect, webhookUrl, username, channel, text){
    if(dialect == "slack"){
        postMessageToSlack(webhookUrl, username, channel, text);
    } else if(dialect == "mattermost"){
        postMessageToMattermost(webhookUrl, username, channel, text);
    } else {
        console.log("dialet should be 'slack' or 'mattemost'.");
    }
}

function postMessageToSlack(webhookUrl, username, channel, text){
    const options = {
        url: webhookUrl,
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        json: true,
        body: {
            "username": username,
            "channel": channel,
            "attachments": [
                {"text": text}
            ]
        }
    }
    request(options, function(error, response, body){
        console.log(error);
    });
}

function postMessageToMattermost(webhookUrl, username, channel, text){
    const options = {
        url: webhookUrl,
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        json: true,
        body: {
            "username": username,
            "channel": channel,
            "text": text
        }
    }
    request(options, function(error, response, body){
        console.log(error);
    });
}

function constructPostText(dialect, appScores){
    const now = new Date();
    const dateString = dateFormat(now, "yyyy年mm月dd日");
    var text;
    if(dialect == "slack"){
        text = "*" + dateString + "のストア評価*\n"
        + "Android : " + appScores["android"]["score"] + " (" + appScores["android"]["reviews"] + ")\n"
        + "iOS : " + appScores["ios"]["score"] + " (" + appScores["ios"]["reviews"] + ")"; 
    } else if(dialect == "mattermost") {
        text = "#### " + dateString + "のストア評価\n\n" 
        + "|OS|Score|Reviews|\n|---|---|---|\n" 
        + "|Android|" + appScores["android"]["score"] + "|" + appScores["android"]["reviews"] + "|\n"
        + "|iOS|" + appScores["ios"]["score"] + "|" + appScores["ios"]["reviews"] + "|\n"; 
    } else {
        text = "Error...";
        console.log("dialet should be 'slack' or 'mattemost'.");
    }
    return text;   
}

function calcIosRating(ratings){
    return (1*ratings['histogram']['1'] + 2*ratings['histogram']['2']
    + 3*ratings['histogram']['3'] + 4*ratings['histogram']['4']
    + 5*ratings['histogram']['5']) / ratings['ratings']; 
}

const androidAppId = process.env.ANDROID_APP_ID;
const iosAppId = process.env.IOS_APP_ID;
const dialect = process.env.DIALECT;
const webhookUrl = process.env.WEBHOOK_URL;
const username = process.env.USERNAME;
const channel = process.env.CHANNEL;

const androidReview = googlePlay.app({appId: androidAppId, country: 'jp'})
const iosRatings = appStore.ratings({id: iosAppId, country: 'jp'});

Promise.all([androidReview, iosRatings]).then(function(values){
    const appScores = {
        'android' :  {
            'score' : values[0]['score'],
            'reviews' : values[0]['reviews']
        },
        'ios' : {
            'score' : calcIosRating(values[1]),
            'reviews' : values[1]['ratings']
        }
    };
    const text = constructPostText(dialect, appScores);
    postMessage(dialect, webhookUrl, username, channel, text);
});