# Quick Start Guide - Running Tests

## Problem
```
Unable to connect to "http://localhost:4444/wd/hub",
make sure browser driver is running on that address.
```

This means **no WebDriver is running**. Choose one method below to fix it.

---

## ✅ Solution 1: Using Local ChromeDriver (Easiest) 🚗

**No Docker needed. Runs directly on your machine.**

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Create .env file
```bash
cp .env.example .env
```

Edit `.env` and make sure:
```
USE_DOCKER=false
```

### Step 3: Run tests
```bash
npm test
```

✅ **Done!** WebdriverIO will auto-start ChromeDriver.

---

## ✅ Solution 2: Using Docker Selenium Chrome 🐳

**Better for CI/CD and repeatability. Requires Docker.**

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Create .env file
```bash
cp .env.example .env
```

Edit `.env`:
```
USE_DOCKER=true
BASE_URL=https://practice.saucedemo.com
```

### Step 3: Start Docker services
In one terminal:
```bash
docker-compose up
```

### Step 4: Run tests in another terminal
```bash
npm test
```

Or run directly with Docker:
```bash
npm run test:docker
```

✅ **Done!** Tests will run in Docker container.

---

## 🔍 How to Know Which One to Use?

| Factor | ChromeDriver | Docker |
|--------|-------------|--------|
| Setup time | 2 minutes | 5-10 minutes |
| Resources | Uses your machine | Uses containers |
| CI/CD | ⚠️ Not recommended | ✅ Perfect |
| Windows/Mac/Linux | ✅ All work | ✅ All work |
| Reproducibility | ⚠️ Machine-specific | ✅ Reproducible |

**For local testing:** Use ChromeDriver (Option 1)
**For CI/CD/team:** Use Docker (Option 2)

---

## 📋 Complete Setup from Scratch

### Option A: Local ChromeDriver Setup
```bash
# 1. Clone repo
git clone https://github.com/Ganesh509/WebdriverIO_BDD.git
cd WebdriverIO_BDD

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env

# 4. Verify installation
npm run lint

# 5. Run your first test
npm test

# 6. View report
npm run report:allure
```

### Option B: Docker Setup
```bash
# 1. Clone repo
git clone https://github.com/Ganesh509/WebdriverIO_BDD.git
cd WebdriverIO_BDD

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env

# 4. Edit .env - set USE_DOCKER=true

# 5. Start services
docker-compose up

# 6. In another terminal, run tests
npm test

# 7. View report
npm run report:allure

# 8. Stop services when done
docker-compose down
```

---

## 🚀 Common Commands

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run with Docker
npm run test:docker

# View report
npm run report:allure

# Check code quality
npm run lint

# Format code
npm run format
```

---

## ✅ Verify Setup Works

Run this to test everything:

```bash
# Should show no errors
npm run lint

# Should parse features (dry-run)
npm test -- --dry-run

# Should work
npm test
```

---

## 🐛 Troubleshooting

### Still getting connection error?

**If using Local ChromeDriver:**
```bash
# Check if ChromeDriver is set to auto-start in wdio.conf.js
# Make sure USE_DOCKER=false in .env
# Try: npm install again
```

**If using Docker:**
```bash
# Make sure Docker is running
docker ps

# Start services
docker-compose up chrome -d

# Verify Chrome is running
curl http://localhost:4444/status

# Then run tests
npm test
```

### "Port already in use"?
```bash
# Find process on port 4444
lsof -i :4444

# Kill it
kill -9 <PID>

# Or use different port in .env
SELENIUM_PORT=4445
```

### Tests timeout?
```bash
# Increase timeout in .env
WAIT_FOR_TIMEOUT=15000
```

---

## 📚 Next Steps

After setup works, read:
- **README.md** - Full documentation
- **CLAUDE.md** - Framework standards
- **REFERENCE.md** - Available methods

---

## 💡 Pro Tips

- ✅ Always `npm install` after pulling new code
- ✅ Use `npm run lint` before committing
- ✅ Check `.env` file exists after `cp .env.example .env`
- ✅ Docker images first-time setup takes 1-2 minutes
- ✅ Chrome headless mode is default (faster)

---

**You're ready to run tests! 🚀**

Choose **Option 1 (ChromeDriver)** for the quickest start.
