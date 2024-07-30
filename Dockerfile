# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

FROM node:20.8.1-alpine as builder

################################################################################
# Use node image for base image for all stages.
# FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app


COPY package.json package-lock.json ./
# COPY .npmrc ./
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build
# RUN npm run copy-assets
CMD npm run start:dev
