# MyNaksh AI Conversation Experience

A production-ready, modular React Native (Expo & Web) chat application designed for AI-driven conversational experiences. Built using TypeScript, React Context API, and an dynamic **Recommendation Registry Pattern** that allows flexible extension of interactive UI cards within chat messages.

---

##  Key Features

* **Dynamic Recommendation Framework**: Extensible Registry Pattern allowing dynamic injection of recommendation cards (`gemstone`, `tarot`, `consultation`, `article`, `promotion`) inside message payloads.
* **Timeline & Multi-Bubble Architecture**: Supports multiple distinct message views including System Announcements, AI Responses with embedded scrollable recommendations, User Prompts, and Human Astrologer notes.
* **Interactive AI Feedback System**: Integrated Thumbs Up/Down feedback mechanisms with expandable categorical reason chips (`Inaccurate`, `Too Generic`, `Didn't Help`, `Too Long`).
* **Message Context & Actions**: Long-press overlay menu supporting Message Reply preview banners, Clipboard copying (`expo-clipboard`), and optimistic Deletion.
* **Optimistic Updates & Mock AI Responses**: Real-time sending states (`Sending...` $\rightarrow$ `✓ Sent`) accompanied by automated simulated AI responses to demonstrate dynamic payload handling.
* **Cross-Platform Readiness**: Styled for seamless execution across iOS, Android, and Web (`react-native-web`).

---


## Setup & Installation

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

### 1. Clone & Install Dependencies
```bash
# Install required dependencies
npx expo install
```

### 2. Run on Web Browser
```bash
npx expo start --web
```
Open `http://localhost:8081` in your browser.

### 3. Run on Mobile (Expo Go)
```bash
npx expo start
```
Scan the generated QR code using the **Expo Go** app on Android or iOS.

---

##  Key Technical Trade-offs & Decisions

1. **Context API vs. Redux/Zustand**: Given the project scope and single-screen domain, React Context API was chosen to keep the bundle lightweight and eliminate boilerplate while providing efficient state access across the chat components.
2. **Virtualized Timeline**: `FlatList` with `initialNumToRender` and `windowSize` optimizations was chosen to ensure high FPS performance during long scroll sessions.
3. **Registry Pattern vs Switch Statement**: A registry map was chosen over a standard `switch` statement for recommendation cards to follow the Open/Closed Principle (OCP)—allowing seamless plug-and-play addition of new recommendation cards without mutating core rendering logic.

---

##  Architecture & Component Design

```
                          ┌──────────────────────┐
                          │       App.tsx        │
                          └──────────┬───────────┘
                                     │ (SafeAreaProvider & Context)
                          ┌──────────▼───────────┐
                          │     ChatProvider     │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │  ConversationScreen  │
                          └────┬────────────┬────┘
                               │            │
             ┌─────────────────┴─┐        ┌─┴────────────────┐
             │     ChatList      │        │ MessageComposer  │
             └─────────┬─────────┘        └──────────────────┘
                       │
             ┌─────────▼─────────┐
             │    MessageItem    │
             └─────────┬─────────┘
                       │ (Queries Payload Type)
             ┌─────────▼─────────┐
             │  Recommendation   │
             │     Registry      │
             └─────────┬─────────┘
                       │
       ┌───────────────┼───────────────┬───────────────┐
┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  Gemstone   │ │    Tarot    │ │ Consultation│ │   Article   │
│    Card     │ │    Card     │ │    Card     │ │    Card     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```
