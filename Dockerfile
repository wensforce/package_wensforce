# ---- Dependencies ----
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # ---- Build ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .


ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_API_META_BASE_URL
ARG NEXT_PUBLIC_CASHFREE_ENV
ARG NEXT_PUBLIC_META_PIXEL_ID

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_API_META_BASE_URL=$NEXT_PUBLIC_API_META_BASE_URL
ENV NEXT_PUBLIC_CASHFREE_ENV=$NEXT_PUBLIC_CASHFREE_ENV
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID

    RUN npm run build
    
    # ---- Run ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    
    EXPOSE 3000
    CMD ["node", "server.js"]