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
EXPOSE 8080:8080
RUN mkdir /app
COPY ./build/libs/quetzal-vpn-all.jar /app/server.jar
COPY --from=frontend /app/dist /app/frontend
ENV FRONTEND_BUILD_PATH=/app/frontend
ENTRYPOINT ["java","-jar","/app/server.jar"]