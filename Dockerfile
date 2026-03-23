FROM node:22-alpine3.22 AS build
WORKDIR /workspace
RUN corepack enable pnpm && corepack install -g pnpm@10.15.0

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm install -r --offline
RUN pnpm gen
RUN pnpm build-only

FROM nginx:1.29-alpine3.22
EXPOSE 80
COPY --from=build /workspace/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
