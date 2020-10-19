
// Dependencies =========================
const config = require('./config');
const twit =  require('twit');

const Twitter = new twit(config);

//RETWEET BOT ==========================

//find latest tweet according the query 'q' in params
const retweet = (param) => {
    const params = {
        q: `${param} -filter:retweets -filter:replies`, // REQUIRED
        result_type: 'recent',
        lang: 'en'
    };
    Twitter.get('search/tweets', params, (err, {statuses}) => {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            const retweetId = statuses[0].id_str;
            // Tell TWITTER to retweet, limitation is 400 tweet every 15 min
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, (err, response) => {
                // if there was an error while tweeting
                if (err) {
                    console.log('Duplication found not retweeting');
                } else {
                  console.log('Retweeted!!!');
                  // Tell TWITTER to like, limitation is 1000 likes per day.
                  Twitter.post('favorites/create', {
                    id: retweetId
                  }, (err, response) => {
                    // if there was an error while 'favorite'
                    if(err){
                      console.log('Error while liking');
                    }
                    else{
                      console.log('Liked!!!');
                    }
                  });
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log(err);
          console.log('Something went wrong while SEARCHING...');
        }
    });
};

// grab & retweet as soon as program is running...
retweet('#BTS OR @BTS_twt');
// retweet in every 90 second
setInterval(() => {
 retweet('#BTS OR @BTS_twt');
}, 90000);
// retweet in every 100 sec from BTS_twt, bts_bighit, charts_k if there are any.
setInterval(() => {
  retweet('from:BTS_twt OR from:bts_bighit OR from:charts_k')
}, 100000);
