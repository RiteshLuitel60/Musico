## ⚠️ Note

> You need API access to run this app locally.  
> However, a **demo video** showing how the app works is available in this repository.  
> Check the video to get a full walkthrough of Musico’s features and interface.


# 🎵 Musico – Web-Based Music Streaming Platform

Musico is a modern web-based music streaming application offering:

- An extensive music library  
- Personalized music recommendations  
- Real-time music recognition  
- Playlist and library management  

---

## 🖥️ System Requirements

**Minimum Requirements**:
- Modern browser: Chrome 90+, Firefox 88+, Safari 14+  
- Stable internet connection (min. 1 Mbps)  
- Audio output device  
- 4GB RAM recommended  

---

## 🚀 Getting Started

### 1. Account Creation

**Sign Up Options**:
- Google Account: Follow prompts to authenticate  
- Email/Password: Provide email, password, and full name

---

## 🧭 User Interface

### 1. Navigation Bar (`src/components/Sidebar.jsx`)
- Home / Discover  
- Around You (location-based)  
- Top Artists  
- Top Charts  
- Library  
- Recognized Songs  

### 2. Music Player (`src/components/MusicPlayer/index.jsx`)
**Main Controls**:
- Play/Pause, Next/Previous, Volume, Progress, Shuffle, Repeat

**Track Info**:
- Title, Artist, Album artwork, Duration, Current time

---

## 🔑 Core Features

### 1. Play Songs  
- Hover over a track and click the play button  

### 2. Music Discovery (`src/pages/Discover.jsx`)
- **Browse by Genre**: Pop, Hip-Hop, Dance, Rock, K-Pop, etc.  
- **Top Charts**: Navigate via Top Charts menu  
- **Top Artists**: Navigate via Top Artists menu

### 3. Library Management (`src/utils/libraryUtils.js`)
- **Create Library**: Add new libraries with custom names  
- **Add Songs**: Use the “...” menu → Add to Playlist  
- **Remove Songs**: From playlist “...” menu → Remove  
- **Rename/Delete Playlist**: From library “...” menu

---

## 🔍 Search & Details

### 1. Search (`src/redux/services/shazamCore.js`)
- Enter song title or artist name in the search bar

### 2. Song & Artist Details
- Click on a song or artist name to view more info

---

## 🔎 Advanced Features

### 1. Music Recognition
- Click floating **Recognize** button  
- Grant microphone access  
- Play music for 8–15 seconds to identify  
- View & save recognized songs

### 2. Recognition History
- Access via **Recognized Songs** in the menu  
- View, add to playlist, or like recognized songs

---

## 🔓 Logout

- Click **Logout** from the navigation panel

---

## 🛠 Troubleshooting

### 1. Playback Issues
- Check internet  
- Clear cache  
- Disable ad blockers  
- Update browser  
- Check system volume  

### 2. Login Issues
- Reset password  
- Clear cookies  
- Try incognito mode  
- Contact support  

---

## ❓ FAQ

**Q: How do I change my password?**  
A: Contact [support@musico.com](mailto:support@musico.com)

**Q: Can I use Musico offline?**  
A: Not currently available

---

## 📩 Contact

**Technical Support**: [support@musico.com](mailto:support@musico.com)

