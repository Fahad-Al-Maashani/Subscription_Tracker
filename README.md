# SubsTrack - Subscription Manager 📱

A beautiful, feature-rich React Native application for tracking and managing your subscriptions with analytics, multi-language support, and currency conversion.

## ✨ Features

### 📊 **Core Functionality**
- **Subscription Management**: Add, view, edit, and delete subscriptions
- **Smart Tracking**: Track subscription names, prices (in USD), and due dates
- **Period Views**: Toggle between Weekly, Monthly, and Yearly expense projections
- **Automatic Calculations**: Real-time total expense calculations

### 📈 **Advanced Analytics**
- **Spending Trends**: Visualize your subscription costs over the last 6 months
- **Category Breakdown**: Pie charts showing spending by category
- **Top Categories**: Bar charts displaying your highest spending categories
- **Smart Insights**: Get personalized recommendations to save money
- **Yearly Projections**: See your estimated annual subscription costs

### 🌍 **Multi-Language Support**
- **English** (en)
- **Arabic** (ar) with RTL support
- **German** (de)
- Easy language switching via the app interface

### 💱 **Multi-Currency Support**
Supports 5 major currencies with automatic conversion from USD:
- **USD** ($) - US Dollar
- **OMR** (ر.ع.) - Omani Rial
- **SAR** (ر.س) - Saudi Riyal
- **AED** (د.إ) - UAE Dirham
- **EUR** (€) - Euro

### 🎨 **Premium UI/UX**
- Modern, clean interface with smooth animations
- Loading screen with pulsing logo animation
- Beautiful gradient splash screen
- Responsive design that works on all screen sizes
- RTL (Right-to-Left) support for Arabic
- Animated card interactions

### 🔧 **Other Features**
- **Persistent Storage**: All data saved locally using AsyncStorage
- **Sort & Filter**: Sort subscriptions by name, price, or due date
- **Visual Feedback**: Smooth layout animations when adding/deleting
- **Next Due Date**: Automatic calculation of next billing date
- **Arabic Numeral Support**: Converts Arabic-Indic numerals to Western

---

## 📋 Prerequisites

Before running this app, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Will be installed with dependencies
- **Expo Go** app on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## � Complete Installation Guide

This section will walk you through setting up your development environment and installing the mobile app.

### **Step 1: Install Node.js & npm**

Node.js is required to run the Expo development server and manage dependencies.

#### **Windows**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (`node-vXX.X.X-x64.msi`)
4. Follow the installation wizard (keep default settings)
5. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### **macOS**
**Option 1: Using Official Installer**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version for macOS
3. Run the `.pkg` installer
4. Follow the installation wizard
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Option 2: Using Homebrew (Recommended)**
```bash
# Install Homebrew first if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

#### **Linux (Ubuntu/Debian)**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version

# If version is too old, use NodeSource repository for latest LTS:
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Linux (Fedora/RHEL/CentOS)**
```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

---

### **Step 2: Install Expo Go on Your Mobile Device**

Expo Go is a free app that lets you run React Native projects on your phone without building the app.

#### **📱 For iOS (iPhone/iPad)**

1. **Open the App Store** on your iOS device
2. **Search for "Expo Go"**
3. **Tap "Get"** to download and install
4. **Open Expo Go** after installation
5. You're ready to scan QR codes!

**Direct Link**: [Download Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)

**Requirements**:
- iOS 13.0 or later
- Compatible with iPhone, iPad, and iPod touch

#### **📱 For Android**

1. **Open Google Play Store** on your Android device
2. **Search for "Expo Go"**
3. **Tap "Install"** to download and install
4. **Open Expo Go** after installation
5. You're ready to scan QR codes!

