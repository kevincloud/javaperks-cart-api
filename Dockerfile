FROM ubuntu:18.04
  
LABEL Kevin Cochran "kcochran@hashicorp.com"

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y npm
RUN mkdir /app
ADD cartapi /app/

WORKDIR /app
RUN npm install

ENTRYPOINT [ "node" ]

CMD [ "app.js" ]

