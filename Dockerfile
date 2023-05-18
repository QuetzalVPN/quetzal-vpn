FROM node:18-alpine AS frontend
ENV NODE_ENV=production
WORKDIR /app
COPY ./frontend /app
RUN npm install --include=dev && npm cache clean --force
RUN npm run build

#FROM gradle:7-jdk11 AS build
#COPY --chown=gradle:gradle . /home/gradle/src/
#COPY --from=frontend --chown=gradle:gradle /app/frontend/build /home/gradle/src/src/main/resources/frontend
#WORKDIR /home/gradle/src
#RUN gradle buildFatJar

FROM amazoncorretto:11-al2023-headless
RUN yum install -y tar gzip wget openssl \
    && cd /tmp \
    && wget https://github.com/OpenVPN/easy-rsa/releases/download/v3.1.2/EasyRSA-3.1.2.tgz \
    && tar -xzf EasyRSA-3.1.2.tgz \
    && mv EasyRSA-3.1.2 /usr/share/easy-rsa \
    && ln -s /usr/share/easy-rsa/easyrsa /usr/bin/easyrsa
EXPOSE 8080:8080
RUN mkdir /app
COPY ./build/libs/quetzal-vpn-all.jar /app/server.jar
COPY --from=frontend /app/dist /app/frontend
ENV FRONTEND_BUILD_PATH=/app/frontend
ENTRYPOINT ["java","-jar","/app/server.jar"]