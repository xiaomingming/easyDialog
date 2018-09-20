#! /bin/bash
SITE_PATH='https://github.com/xiaomingming/easyDialog'
USER='admin'
USERGROUP='admin'
cd $SITE_PATH
git pull origin/dev
git push origin master
git checkout master
chown -R $USER:$USERGROUP $SITE_PATH