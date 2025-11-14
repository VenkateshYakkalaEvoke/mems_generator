# Instant DB Schema Configuration

To set up your Instant DB database, you need to configure the following schema in your Instant DB dashboard.

## Tables

### users
- `id` (string, auto-generated)
- `email` (string, unique, required)
- `username` (string, required)
- `createdAt` (number/timestamp, auto-generated)

### memes
- `id` (string, auto-generated)
- `imageData` (string, required) - base64 encoded image
- `userId` (string, reference to users.id, required)
- `createdAt` (number/timestamp, auto-generated)
- `likes` (number, default: 0)

## Relationships

- `memes.userId` → `users.id` (foreign key relationship)

## Setup Instructions

1. Go to your Instant DB dashboard
2. Navigate to Schema section
3. Create the `users` table with the fields above
4. Create the `memes` table with the fields above
5. Set up the relationship between `memes.userId` and `users.id`
6. Ensure authentication is enabled for your app

## App ID

Your Instant DB App ID: `6c940c8e-de25-4b56-a7ec-cec7a0de9a16`

This is already configured in `js/config.js`.

