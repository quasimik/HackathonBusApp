# BusBoss
_A Node.js app to improve transport provision for hackathons._

WARNING: This is currently a proof-of-concept. The biggest problem is that this doesn't have a friendly UI to import provided data yet. You can probably still use some MongoDB request generator to somehow jam your data in, who knows. Also, the statistical method might be invalid if the probability of attendees actually needing the bus is non-constant within the same sentiment bracket. If this is the case, a [poisson binomial distribution](https://en.wikipedia.org/wiki/Poisson_binomial_distribution) is needed instead of an ordinary binomial distribution. This significantly increases the complexity of the operations required.

## What?

Let's say you are organizing a hackathon. How many seats are you going to provide for transport to and from your hackathon?
Many people say they need transport, but they end up not taking the transport you provide. You can overestimate to be safe, but that's costly. On the other hand, if you underestimate, you might not have enough transport for everyone. You need a more reliable way to decide how many transport spots to provide.

Enter BusBoss.

BusBoss takes the attendees' RSVP info and applies simple statistical analysis to it, giving you a better idea of how many seats of transport you should provide for your hackathon.

## How?

In the hackathon RSVP form, get the attendees to indicate how likely they are to need transport, on a scale of 1 to 5. This option should be independent of their chances of getting in (and make sure you mention this in your RSVP form), so the response should be honest. Also, try to think of other ways to get an honest response from the attendees.

BusBoss then takes these "_sentiment_" values from past hackathons and calculates the percentage chances of people in each sentiment bracket actually needing transport.

If this is your first time running BusBoss, then you can input your own sentiment percentage values, and use actual data-based values from your next hackathon onwards.

BusBoss generates a binomial distribution of actual transport spots needed for each sentiment bracket. Then, BusBoss [approximates a normal distribution](https://en.wikipedia.org/wiki/Binomial_distribution#Normal_approximation) using these binomial distributions (you do have many people attending, right?). Then, it adds the normal distributions together to generate an overall normal distribution. BusBoss then plots the cumulative distribution function of this normal distribution, giving you a better idea of how many people actually need transport.

With BusBoss, you can quickly get the answer to questions like: "_Given that 50 people asked for transport, how likely is it that only 30 people actually need transport?_". BusBoss provides a concrete percentage answer (e.g. 95%) to such questions.

## Usage

```
npm install
```
in the project directory to install npm dependencies.

Then, run the node.js server and navigate to [server]/data-gen to generate the bogus data.
Then, navigate to [server]/graph/UCLA to see the cumulative distribution function for UCLA attendees who requested a bus.
