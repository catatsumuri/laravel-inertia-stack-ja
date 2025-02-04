# Laravel Inertia Stack (Japanese) Setup Guide

## 1. Clone the Repository
```sh
git clone https://github.com/catatsumuri/laravel-inertia-stack-ja.git
cd laravel-inertia-stack-ja
```

## 2. Install Composer Dependencies
```sh
docker run --rm -it -v $(pwd):/app composer install --ignore-platform-reqs
```

## 3. Set Up Environment Variables
```sh
cp .env.example .env
```
**Edit if necessary**
```env
VITE_APP_NAME="${APP_NAME}"
VITE_HMR_HOST=127.0.0.1
VITE_PORT=5173
```
※ If you do not use HMR (Hot Module Replacement), modify `VITE_HMR_HOST` accordingly.

## 4. Start the Docker Containers
```sh
./vendor/bin/sail up -d
```

## 5. Set Up the Database
```sh
./vendor/bin/sail artisan migrate:fresh --seed
```

## 6. Generate the Application Key
```sh
./vendor/bin/sail artisan key:generate
```

## 7. Install Frontend Dependencies
```sh
./vendor/bin/sail npm install
```

## 8. Start the Development Server
```sh
./vendor/bin/sail npm run dev
```
※ If not using HMR, run `npm run build` instead.

## 9. Change the Application Port (Optional)
Edit the `.env` file and set the desired port:
```env
APP_PORT=8000
```
After updating, restart Sail:
```sh
./vendor/bin/sail down
./vendor/bin/sail up -d
```

## 10. Login with Test User
- **Email:** `test@example.com`
- **Password:** `password`

Once the container is running, log in using the above credentials.
