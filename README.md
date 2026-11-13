# Exercise Tracker

## Introduction
Track your exercise records in `records.yaml` and view them in the web frontend.
The frontend is read-only: it displays your all-time totals, personal bests, charts,
and the full daily log. To add or change a record, edit `records.yaml`; all-time
totals and single-activity records are generated from its daily log.

Once you have enough data, track your progress (or your decline) on the 'Data' page.

Great! Unfortunately, there aren't many features at the moment, but as soon as I can muster up the energy,
I'll start to implement some of the more interesting features. For example, I am going to add a radar chart
that displays your physical capabilities in comparison to the average person. That way you can see how
weak or strong you are compared to most the people that are at your age. And of course, it wouldn't be a
'modern day' application without those funky animations and transitions so I'll add that too.

## How to use
From the root directory, go to the frontend folder and run:
`npm install`
`npm start`

`npm start` (and `npm run build`) runs the sync script, which generates
`frontend/public/records.yaml` from the repository's `records.yaml`. It calculates
all-time totals, best-in-one-day records and personal bests from the daily log.
Push-up and pull-up personal bests use the largest set in `breakdown`; entries with
only a session `count` or `total` are not treated as single-set records. Bouldering
uses the highest grade.
Restart the dev server after editing `records.yaml` to regenerate the frontend
data. Note that you need to have NPM installed to do this.

