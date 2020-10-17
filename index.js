
// Dependencies =========================
const config = require('./config');
const twit =  require('twit');

const Twitter = new twit(config);

//RETWEET BOT ==========================

//find latest tweet according the query 'q' in params
const retweet = () => {
    const params = {
        q: '#BTS OR @BTS_twt',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    };
    Twitter.get('search/tweets', params, (err, {statuses}) => {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            const retweetId = statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, (err, response) => {
                // if there was an error while tweeting
                if (err) {
                    console.log('Duplication found not retweeting');
                } else {
                  console.log('Retweeted!!!');
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
retweet();
// retweet in every 10 second
setInterval(retweet, 10000);
