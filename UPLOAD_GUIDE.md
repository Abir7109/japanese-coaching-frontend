# 📤 Frontend Upload Guide - Without Git

Since Git is not installed on your system, follow these manual steps to upload your frontend to GitHub.

---

## ✅ Option 1: Install Git First (Recommended)

### Download & Install Git

1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run the installer with default settings
4. Restart your terminal
5. Then follow **Option 3** below

---

## ✅ Option 2: Use GitHub Desktop (Easiest)

### Step 1: Install GitHub Desktop

1. Go to: https://desktop.github.com/
2. Download and install
3. Sign in with your GitHub account

### Step 2: Add Your Repository

1. Open GitHub Desktop
2. Click **"File"** → **"Add local repository"**
3. Browse to: `C:\Users\Abir\couching_web\frontend`
4. Click **"Add repository"**

### Step 3: Initial Commit

1. You'll see all your files listed
2. In the bottom left, enter:
   - **Summary**: "Initial frontend commit"
   - **Description**: "Complete Japanese coaching frontend"
3. Click **"Commit to main"**

### Step 4: Publish to GitHub

1. Click **"Publish repository"** at the top
2. Name: `japanese-coaching-frontend`
3. Description: "Japanese Language Coaching - Frontend"
4. **IMPORTANT**: Uncheck "Keep this code private"
5. Click **"Publish repository"**

### Step 5: Deploy to GitHub Pages

Open PowerShell in the frontend folder and run:

```powershell
npm run deploy
```

✅ Your site will be live at: https://abir7109.github.io/japanese-coaching-frontend

---

## ✅ Option 3: Use Git Command Line (After Installing Git)

### Step 1: Initialize Repository

```bash
cd C:\Users\Abir\couching_web\frontend
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Commit Files

```bash
git commit -m "Initial frontend commit"
```

### Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/abir7109/japanese-coaching-frontend.git
```

### Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### Step 6: Deploy to GitHub Pages

```bash
npm run deploy
```

✅ Your site will be live at: https://abir7109.github.io/japanese-coaching-frontend

---

## ✅ Option 4: Manual Upload via GitHub Website (Not Recommended)

This is tedious for many files, but possible:

1. Go to: https://github.com/abir7109/japanese-coaching-frontend
2. Click **"uploading an existing file"**
3. Drag ALL files from `C:\Users\Abir\couching_web\frontend`
4. **EXCLUDE**: `node_modules/` and `build/` folders
5. Commit changes

Then use `npm run deploy` from PowerShell

---

## 🎯 Recommended: Use Option 2 (GitHub Desktop)

It's the easiest without installing Git separately.

---

## ⚠️ Important Files to Upload

Make sure these are included:

- [x] `src/` folder (all React files)
- [x] `public/` folder
- [x] `package.json`
- [x] `package-lock.json`
- [x] `tailwind.config.js`
- [x] `postcss.config.js`
- [x] `.gitignore`
- [ ] **DO NOT** upload `node_modules/`
- [ ] **DO NOT** upload `build/`
- [ ] **DO NOT** upload `.env` (it's in .gitignore)

---

## 🚀 After Upload - Deploy Steps

Once files are on GitHub:

```powershell
cd C:\Users\Abir\couching_web\frontend
npm run deploy
```

This will:
1. Build the production app
2. Create a `gh-pages` branch
3. Deploy to GitHub Pages

Wait 2-5 minutes, then visit:
**https://abir7109.github.io/japanese-coaching-frontend**

---

## 🔄 To Update Later

### With GitHub Desktop:
1. Make your changes
2. Commit in GitHub Desktop
3. Push to origin
4. Run `npm run deploy` in PowerShell

### With Git:
```bash
git add .
git commit -m "Your update message"
git push origin main
npm run deploy
```

---

## 📝 Quick Checklist

- [ ] Install Git OR GitHub Desktop
- [ ] Upload files to GitHub
- [ ] Run `npm run deploy`
- [ ] Wait 2-5 minutes
- [ ] Visit https://abir7109.github.io/japanese-coaching-frontend
- [ ] Test the website

---

## 🆘 Need Help?

If you encounter issues:

1. Make sure `node_modules/` is NOT uploaded
2. Check that `package.json` has the homepage field
3. Ensure repository is PUBLIC (for free GitHub Pages)
4. Wait a few minutes after deploy

---

**Next**: After frontend is deployed, we'll deploy the backend to Render! 🚀
