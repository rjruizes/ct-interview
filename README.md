
# ct-interview

This repo is my solution to an [interview exercise](https://gist.github.com/svaj/1bacdf8400910118a8275296b9f428ae) for commercetools.

### Objective

> Given a list of Etsy Shop IDs, synchronize Etsy shops' listings to several files, outputting what has been added or removed since the last run. Example output:

```
Shop ID 234234
- removed listing 234987 "Cool cat shirt"
+ added listing 98743598 "Cooler cat shirt"

Shop ID 9875
No Changes since last sync

Shop 93580
+ added listing 3094583 "Artisanal cheese"
```

### Usage

First clone the repo and set your ETSY_API_KEY environment variable. To view your API key or create an account, visit https://www.etsy.com/developers/your-apps. 
```
git clone https://github.com/rjruizes/ct-interview.git
cd ct-interview
EXPORT ETSY_API_KEY="your-api-key"
```

To run with some hardcoded Etsy shop IDs:
```
node index.js
```

To provide your own Etsy shop IDs
```
node index.js 234234 9875 93580
```


### Notes

#### Challenges you ran into

Overall, I think it is a straightforward task. I was challenged a bit on Javascript promises, which I brushed up on, but it just took a little reading.


#### Areas of the code you are most proud of

I like the two classes I made.

#### Areas of the code you are least proud of

I didn't write any tests.

#### Tradeoffs you were forced to make

`updateJSONFile` is not optimized at all, for the sake of my time. It iterates over both the old instance list and the new instance list. If I needed to optimize, I would remove duplicate entries from the second list. To remove an entry from the array, I'd want to delete it in constant time.

#### Any other notes you'd like to share

On first read of the prompt, I felt it could've been clearer. It could have told me to register with Etsy for an API key. The task was a good one, but it's not straightforward to test. I don't have shops to add and remove listings for.
