heroku login:token

heroku create

heroku apps
    === dazulu4@gmail.com Apps
    powerful-retreat-17804

heroku git:remote -a powerful-retreat-17804

heroku config:set REACT_APP_API_URL=https://powerful-retreat-17804-c0d7cc9439cd.herokuapp.com
heroku config:set REACT_APP_MAIL_TOKEN=91642d034ab595e0fd4bcd481b97a7b3

heroku config
    === powerful-retreat-17804 Config Vars
    REACT_APP_API_URL:    https://powerful-retreat-17804-c0d7cc9439cd.herokuapp.com
    REACT_APP_MAIL_TOKEN: 91642d034ab595e0fd4bcd481b97a7b3


git push heroku master

heroku logs --tail