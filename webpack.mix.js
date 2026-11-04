const mix = require("laravel-mix");

mix.js("resources/js/app.js", "public/js").css(
    "resources/css/app.css",
    "resources/css/abstract.css"
    "public/css"
);
