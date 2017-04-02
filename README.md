# BusBoss
_A Node.js + Python app to help improve bus provision for hackathons._

Before running, use 
```
npm install
```
in the project directory to install npm dependencies.

## What?

Providing buses from various locations/campuses for people to come to your hackathon is messy.
How many seats do you wanna provide? How many people are actually gonna show up for the bus on the actual day? 
Do you run the risk of having an empty bus?

By getting a more quantized idea of how likely people are to turn up, you can get a better idea of how many seats and how many buses you should book for different locations.
BusBoss aims to help calculate an expected value of bussers, based on their RSVP info.

## How?

When RSVPing, get applicants to indicate how likely they are to use the provided bus, on a scale of 1 to 5.
Using a [Poisson Binomial distribution](https://en.wikipedia.org/wiki/Poisson_binomial_distribution), we can graph the cumulative probability curve to indicate the likelihood that x or less people will show up on the day itself. 
By giving a more concrete analysis of actual potential attendees, organizers should be better able to figure out just how many buses they need to book for a given location.

## Usage

The express and app are a simple implementation for proof-of-concept - replace at will with your own databases.

prob.py visualizes the cumulative distribution function curves of the expected turnouts for each location, based on the tallies of the RSVPed likelihoods of needing a bus.
