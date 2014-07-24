# Little Printer Hello World Example (Node)

This is an example publication, written in Node using the [Express framework](http://expressjs.com/). The same example can also be
seen in:

* [Ruby](https://github.com/bergcloud/lp-publication-hello-world)
* [PHP](https://github.com/bergcloud/lp-hello-world-php)
* [Python](https://github.com/bergcloud/lp-hello-world-python)

This example shows how to set up and validate a form for a subscriber to
configure the publication.

Read more about this example [on the developer site](http://remote.bergcloud.com/developers/littleprinter/examples/hello_world).

## Run it

Set up dependencies with:

    $ npm install

Run the server with:

    $ grunt

You can then visit these URLs:

* `/edition/?lang=english&name=Phil&local_delivery_time=2013-11-11T12:20:30-08:00`
* `/edition/?test=true` *for validation*
* `/icon.png`
* `/meta.json`
* `/sample/`

## Deploy it

You can deploy to Heroku using the [command line tools](https://devcenter.heroku.com/articles/heroku-command) and the supplied `Procfile`:

    $ heroku create
    $ git push heroku master
    $ heroku open

This will then open your browser on the domain that Heroku creates for you:

![Deployed to Heroku](https://cloud.githubusercontent.com/assets/181611/3688297/8e58641e-1334-11e4-9e5a-81085e08a0d2.png)

The deployed application passes all of the [BERG validation](http://remote.bergcloud.com/developers/littleprinter/tools/validations):

![BERG Validator](https://cloud.githubusercontent.com/assets/181611/3688401/d3d303ae-1335-11e4-996e-d34c060af8fa.png)

----

BERG Cloud Developer documentation: http://remote.bergcloud.com/developers/