**Direct Link**: [Download Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

**Requirements**:
- Android 5.0 (Lollipop) or later

---

### **Step 3: Verify Expo CLI**

Expo CLI comes bundled with the project dependencies. You don't need to install it globally, but you can verify it works:

```bash
# This will be installed when you run npm install
npx expo --version
```

**Optional**: Install Expo CLI globally for convenience:
```bash
npm install -g expo-cli
```

---

## �🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Fahad-Al-Maashani/Subscription_Tracker.git
cd Subscription_Tracker
```

### 2. Install Dependencies
```bash
npm install
```
or if you prefer yarn:
```bash
yarn install
```

### 3. Start the Development Server
```bash
npm start
```
or:
```bash
npx expo start
```

### 4. Run on Your Device

You'll see a QR code in your terminal and in your browser. Choose your platform:

#### **For iOS (iPhone/iPad)**
1. Open the **Camera** app
2. Point it at the QR code
3. Tap the notification to open in **Expo Go**

#### **For Android**
1. Open the **Expo Go** app
2. Tap **"Scan QR Code"**
3. Scan the QR code from your terminal/browser

#### **For Emulator/Simulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Press `w` for web browser

---

## 📱 Usage Guide

### Adding a Subscription
1. Tap the blue **+ (Plus)** button at the bottom-right
2. Enter the service name (e.g., "Netflix")
3. Enter the monthly price in **USD** (e.g., "15.99")
4. Enter the billing day of the month (1-31)
5. Tap **"Save Subscription"**

### Viewing Analytics
1. Tap the **Stats Chart** icon in the top-right corner
2. Scroll through:
   - Spending trend graphs
   - Category breakdowns
   - Top spending categories
   - Smart recommendations
3. Swipe down or tap the X to close

### Changing Currency
1. Tap the **Cash** icon in the header
2. Select your preferred currency
3. All prices will automatically convert

### Changing Language
1. Tap the **Language** icon in the header
2. Choose English, Arabic, or German
3. The entire app will translate instantly

### Sorting Subscriptions
1. Tap the **Filter** icon in the header
2. Choose sort criteria:
   - By Name (A-Z or Z-A)
   - By Price (Low to High or High to Low)
   - By Due Date (Earliest to Latest or Latest to Earliest)

### Deleting a Subscription
1. Find the subscription card
2. Tap the red **"Delete"** button
3. Confirm the deletion

### Switching View Periods
- Tap **"Weekly"** to see weekly average costs
- Tap **"Monthly"** to see monthly total costs
- Tap **"Yearly"** to see projected yearly costs

---

## 🏗️ Project Structure

```
Subscription_Tracker/
├── assets/                      # App icons and splash screens
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── src/
│   ├── constants/
│   │   ├── categories.js        # Subscription categories
│   │   ├── currencies.js        # Currency definitions
│   │   └── paymentMethods.js    # Payment method options
│   ├── screens/
│   │   └── AnalyticsScreen.js   # Analytics & charts screen
│   └── utils/
│       └── forecasting.js       # Forecasting algorithms
├── App.js                       # Main application component
├── index.js                     # Entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies & scripts
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🛠️ Tech Stack

- **React Native** 0.81.5
- **Expo** ~54.0.31
- **React** 19.1.0
- **AsyncStorage** - Local data persistence
- **React Native Chart Kit** - Beautiful charts and graphs
- **React Native SVG** - SVG rendering for charts
- **Expo Icons** (Ionicons) - Premium icon library
- **Expo Status Bar** - Status bar management

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS device/simulator (Mac only) |
| `npm run web` | Run in web browser |

---

## 🎨 Features in Detail

### Analytics Dashboard
The analytics screen provides comprehensive insights:

- **📊 Spending Trend Line Chart**: Visualize how your subscription costs have evolved over the past 6 months
- **🥧 Category Pie Chart**: See which categories consume most of your budget
- **📊 Top Categories Bar Chart**: Identify your highest-spending subscription categories
- **💡 Smart Insights**: Get key metrics like most expensive subscription, cheapest subscription, and top category
- **📅 Yearly Projection**: Understand your annual subscription commitment
- **💰 Recommendations**: Actionable tips to reduce subscription costs

### Data Persistence
All your subscriptions are automatically saved to your device using AsyncStorage. Your data persists even after closing the app.

### Currency Conversion
Prices are stored in USD and automatically converted to your selected currency using real exchange rates. This ensures consistency and easy comparison.

---

## 🔐 Privacy & Security

- **100% Local Storage**: All data is stored locally on your device
- **No Cloud Sync**: Your subscription data never leaves your phone
- **No Account Required**: Use the app without signing up
- **No Analytics Tracking**: Your usage data is private

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and restart
npm start --clear
```

### Dependencies issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### QR code not scanning
- Make sure your phone and computer are on the same WiFi network
- Try entering the URL manually in Expo Go

### Expo Go not working
- Update Expo Go to the latest version
- Make sure you're running the compatible Expo SDK version

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SubsTrack:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

---

## 👤 Author

**Fahad Al Maashani**

- GitHub: [@Fahad-Al-Maashani](https://github.com/Fahad-Al-Maashani)
- Repository: [Subscription_Tracker](https://github.com/Fahad-Al-Maashani/Subscription_Tracker)

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Charts powered by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- Icons from [Ionicons](https://ionic.io/ionicons)

---

## 📸 Screenshots

> **Note**: Add screenshots of your app here to help users understand what they're installing!

---

## 🚧 Future Enhancements

Planned features for future releases:
- [ ] Subscription categories with icons
- [ ] Payment method tracking
- [ ] Subscription notes and ratings
- [ ] Reminder notifications before due dates
- [ ] Export data to CSV/PDF
- [ ] Dark mode support
- [ ] Cloud backup & sync
- [ ] Subscription sharing with family

---

## ⭐ Support

If you find this app helpful, please give it a ⭐ on GitHub!

---

**Happy Tracking! 💰📱**
