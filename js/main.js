/**
 * MONEY SPREAD - Professional Binary Options Trading Platform
 * Main Application Engine: Live Tickers, Real-time Candlestick Chart, 
 * Binary Options Trade Execution, Audio FX, Portfolio & LocalStorage State.
 */

// ==========================================
// 1. ASSET MASTER CATALOG (All 22+ Deriv Markets)
// ==========================================
const ASSET_CATALOG = [
  // Synthetic Indices (Deriv Flagship)
  { id: 'vol_10', symbol: 'Vol 10', name: 'Volatility 10 Index', category: 'synthetic', price: 1845.20, decimals: 2, spread: 0.12, vol: 0.3, type: 'volatility', tag: 'STABLE' },
  { id: 'vol_25', symbol: 'Vol 25', name: 'Volatility 25 Index', category: 'synthetic', price: 2314.50, decimals: 2, spread: 0.18, vol: 0.5, type: 'volatility', tag: '24/7' },
  { id: 'vol_50', symbol: 'Vol 50', name: 'Volatility 50 Index', category: 'synthetic', price: 3420.80, decimals: 2, spread: 0.25, vol: 0.8, type: 'volatility', tag: 'POPULAR' },
  { id: 'vol_75', symbol: 'Vol 75', name: 'Volatility 75 Index', category: 'synthetic', price: 74210.00, decimals: 2, spread: 1.50, vol: 1.5, type: 'volatility', tag: 'HOT' },
  { id: 'vol_100', symbol: 'Vol 100', name: 'Volatility 100 Index', category: 'synthetic', price: 4120.30, decimals: 2, spread: 0.40, vol: 2.2, type: 'volatility', tag: 'MAX VOL' },
  { id: 'crash_300', symbol: 'Crash 300', name: 'Crash 300 Index', category: 'synthetic', price: 6540.20, decimals: 2, spread: 0.35, vol: 0.6, type: 'crash', tag: 'CRASH' },
  { id: 'crash_500', symbol: 'Crash 500', name: 'Crash 500 Index', category: 'synthetic', price: 4890.60, decimals: 2, spread: 0.30, vol: 0.5, type: 'crash', tag: 'CRASH' },
  { id: 'crash_1000', symbol: 'Crash 1000', name: 'Crash 1000 Index', category: 'synthetic', price: 9230.10, decimals: 2, spread: 0.45, vol: 0.4, type: 'crash', tag: 'CRASH' },
  { id: 'boom_300', symbol: 'Boom 300', name: 'Boom 300 Index', category: 'synthetic', price: 3410.80, decimals: 2, spread: 0.35, vol: 0.6, type: 'boom', tag: 'BOOM' },
  { id: 'boom_500', symbol: 'Boom 500', name: 'Boom 500 Index', category: 'synthetic', price: 5670.30, decimals: 2, spread: 0.30, vol: 0.5, type: 'boom', tag: 'BOOM' },
  { id: 'boom_1000', symbol: 'Boom 1000', name: 'Boom 1000 Index', category: 'synthetic', price: 8120.50, decimals: 2, spread: 0.45, vol: 0.4, type: 'boom', tag: 'BOOM' },
  { id: 'step_index', symbol: 'Step Index', name: 'Step Index', category: 'synthetic', price: 4810.20, decimals: 1, spread: 0.10, vol: 0.3, type: 'step', tag: 'FIXED STEP' },
  { id: 'range_100', symbol: 'Range 100', name: 'Range Break 100 Index', category: 'synthetic', price: 2150.40, decimals: 2, spread: 0.20, vol: 0.7, type: 'range', tag: 'RANGE' },
  { id: 'range_200', symbol: 'Range 200', name: 'Range Break 200 Index', category: 'synthetic', price: 3890.75, decimals: 2, spread: 0.25, vol: 0.9, type: 'range', tag: 'BREAKOUT' },

  // Forex Majors
  { id: 'eur_usd', symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', price: 1.08465, decimals: 5, spread: 0.00008, vol: 0.00015, type: 'forex', tag: '0.8 PIPS' },
  { id: 'gbp_usd', symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', price: 1.29820, decimals: 5, spread: 0.00012, vol: 0.00020, type: 'forex', tag: 'MAJOR' },
  { id: 'usd_jpy', symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', price: 154.320, decimals: 3, spread: 0.012, vol: 0.025, type: 'forex', tag: 'TRENDING' },
  { id: 'aud_usd', symbol: 'AUD/USD', name: 'Australian Dollar / USD', category: 'forex', price: 0.66210, decimals: 5, spread: 0.00010, vol: 0.00018, type: 'forex', tag: 'COMMODITY' },
  { id: 'eur_gbp', symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'forex', price: 0.83540, decimals: 5, spread: 0.00011, vol: 0.00012, type: 'forex', tag: 'CROSS' },
  { id: 'usd_chf', symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', price: 0.86750, decimals: 5, spread: 0.00012, vol: 0.00015, type: 'forex', tag: 'SAFE HAVEN' },
  { id: 'nzd_usd', symbol: 'NZD/USD', name: 'New Zealand Dollar / USD', category: 'forex', price: 0.59840, decimals: 5, spread: 0.00014, vol: 0.00018, type: 'forex', tag: 'KIWI' },

  // Cryptocurrencies
  { id: 'btc_usd', symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', price: 67840.50, decimals: 2, spread: 3.50, vol: 8.5, type: 'crypto', tag: 'LEADER' },
  { id: 'eth_usd', symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto', price: 3480.25, decimals: 2, spread: 0.80, vol: 2.1, type: 'crypto', tag: 'TOP ALTS' },
  { id: 'ltc_usd', symbol: 'LTC/USD', name: 'Litecoin / US Dollar', category: 'crypto', price: 74.30, decimals: 2, spread: 0.05, vol: 0.25, type: 'crypto', tag: 'FAST' },
  { id: 'xrp_usd', symbol: 'XRP/USD', name: 'Ripple / US Dollar', category: 'crypto', price: 0.5420, decimals: 4, spread: 0.0005, vol: 0.002, type: 'crypto', tag: 'PAYMENTS' },

  // Commodities
  { id: 'gold_usd', symbol: 'Gold/USD', name: 'Gold / US Dollar', category: 'commodities', price: 2736.80, decimals: 2, spread: 0.35, vol: 1.2, type: 'commodity', tag: 'METALS' },
  { id: 'silver_usd', symbol: 'Silver/USD', name: 'Silver / US Dollar', category: 'commodities', price: 33.65, decimals: 2, spread: 0.02, vol: 0.08, type: 'commodity', tag: 'METALS' },
  { id: 'oil_usd', symbol: 'Oil/USD', name: 'Brent Crude Oil', category: 'commodities', price: 74.20, decimals: 2, spread: 0.04, vol: 0.15, type: 'commodity', tag: 'ENERGY' },

  // Stock Indices
  { id: 'us_500', symbol: 'US500', name: 'US Wall St 500', category: 'indices', price: 5820.40, decimals: 1, spread: 0.40, vol: 1.0, type: 'index', tag: 'USA' },
  { id: 'uk_100', symbol: 'UK100', name: 'UK FTSE 100', category: 'indices', price: 8245.10, decimals: 1, spread: 0.80, vol: 1.2, type: 'index', tag: 'UK' },
  { id: 'ger_30', symbol: 'GER30', name: 'Germany DAX 40', category: 'indices', price: 19480.50, decimals: 1, spread: 1.20, vol: 2.5, type: 'index', tag: 'EU' },
  { id: 'jp_225', symbol: 'JP225', name: 'Japan Nikkei 225', category: 'indices', price: 38920.00, decimals: 0, spread: 3.0, vol: 5.0, type: 'index', tag: 'ASIA' }
];

// Enrich catalog with 24h stats
ASSET_CATALOG.forEach(a => {
  a.open24h = a.price * (1 - (Math.random() * 0.03 - 0.015));
  a.high24h = Math.max(a.price, a.open24h) * (1 + Math.random() * 0.01);
  a.low24h = Math.min(a.price, a.open24h) * (1 - Math.random() * 0.01);
  a.changePct = ((a.price - a.open24h) / a.open24h) * 100;
  a.prevPrice = a.price;
});

// ==========================================
// 2. STATE MANAGEMENT & STORAGE
// ==========================================
const MoneySpread = {
  activeAssetId: localStorage.getItem('ms_active_asset') || 'vol_75',
  accountMode: localStorage.getItem('ms_account_mode') || 'demo', // 'demo' or 'real'
  demoBalance: parseFloat(localStorage.getItem('ms_demo_balance')) || 10000.00,
  realBalance: parseFloat(localStorage.getItem('ms_real_balance')) || 0.00,
  activePositions: JSON.parse(localStorage.getItem('ms_active_positions') || '[]'),
  tradeHistory: JSON.parse(localStorage.getItem('ms_trade_history') || '[]'),
  demoStats: JSON.parse(localStorage.getItem('ms_demo_stats') || '{"totalTrades":0,"wins":0,"losses":0,"netProfit":0}'),
  realStats: JSON.parse(localStorage.getItem('ms_real_stats') || '{"totalTrades":0,"wins":0,"losses":0,"netProfit":0}'),
  chartType: 'candle', // 'candle' or 'line'
  timeframe: '5s',
  chartCandles: [],
  candleDurationMs: 5000,
  subscribers: [],
  _syncPending: false,

  init() {
    this.loadFromServer(); // Load fresh balances/stats from server on every page load
    this.saveState();
    this.startGlobalTickEngine();
    this.initAudio();
    this.initTickerTape();
  },

  // Load fresh data from server on page load (ensures accuracy across tabs/devices)
  async loadFromServer() {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (!user || !user.email) return;
    try {
      const resp = await fetch(`/api/user-profile?email=${encodeURIComponent(user.email)}`);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.success && data.user) {
        const srv = data.user;
        // Overwrite balances with server truth
        if (srv.demoBalance !== undefined) {
          this.demoBalance = parseFloat(srv.demoBalance);
          localStorage.setItem('ms_demo_balance', this.demoBalance.toFixed(2));
        }
        if (srv.realBalance !== undefined) {
          this.realBalance = parseFloat(srv.realBalance);
          localStorage.setItem('ms_real_balance', this.realBalance.toFixed(2));
        }
        // Overwrite stats with server truth
        if (srv.demoStats) {
          this.demoStats = srv.demoStats;
          localStorage.setItem('ms_demo_stats', JSON.stringify(this.demoStats));
        }
        if (srv.realStats) {
          this.realStats = srv.realStats;
          localStorage.setItem('ms_real_stats', JSON.stringify(this.realStats));
        }
        // Load server trade history (merge: server is source of truth for settled)
        if (Array.isArray(srv.demoTradeHistory) && srv.demoTradeHistory.length > 0) {
          localStorage.setItem('ms_demo_trade_history', JSON.stringify(srv.demoTradeHistory));
        }
        if (Array.isArray(srv.realTradeHistory) && srv.realTradeHistory.length > 0) {
          localStorage.setItem('ms_real_trade_history', JSON.stringify(srv.realTradeHistory));
        }
        // Rebuild combined trade history from server for display
        const combined = [
          ...(srv.demoTradeHistory || []),
          ...(srv.realTradeHistory || [])
        ].sort((a, b) => (b.closedAt || b.startTime || 0) - (a.closedAt || a.startTime || 0));
        this.tradeHistory = combined.slice(0, 200);
        localStorage.setItem('ms_trade_history', JSON.stringify(this.tradeHistory));

        // Update ms_user localStorage with fresh server data
        user.demoBalance = this.demoBalance;
        user.realBalance = this.realBalance;
        if (srv.nickname) user.nickname = srv.nickname;
        if (srv.name) user.name = srv.name;
        if (srv.crNumber) user.crNumber = srv.crNumber;
        if (srv.profilePic !== undefined) user.profilePic = srv.profilePic;
        localStorage.setItem('ms_user', JSON.stringify(user));

        this.broadcastState();
      }
    } catch (e) {
      console.warn('Could not sync from server, using local data:', e);
    }
  },

  saveState() {
    localStorage.setItem('ms_active_asset', this.activeAssetId);
    localStorage.setItem('ms_account_mode', this.accountMode);
    localStorage.setItem('ms_demo_balance', this.demoBalance.toFixed(2));
    localStorage.setItem('ms_real_balance', this.realBalance.toFixed(2));
    localStorage.setItem('ms_active_positions', JSON.stringify(this.activePositions));
    localStorage.setItem('ms_trade_history', JSON.stringify(this.tradeHistory));
    localStorage.setItem('ms_demo_stats', JSON.stringify(this.demoStats));
    localStorage.setItem('ms_real_stats', JSON.stringify(this.realStats));
    this.broadcastState();
  },

  // Push balance to server (fire-and-forget)
  syncBalanceToServer() {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (!user || !user.email) return;
    fetch('/api/update-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        demoBalance: this.demoBalance,
        realBalance: this.realBalance
      })
    }).then(r => r.json()).then(data => {
      if (data.success && data.user) {
        // Keep ms_user in sync
        user.demoBalance = this.demoBalance;
        user.realBalance = this.realBalance;
        localStorage.setItem('ms_user', JSON.stringify(user));
      }
    }).catch(e => console.warn('Balance sync failed:', e));
  },

  // Record a settled trade to the server permanently
  recordTradeToServer(trade) {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (!user || !user.email) return;
    fetch('/api/record-trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        trade: trade,
        newDemoBalance: this.demoBalance,
        newRealBalance: this.realBalance
      })
    }).then(r => r.json()).then(data => {
      if (data.success && data.user) {
        // Refresh stats from server response
        if (data.user.demoStats) {
          this.demoStats = data.user.demoStats;
          localStorage.setItem('ms_demo_stats', JSON.stringify(this.demoStats));
        }
        if (data.user.realStats) {
          this.realStats = data.user.realStats;
          localStorage.setItem('ms_real_stats', JSON.stringify(this.realStats));
        }
        user.demoBalance = this.demoBalance;
        user.realBalance = this.realBalance;
        localStorage.setItem('ms_user', JSON.stringify(user));
      }
    }).catch(e => console.warn('Trade record sync failed:', e));
  },

  getStats() {
    return this.accountMode === 'demo' ? this.demoStats : this.realStats;
  },

  getAllStats() {
    return { demo: this.demoStats, real: this.realStats };
  },

  broadcastState() {
    this.subscribers.forEach(cb => cb(this));
  },

  subscribe(cb) {
    this.subscribers.push(cb);
  },

  getActiveAsset() {
    return ASSET_CATALOG.find(a => a.id === this.activeAssetId) || ASSET_CATALOG[0];
  },

  setActiveAsset(assetId) {
    if (ASSET_CATALOG.some(a => a.id === assetId)) {
      this.activeAssetId = assetId;
      localStorage.setItem('ms_active_asset', assetId);
      this.initChartHistory();
      this.broadcastState();
    }
  },

  getBalance() {
    return this.accountMode === 'demo' ? this.demoBalance : this.realBalance;
  },

  setBalance(newBal) {
    if (this.accountMode === 'demo') {
      this.demoBalance = Math.max(0, parseFloat(newBal.toFixed(2)));
    } else {
      this.realBalance = Math.max(0, parseFloat(newBal.toFixed(2)));
    }
    this.saveState();
    this.syncBalanceToServer();
  },

  resetDemoBalance() {
    this.demoBalance = 10000.00;
    this.demoStats = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 };
    this.saveState();
    // Sync reset to server
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (user && user.email) {
      fetch('/api/reset-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).catch(e => console.warn('Demo reset sync failed:', e));
    }
    this.toast('Balance Reset', 'Demo account restored to $10,000.00 USD. Stats & history cleared.', 'info');
  },

  toggleAccountMode() {
    this.accountMode = this.accountMode === 'demo' ? 'real' : 'demo';
    // Sync fresh balance from server when switching accounts
    this.loadFromServer();
    this.saveState();
    this.toast('Account Switched', `Switched to ${this.accountMode.toUpperCase()} account`, 'info');
  },

  // Audio synthesize with Web Audio API
  audioCtx: null,
  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      // Audio not supported or blocked by browser autoplay policy
    }
  },

  playSound(type) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'win') {
      // Cheerful major chord arpeggio
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'loss') {
      // Low descending tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  },

  // Toast Notifications
  toast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'win' ? 'ðŸŽ‰' : type === 'loss' ? 'ðŸ“‰' : 'ðŸ’¡';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  // ==========================================
  // 3. REALISTIC PRICE MOVEMENT ENGINE
  // ==========================================
  startGlobalTickEngine() {
    // Digit history stream & 100 ticks distribution for Digit trade types
    this.digitHistory = [];
    this.last100Digits = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10));

    // High-frequency tick for active asset (calibrated to a smooth, relaxed 2000ms tick rate)
    setInterval(() => {
      this.tickAsset(this.getActiveAsset(), true);
      // Update digit stream & stats
      const activeAsset = this.getActiveAsset();
      if (activeAsset) {
        const priceStr = activeAsset.price.toFixed(activeAsset.decimals);
        const lastDigit = parseInt(priceStr.charAt(priceStr.length - 1), 10);
        this.digitHistory.push(lastDigit);
        if (this.digitHistory.length > 25) this.digitHistory.shift();

        this.last100Digits.push(lastDigit);
        if (this.last100Digits.length > 100) this.last100Digits.shift();

        this.renderDigitStream();
        this.renderDigitsOnlyBoard();
      }
    }, 2000);

    // Regular tick for other assets (calibrated to 5500ms for calm ticker marquee updates)
    setInterval(() => {
      ASSET_CATALOG.forEach(asset => {
        if (asset.id !== this.activeAssetId) {
          this.tickAsset(asset, false);
        }
      });
      this.updateTickerTapeValues();
    }, 5500);

    // Positions expiration evaluation loop (every 500ms)
    setInterval(() => {
      this.evaluateOpenPositions();
    }, 500);
  },

  tickAsset(asset, isActive = false) {
    asset.prevPrice = asset.price;
    let delta = 0;

    // Specialized physics based on asset type
    if (asset.type === 'crash') {
      // Slow drift up + occasional sudden crash
      if (Math.random() < 0.015) {
        // CRASH! Sudden drop
        delta = -1 * (asset.price * (0.004 + Math.random() * 0.008));
      } else {
        // Slow upward climb
        delta = (Math.random() * 0.5 + 0.1) * (asset.vol * 0.25);
      }
    } else if (asset.type === 'boom') {
      // Slow drift down + occasional sudden boom
      if (Math.random() < 0.015) {
        // BOOM! Sudden surge
        delta = asset.price * (0.004 + Math.random() * 0.008);
      } else {
        // Slow downward drift
        delta = -(Math.random() * 0.5 + 0.1) * (asset.vol * 0.25);
      }
    } else if (asset.type === 'step') {
      // Strictly steps up or down by 0.10
      delta = (Math.random() > 0.49 ? 0.10 : -0.10);
    } else if (asset.type === 'range') {
      // Mean-reverting brownian walk
      const center = (asset.high24h + asset.low24h) / 2;
      const pull = (center - asset.price) * 0.03;
      const noise = (Math.random() - 0.5) * asset.vol * 1.2;
      delta = pull + noise;
    } else {
      // Standard Gaussian random walk (gentler volatility)
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
      delta = z0 * asset.vol * 0.18;
    }

    asset.price = Math.max(0.00001, asset.price + delta);
    asset.high24h = Math.max(asset.high24h, asset.price);
    asset.low24h = Math.min(asset.low24h, asset.price);
    asset.changePct = ((asset.price - asset.open24h) / asset.open24h) * 100;

    if (isActive) {
      this.feedActiveCandle(asset.price);
      this.broadcastState();
    }
  },

  // ==========================================
  // 4. CHART DATA GENERATION & REALTIME FEED
  // ==========================================
  initChartHistory() {
    const asset = this.getActiveAsset();
    const count = 70;
    const now = Date.now();
    const tfMs = this.candleDurationMs;
    this.chartCandles = [];

    let currentClose = asset.price;
    // Work backward
    const tempCandles = [];
    for (let i = 0; i < count; i++) {
      const time = now - (count - 1 - i) * tfMs;
      const spread = asset.vol * 1.5;
      const open = currentClose + (Math.random() - 0.5) * spread;
      const high = Math.max(open, currentClose) + Math.random() * spread * 0.8;
      const low = Math.min(open, currentClose) - Math.random() * spread * 0.8;
      const volume = Math.floor(Math.random() * 80) + 15;
      tempCandles.push({
        time,
        open,
        high,
        low,
        close: currentClose,
        volume
      });
      currentClose = open;
    }
    this.chartCandles = tempCandles;
  },

  feedActiveCandle(price) {
    if (!this.chartCandles || this.chartCandles.length === 0) {
      this.initChartHistory();
    }

    const now = Date.now();
    const lastCandle = this.chartCandles[this.chartCandles.length - 1];

    if (!lastCandle || now - lastCandle.time >= this.candleDurationMs) {
      // Start brand new candle
      this.chartCandles.push({
        time: now,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 1
      });
      if (this.chartCandles.length > 120) {
        this.chartCandles.shift();
      }
    } else {
      // Update ongoing candle
      lastCandle.high = Math.max(lastCandle.high, price);
      lastCandle.low = Math.min(lastCandle.low, price);
      lastCandle.close = price;
      lastCandle.volume += 1;
    }
  },

  setTimeframe(tfStr) {
    const map = {
      '1s': 1000,
      '5s': 5000,
      '15s': 15000,
      '30s': 30000,
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '1h': 3600000
    };
    if (map[tfStr]) {
      this.timeframe = tfStr;
      this.candleDurationMs = map[tfStr];
      this.initChartHistory();
      this.broadcastState();
    }
  },

  // ==========================================
  // 5. TICKER TAPE UNIVERSAL COMPONENT
  // ==========================================
  initTickerTape() {
    const tickerContainers = document.querySelectorAll('.ticker-inner');
    if (!tickerContainers.length) return;

    let html = '';
    // Duplicate twice for seamless endless marquee
    const repeated = [...ASSET_CATALOG, ...ASSET_CATALOG];
    repeated.forEach(asset => {
      const isUp = asset.changePct >= 0;
      const sign = isUp ? '+' : '';
      const cls = isUp ? 'price-up' : 'price-down';
      const arrow = isUp ? 'â–²' : 'â–¼';
      html += `
        <div class="ticker-item" data-id="${asset.id}" onclick="MoneySpread.onTickerClick('${asset.id}')">
          <span class="ticker-symbol">${asset.symbol}</span>
          <span class="ticker-price ticker-val-${asset.id}">${asset.price.toFixed(asset.decimals)}</span>
          <span class="ticker-change ${cls} ticker-chg-${asset.id}">${arrow} ${sign}${asset.changePct.toFixed(2)}%</span>
        </div>
      `;
    });

    tickerContainers.forEach(c => c.innerHTML = html);
  },

  updateTickerTapeValues() {
    ASSET_CATALOG.forEach(asset => {
      const isUp = asset.changePct >= 0;
      const sign = isUp ? '+' : '';
      const cls = isUp ? 'price-up' : 'price-down';
      const arrow = isUp ? 'â–²' : 'â–¼';

      const priceEls = document.querySelectorAll(`.ticker-val-${asset.id}`);
      priceEls.forEach(el => el.textContent = asset.price.toFixed(asset.decimals));

      const chgEls = document.querySelectorAll(`.ticker-chg-${asset.id}`);
      chgEls.forEach(el => {
        el.textContent = `${arrow} ${sign}${asset.changePct.toFixed(2)}%`;
        el.className = `ticker-change ${cls} ticker-chg-${asset.id}`;
      });
    });
  },

  onTickerClick(assetId) {
    if (window.location.pathname.includes('trading.html')) {
      this.setActiveAsset(assetId);
    } else {
      window.location.href = `trading.html?symbol=${assetId}`;
    }
  },

  // ==========================================
  // 6. BINARY OPTIONS TRADE EXECUTION & SETTLEMENT
  // ==========================================
  buyContract(options) {
    const {
      type,        // 'rise', 'fall', 'higher', 'lower', 'touch', 'no_touch', 'in', 'out', 'multiplier'
      stake,
      durationVal,
      durationUnit // 'ticks', 's', 'm', 'h', 'd'
    } = options;

    const currentBalance = this.getBalance();
    if (stake <= 0) {
      this.toast('Invalid Stake', 'Stake amount must be greater than 0', 'loss');
      return false;
    }
    if (stake > currentBalance) {
      this.toast('Insufficient Funds', `You need $${stake.toFixed(2)} but your ${this.accountMode} balance is $${currentBalance.toFixed(2)}`, 'loss');
      return false;
    }

    // Deduct stake immediately
    this.setBalance(currentBalance - stake);

    const asset = this.getActiveAsset();
    const entrySpot = asset.price;
    const now = Date.now();

    // Calculate expiry duration in ms
    let durationMs = 15000; // default 15s
    if (durationUnit === 'ticks') {
      durationMs = durationVal * 1000;
    } else if (durationUnit === 's') {
      durationMs = durationVal * 1000;
    } else if (durationUnit === 'm') {
      durationMs = durationVal * 60 * 1000;
    } else if (durationUnit === 'h') {
      durationMs = durationVal * 3600 * 1000;
    } else if (durationUnit === 'd') {
      durationMs = durationVal * 86400 * 1000;
    }

    const payoutRate = 0.95; // 95% standard Deriv binary payout
    let actualPayoutRate = payoutRate;
    // Digit trades have different payouts
    if (type === 'even' || type === 'odd') actualPayoutRate = 0.95;
    if (type === 'matches') actualPayoutRate = 9.00; // 900% for exact digit match (1 in 10)
    if (type === 'differs') actualPayoutRate = 0.10;  // 10% for differs (9 in 10)
    if (type === 'over' || type === 'under') actualPayoutRate = 0.95;

    const potentialPayout = stake * (1 + actualPayoutRate);

    // Compute strike/barrier
    let barrier = entrySpot;
    if (type === 'higher') barrier = entrySpot * 1.0003;
    if (type === 'lower') barrier = entrySpot * 0.9997;
    if (type === 'touch' || type === 'no_touch') barrier = entrySpot * (1 + (Math.random() > 0.5 ? 0.0005 : -0.0005));

    const contract = {
      id: 'MS-' + Math.floor(10000000 + Math.random() * 90000000),
      assetId: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: type.toUpperCase(),
      stake: parseFloat(stake),
      entrySpot,
      barrier,
      predictedDigit: options.predictedDigit !== undefined ? options.predictedDigit : null,
      payout: potentialPayout,
      startTime: now,
      expiryTime: now + durationMs,
      durationMs,
      touched: false,
      status: 'OPEN',
      mode: this.accountMode
    };

    this.activePositions.unshift(contract);
    // Instant server balance sync on trade placement
    this.syncBalanceToServer();
    this.saveState();
    this.playSound('click');
    this.toast('Contract Purchased', `${contract.type} on ${asset.symbol} for $${stake.toFixed(2)}`, 'info');
    return contract;
  },

  evaluateOpenPositions() {
    if (!this.activePositions.length) return;
    const now = Date.now();
    const remainingPositions = [];

    this.activePositions.forEach(contract => {
      const asset = ASSET_CATALOG.find(a => a.id === contract.assetId) || this.getActiveAsset();
      const currentSpot = asset.price;

      // Track touch events for touch/no-touch
      if (contract.type === 'TOUCH' || contract.type === 'NO_TOUCH') {
        const touchedCondition = (contract.barrier >= contract.entrySpot && currentSpot >= contract.barrier) ||
                                 (contract.barrier <= contract.entrySpot && currentSpot <= contract.barrier);
        if (touchedCondition) {
          contract.touched = true;
        }
      }

      // Check if expired
      if (now >= contract.expiryTime) {
        // Contract Expired! Determine WIN or LOSS
        let isWin = false;
        const entry = contract.entrySpot;
        const exit = currentSpot;

        // Get last digit of exit price for digit-based trades
        const exitStr = exit.toFixed(asset.decimals);
        const lastDigit = parseInt(exitStr.charAt(exitStr.length - 1), 10);

        // Check if user has an admin-assigned custom win rate
        let winRateOverride = null;
        try {
          const storedUser = JSON.parse(localStorage.getItem('ms_user') || '{}');
          if (storedUser.winRate !== undefined && storedUser.winRate !== null) {
            winRateOverride = parseFloat(storedUser.winRate);
          }
        } catch(e) {}

        switch (contract.type) {
          case 'RISE':
            isWin = exit > entry;
            break;
          case 'FALL':
            isWin = exit < entry;
            break;
          case 'HIGHER':
            isWin = exit > contract.barrier;
            break;
          case 'LOWER':
            isWin = exit < contract.barrier;
            break;
          case 'TOUCH':
            isWin = contract.touched || (exit === contract.barrier);
            break;
          case 'NO_TOUCH':
            isWin = !contract.touched;
            break;
          case 'IN':
            const offset = entry * 0.0005;
            isWin = exit >= (entry - offset) && exit <= (entry + offset);
            break;
          case 'OUT':
            const outOffset = entry * 0.0005;
            isWin = exit < (entry - outOffset) || exit > (entry + outOffset);
            break;
          case 'MULTIPLIER':
            isWin = exit > entry;
            break;
          // ===== DIGIT TRADE TYPES =====
          case 'EVEN':
            isWin = lastDigit % 2 === 0;
            break;
          case 'ODD':
            isWin = lastDigit % 2 !== 0;
            break;
          case 'MATCHES':
            isWin = lastDigit === contract.predictedDigit;
            break;
          case 'DIFFERS':
            isWin = lastDigit !== contract.predictedDigit;
            break;
          case 'OVER':
            isWin = lastDigit > contract.predictedDigit;
            break;
          case 'UNDER':
            isWin = lastDigit < contract.predictedDigit;
            break;
          default:
            isWin = exit > entry;
        }

        // Apply admin win rate override if configured
        if (winRateOverride !== null && !isNaN(winRateOverride)) {
          const rng = Math.random() * 100;
          isWin = (rng < winRateOverride);
        }

        // Settle Contract
        contract.exitSpot = exit;
        contract.status = isWin ? 'WON' : 'LOST';
        contract.profit = isWin ? (contract.payout - contract.stake) : -contract.stake;
        contract.closedAt = now;

        if (isWin) {
          // Pay user â€” handle cross-mode correctly
          if (contract.mode === 'demo') {
            this.demoBalance = Math.max(0, parseFloat((this.demoBalance + contract.payout).toFixed(2)));
          } else {
            this.realBalance = Math.max(0, parseFloat((this.realBalance + contract.payout).toFixed(2)));
          }
          this.playSound('win');
          this.toast(
            'WINNER! Payout Received',
            `${contract.symbol} ${contract.type} won +$${contract.profit.toFixed(2)}! Total: $${contract.payout.toFixed(2)}`,
            'win'
          );
        } else {
          this.playSound('loss');
          this.toast(
            'Contract Expired Out of the Money',
            `${contract.symbol} ${contract.type} closed at ${exit.toFixed(asset.decimals)}. -$${contract.stake.toFixed(2)}`,
            'loss'
          );
        }

        // Update local stats
        const localStatsKey = contract.mode === 'real' ? 'realStats' : 'demoStats';
        if (!this[localStatsKey]) this[localStatsKey] = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0 };
        this[localStatsKey].totalTrades++;
        if (isWin) { this[localStatsKey].wins++; } else { this[localStatsKey].losses++; }
        this[localStatsKey].netProfit = parseFloat((this[localStatsKey].netProfit + contract.profit).toFixed(2));

        // Push to local history
        this.tradeHistory.unshift(contract);
        if (this.tradeHistory.length > 200) this.tradeHistory.pop();

        // *** PERMANENT SERVER SYNC: Record trade, balances, and stats to server ***
        this.recordTradeToServer(contract);
      } else {
        remainingPositions.push(contract);
      }
    });

    this.activePositions = remainingPositions;
    this.saveState();
  },

  renderDigitStream() {
    const container = document.getElementById('digitStreamPills');
    if (!container) return;
    let html = '';
    this.digitHistory.forEach((d, i) => {
      const isLast = i === this.digitHistory.length - 1;
      const cls = d % 2 === 0 ? 'even' : 'odd';
      html += `<span class="digit-pill ${cls} ${isLast ? 'latest' : ''}">${d}</span>`;
    });
    container.innerHTML = html;
  },

  renderDigitsOnlyBoard() {
    const board = document.getElementById('digitsOnlyBoard');
    if (!board || board.style.display === 'none') return;

    if (!this.last100Digits || !this.last100Digits.length) {
      this.last100Digits = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10));
    }

    const counts = Array(10).fill(0);
    this.last100Digits.forEach(d => counts[d]++);

    const total = this.last100Digits.length;
    let evenCount = 0;
    for (let d = 0; d < 10; d++) {
      if (d % 2 === 0) evenCount += counts[d];
    }
    const evenPct = ((evenCount / total) * 100).toFixed(1);
    const oddPct = (100 - parseFloat(evenPct)).toFixed(1);

    const evenPctEl = document.getElementById('statEvenPct');
    const oddPctEl = document.getElementById('statOddPct');
    const evenBar = document.getElementById('evenProgressBar');
    const oddBar = document.getElementById('oddProgressBar');

    if (evenPctEl) evenPctEl.textContent = `${evenPct}%`;
    if (oddPctEl) oddPctEl.textContent = `${oddPct}%`;
    if (evenBar) evenBar.style.width = `${evenPct}%`;
    if (oddBar) oddBar.style.width = `${oddPct}%`;

    // Rank digits by occurrence frequency over last 100 ticks
    // 1st Most Occurring: Green
    // 2nd Most Occurring: Yellow
    // 2nd Least Occurring (9th): Pink
    // Least Occurring (10th): Red
    // All Others: Blue
    const rankedStats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => ({
      digit: d,
      count: counts[d]
    }));
    rankedStats.sort((a, b) => b.count - a.count);

    const rankClasses = {};
    rankedStats.forEach((item, idx) => {
      if (idx === 0) {
        rankClasses[item.digit] = 'rank-green'; // Main occurring (Green)
      } else if (idx === 1) {
        rankClasses[item.digit] = 'rank-yellow'; // 2nd occurring (Yellow)
      } else if (idx === rankedStats.length - 1) {
        rankClasses[item.digit] = 'rank-red'; // Last occurring (Red)
      } else if (idx === rankedStats.length - 2) {
        rankClasses[item.digit] = 'rank-pink'; // 2nd last occurring (Pink)
      } else {
        rankClasses[item.digit] = 'rank-blue'; // Others (Blue)
      }
    });

    const latestDigit = this.last100Digits[this.last100Digits.length - 1];

    function buildCircle(d) {
      const pct = ((counts[d] / total) * 100).toFixed(1);
      const isLatest = d === latestDigit;
      const rankCls = rankClasses[d] || 'rank-blue';

      let rankColor = '#3772ff';
      if (rankCls === 'rank-green') rankColor = '#00c49f';
      else if (rankCls === 'rank-yellow') rankColor = '#ffd600';
      else if (rankCls === 'rank-pink') rankColor = '#ff69b4';
      else if (rankCls === 'rank-red') rankColor = '#ff444f';

      return `
        <div class="digit-circle-item">
          <div class="digit-circle ${rankCls} ${isLatest ? 'is-latest' : ''}" title="Digit ${d}: ${pct}% frequency">
            <div class="digit-circle-num">${d}</div>
            <div class="digit-circle-pct">${pct}%</div>
          </div>
          <!-- Cursor Below Each Number (Indicates Changing Status) -->
          <div class="digit-cursor-box ${isLatest ? 'is-active' : ''}" style="--cursor-color: ${rankColor};">
            <div class="digit-cursor-pointer">â–²</div>
            <div class="digit-cursor-track">
              <div class="digit-cursor-bar" style="width: ${Math.min(100, Math.max(8, parseFloat(pct) * 5))}%; background: ${rankColor};"></div>
            </div>
            <div class="digit-cursor-tag">${isLatest ? 'CHANGING' : ''}</div>
          </div>
        </div>
      `;
    }

    const row1 = document.getElementById('digitsRow1');
    const row2 = document.getElementById('digitsRow2');
    if (row1) row1.innerHTML = [0, 1, 2, 3, 4].map(buildCircle).join('');
    if (row2) row2.innerHTML = [5, 6, 7, 8, 9].map(buildCircle).join('');
  },

  earlyClosePosition(contractId) {
    const index = this.activePositions.findIndex(c => c.id === contractId);
    if (index === -1) return;
    const contract = this.activePositions[index];
    const asset = ASSET_CATALOG.find(a => a.id === contract.assetId);
    const currentSpot = asset ? asset.price : contract.entrySpot;

    // Refund 60% of stake
    const refund = contract.stake * 0.60;
    this.setBalance(this.getBalance() + refund);

    contract.status = 'EARLY_CLOSED';
    contract.exitSpot = currentSpot;
    contract.profit = refund - contract.stake;
    contract.closedAt = Date.now();

    this.activePositions.splice(index, 1);
    this.tradeHistory.unshift(contract);
    this.saveState();

    this.toast('Position Closed Early', `Refunded $${refund.toFixed(2)} to ${this.accountMode} balance`, 'info');
  }
};

// ==========================================
// 7. PRO TRADING CANVAS RENDERER (Deriv Style)
// ==========================================
class TradingChartCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mousePos = { x: -1, y: -1, active: false };
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse tracking for crosshair
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
      this.mousePos.active = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mousePos.active = false;
    });

    // Start 60fps render loop
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear background
    ctx.fillStyle = '#090915';
    ctx.fillRect(0, 0, w, h);

    const candles = MoneySpread.chartCandles;
    if (!candles || candles.length < 2) return;

    const asset = MoneySpread.getActiveAsset();
    const paddingRight = 80;
    const paddingBottom = 40;
    const paddingTop = 25;
    const chartW = w - paddingRight;
    const chartH = h - paddingBottom - paddingTop;
    const volumeH = 50;
    const mainChartH = chartH - volumeH;

    // Determine min and max price
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 1;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Pad price range by 6%
    const priceRange = (maxPrice - minPrice) || 1;
    minPrice -= priceRange * 0.05;
    maxPrice += priceRange * 0.05;
    const fullRange = maxPrice - minPrice;

    const getY = (p) => paddingTop + mainChartH - ((p - minPrice) / fullRange) * mainChartH;
    const getX = (index) => (index / (candles.length - 1)) * (chartW - 20) + 10;

    // 1. Draw Grid Lines & Right Price Scale
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSteps = 6;
    for (let i = 0; i <= gridSteps; i++) {
      const p = minPrice + (fullRange / gridSteps) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartW, y);
      ctx.stroke();

      // Price text on right scale
      ctx.fillStyle = '#6e6e8c';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(asset.decimals), chartW + 8, y + 4);
    }

    // 2. Draw Volume Bars at bottom
    candles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const barH = (c.volume / maxVolume) * (volumeH - 10);
      const barY = paddingTop + mainChartH + volumeH - barH;

      ctx.fillStyle = isUp ? 'rgba(0, 196, 159, 0.25)' : 'rgba(255, 68, 79, 0.25)';
      const barWidth = Math.max(2, (chartW / candles.length) * 0.7);
      ctx.fillRect(x - barWidth / 2, barY, barWidth, barH);
    });

    // 3. Draw Chart (Candlesticks or Line/Area)
    if (MoneySpread.chartType === 'line') {
      // Area Gradient Fill
      const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + mainChartH);
      grad.addColorStop(0, 'rgba(0, 196, 159, 0.25)');
      grad.addColorStop(1, 'rgba(0, 196, 159, 0.0)');

      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(getX(candles.length - 1), paddingTop + mainChartH);
      ctx.lineTo(getX(0), paddingTop + mainChartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line Stroke
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00c49f';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Candlestick Rendering
      const candleWidth = Math.max(3, (chartW / candles.length) * 0.65);

      candles.forEach((c, i) => {
        const x = getX(i);
        const isUp = c.close >= c.open;
        const color = isUp ? '#00c49f' : '#ff444f';

        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);

        // Candle Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Candle Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    }

    // 4. Moving Average (SMA 14) Line Overlay
    const period = 14;
    if (candles.length > period) {
      ctx.beginPath();
      let started = false;
      for (let i = period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        const ma = sum / period;
        const x = getX(i);
        const y = getY(ma);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#ffb74d';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Active Binary Positions Overlay on Chart (Entry and Barrier Markers)
    MoneySpread.activePositions.forEach(pos => {
      if (pos.assetId === asset.id) {
        const entryY = getY(pos.entrySpot);
        // Horizontal entry spot line
        ctx.strokeStyle = 'rgba(255, 183, 77, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, entryY);
        ctx.lineTo(chartW, entryY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Entry tag badge
        ctx.fillStyle = '#ffb74d';
        ctx.fillRect(chartW + 2, entryY - 9, 74, 18);
        ctx.fillStyle = '#0e0e1e';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`ENTRY $${pos.stake}`, chartW + 6, entryY + 4);
      }
    });

    // 6. Current Live Price Tag & Horizontal Line
    const currentPrice = asset.price;
    const currentY = getY(currentPrice);
    const isTickUp = asset.price >= asset.prevPrice;
    const badgeColor = isTickUp ? '#00c49f' : '#ff444f';

    // Dashed horizontal price line
    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartW, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Badge on Y-axis
    ctx.fillStyle = badgeColor;
    ctx.fillRect(chartW + 2, currentY - 11, 74, 22);
    ctx.fillStyle = isTickUp ? '#0c0c18' : '#ffffff';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(currentPrice.toFixed(asset.decimals), chartW + 6, currentY + 4);

    // 7. Interactive Crosshair & Tooltip
    if (this.mousePos.active && this.mousePos.x <= chartW) {
      const mx = this.mousePos.x;
      const my = this.mousePos.y;

      // Crosshair lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      // Vertical
      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, h - paddingBottom);
      ctx.stroke();

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(0, my);
      ctx.lineTo(chartW, my);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y-axis hover price pill
      const hoverPrice = minPrice + ((paddingTop + mainChartH - my) / mainChartH) * fullRange;
      if (my >= paddingTop && my <= paddingTop + mainChartH) {
        ctx.fillStyle = '#2b2b48';
        ctx.fillRect(chartW + 2, my - 10, 74, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(hoverPrice.toFixed(asset.decimals), chartW + 6, my + 4);
      }
    }
  }
}

// ==========================================
// 8. PAGE CONTROLLERS (Home, Trading, Markets, Account, Auth)
// ==========================================

// --- TRADING PAGE CONTROLLER ---
function initTradingPage() {
  // Chart initialization
  const chartInstance = new TradingChartCanvas('tradingChartCanvas');
  MoneySpread.initChartHistory();

  // URL Query param symbol handling
  const urlParams = new URLSearchParams(window.location.search);
  const paramSymbol = urlParams.get('symbol');
  if (paramSymbol) {
    MoneySpread.setActiveAsset(paramSymbol);
  }

  // Update top nav avatar from user profile
  function updateTopNavAvatar() {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    const av = document.getElementById('topNavUserAvatar');
    if (av && user) {
      const nick = user.nickname || user.name || 'C';
      if (user.profilePic && user.profilePic.startsWith('data:image')) {
        av.innerHTML = `<img src="${user.profilePic}" alt="${nick}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        av.innerHTML = `<span>${nick.charAt(0).toUpperCase()}</span>`;
      }
    }
  }
  updateTopNavAvatar();
  MoneySpread.subscribe(updateTopNavAvatar);

  // DOM Elements
  const assetListEl = document.getElementById('assetListScroll');
  const assetSearchInput = document.getElementById('assetSearchInput');
  const assetCategoryBtns = document.querySelectorAll('.category-nav button');
  const currentAssetTitle = document.getElementById('activeAssetName');
  const currentAssetPrice = document.getElementById('activeAssetPrice');
  const currentAssetChange = document.getElementById('activeAssetChange');
  const currentAssetHigh = document.getElementById('activeAssetHigh');
  const currentAssetLow = document.getElementById('activeAssetLow');

  // Trade form controls
  const tradeStakeInput = document.getElementById('tradeStakeInput');
  const tradeDurationInput = document.getElementById('tradeDurationInput');
  const tradeDurationUnit = document.getElementById('tradeDurationUnit');
  const payoutPotentialEl = document.getElementById('payoutPotential');
  const payoutProfitEl = document.getElementById('payoutProfit');
  const btnRise = document.getElementById('btnRise');
  const btnFall = document.getElementById('btnFall');
  const openPositionsTableBody = document.getElementById('openPositionsBody');
  const historyTableBody = document.getElementById('tradeHistoryBody');
  const balanceAmountEl = document.getElementById('accountBalanceAmount');
  const accountTypeTag = document.getElementById('accountTypeTag');

  let activeCategory = 'all';

  // Render Asset List in Left Panel
  function renderAssetList() {
    if (!assetListEl) return;
    const query = (assetSearchInput ? assetSearchInput.value.toLowerCase() : '').trim();
    const filtered = ASSET_CATALOG.filter(a => {
      const matchCat = activeCategory === 'all' || a.category === activeCategory;
      const matchQuery = !query || a.symbol.toLowerCase().includes(query) || a.name.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    let html = '';
    filtered.forEach(asset => {
      const isActive = asset.id === MoneySpread.activeAssetId;
      const isUp = asset.changePct >= 0;
      const cls = isUp ? 'price-up' : 'price-down';
      const arrow = isUp ? '+' : '';

      html += `
        <div class="asset-list-item ${isActive ? 'active' : ''}" onclick="MoneySpread.setActiveAsset('${asset.id}')">
          <div class="asset-item-left">
            <div class="asset-item-symbol">
              ${asset.symbol}
              ${asset.tag ? `<span class="asset-tag-badge">${asset.tag}</span>` : ''}
            </div>
            <div class="asset-item-name">${asset.name}</div>
          </div>
          <div class="asset-item-right">
            <div class="asset-item-price ${cls}">${asset.price.toFixed(asset.decimals)}</div>
            <div class="asset-item-change ${cls}">${arrow}${asset.changePct.toFixed(2)}%</div>
          </div>
        </div>
      `;
    });
    assetListEl.innerHTML = html;
  }

  // Update Trade Controls calculations
  function updatePayoutCalculations() {
    const stake = parseFloat(tradeStakeInput ? tradeStakeInput.value : 10) || 10;
    let rate = 0.95;

    // Adjust payout rate based on selected trade type
    if (selectedTradeType === 'match_diff') {
      // Use Matches rate for the display since it's the primary action
      rate = 9.00; // Matches pays 900%
    }

    const profit = stake * rate;
    const total = stake + profit;

    const payoutStakeEl = document.getElementById('payoutStakeDisplay');
    if (payoutStakeEl) payoutStakeEl.textContent = `$${stake.toFixed(2)}`;
    if (payoutProfitEl) {
      if (selectedTradeType === 'match_diff') {
        payoutProfitEl.innerHTML = `Matches: <strong style="color:#00c49f">+$${profit.toFixed(2)} (900%)</strong> | Differs: <strong style="color:#ffb74d">+$${(stake * 0.10).toFixed(2)} (10%)</strong>`;
      } else {
        payoutProfitEl.textContent = `+$${profit.toFixed(2)} (${Math.round(rate * 100)}%)`;
      }
    }
    if (payoutPotentialEl) payoutPotentialEl.textContent = `$${total.toFixed(2)}`;

    const risePayoutSub = document.getElementById('risePayoutSub');
    const fallPayoutSub = document.getElementById('fallPayoutSub');
    if (selectedTradeType === 'match_diff') {
      if (risePayoutSub) risePayoutSub.textContent = `$${total.toFixed(2)}`;
      if (fallPayoutSub) fallPayoutSub.textContent = `$${(stake * 1.10).toFixed(2)}`;
    } else {
      if (risePayoutSub) risePayoutSub.textContent = `$${total.toFixed(2)}`;
      if (fallPayoutSub) fallPayoutSub.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Render Open Positions in Drawer Table
  function renderPositions() {
    if (!openPositionsTableBody) return;
    const positions = MoneySpread.activePositions;
    const now = Date.now();

    if (!positions.length) {
      openPositionsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No open trades currently active. Choose a contract and click Rise or Fall to start trading!
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    positions.forEach(pos => {
      const asset = ASSET_CATALOG.find(a => a.id === pos.assetId) || MoneySpread.getActiveAsset();
      const currentPrice = asset.price;
      const remainingSeconds = Math.max(0, Math.ceil((pos.expiryTime - now) / 1000));
      const isWinning = pos.type === 'RISE' ? currentPrice > pos.entrySpot : currentPrice < pos.entrySpot;
      const plColor = isWinning ? 'var(--color-green)' : 'var(--color-red)';
      const potentialReturn = isWinning ? `+$${(pos.payout - pos.stake).toFixed(2)}` : `-$${pos.stake.toFixed(2)}`;

      html += `
        <tr>
          <td><strong>${pos.symbol}</strong></td>
          <td><span style="color: ${pos.type === 'RISE' ? 'var(--color-green)' : 'var(--color-red)'}; font-weight:700;">${pos.type}</span></td>
          <td>$${pos.stake.toFixed(2)}</td>
          <td>${pos.entrySpot.toFixed(asset.decimals)}</td>
          <td class="${currentPrice >= pos.entrySpot ? 'price-up' : 'price-down'}">${currentPrice.toFixed(asset.decimals)}</td>
          <td><strong>${remainingSeconds}s</strong></td>
          <td style="color: ${plColor}; font-weight: 700;">${potentialReturn}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="MoneySpread.earlyClosePosition('${pos.id}')">Close</button>
          </td>
        </tr>
      `;
    });
    openPositionsTableBody.innerHTML = html;
  }

  // Render Trade History
  function renderHistory() {
    if (!historyTableBody) return;
    const history = MoneySpread.tradeHistory;
    if (!history.length) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No closed contracts yet.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    history.forEach(h => {
      const isWin = h.status === 'WON';
      const color = isWin ? 'var(--color-green)' : 'var(--color-red)';
      const sign = h.profit >= 0 ? '+' : '';

      html += `
        <tr>
          <td>${h.symbol}</td>
          <td>${h.type}</td>
          <td>$${h.stake.toFixed(2)}</td>
          <td>${h.entrySpot.toFixed(2)}</td>
          <td>${(h.exitSpot || 0).toFixed(2)}</td>
          <td><span style="color: ${color}; font-weight: 700;">${h.status}</span></td>
          <td style="color: ${color}; font-weight: 700;">${sign}$${h.profit.toFixed(2)}</td>
        </tr>
      `;
    });
    historyTableBody.innerHTML = html;
  }

  // Sync Header details with active asset
  MoneySpread.subscribe(() => {
    const asset = MoneySpread.getActiveAsset();
    if (currentAssetTitle) currentAssetTitle.textContent = asset.name;
    if (currentAssetPrice) {
      currentAssetPrice.textContent = asset.price.toFixed(asset.decimals);
      currentAssetPrice.className = `active-asset-price ${asset.price >= asset.prevPrice ? 'price-up' : 'price-down'}`;
    }
    if (currentAssetChange) {
      const isUp = asset.changePct >= 0;
      currentAssetChange.textContent = `${isUp ? '+' : ''}${asset.changePct.toFixed(2)}%`;
      currentAssetChange.className = `active-asset-change ${isUp ? 'price-up' : 'price-down'}`;
    }
    if (currentAssetHigh) currentAssetHigh.textContent = asset.high24h.toFixed(asset.decimals);
    if (currentAssetLow) currentAssetLow.textContent = asset.low24h.toFixed(asset.decimals);

    if (balanceAmountEl) {
      balanceAmountEl.textContent = `$${MoneySpread.getBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    if (accountTypeTag) {
      accountTypeTag.textContent = MoneySpread.accountMode.toUpperCase();
      accountTypeTag.style.background = MoneySpread.accountMode === 'demo' ? 'rgba(0, 196, 159, 0.15)' : 'rgba(255, 68, 79, 0.15)';
      accountTypeTag.style.color = MoneySpread.accountMode === 'demo' ? 'var(--color-green)' : 'var(--color-red)';
    }

    renderAssetList();
    renderPositions();
    renderHistory();
  });

  // Setup Event Listeners
  if (assetSearchInput) {
    assetSearchInput.addEventListener('input', renderAssetList);
  }

  assetCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      assetCategoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat') || 'all';
      renderAssetList();
    });
  });

  // Quick Stake Buttons
  document.querySelectorAll('.quick-stake-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-val'));
      if (tradeStakeInput) {
        tradeStakeInput.value = val;
        updatePayoutCalculations();
      }
    });
  });

  if (tradeStakeInput) {
    tradeStakeInput.addEventListener('input', updatePayoutCalculations);
  }

  // Trade Type Tabs
  let selectedTradeType = 'rise';
  let selectedDigit = 4; // Default selected digit for Matches/Differs/Over/Under

  // Digit selector button handlers
  document.querySelectorAll('.digit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.digit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDigit = parseInt(btn.getAttribute('data-digit'), 10);
      const infoEl = document.getElementById('digitPredictionInfo');
      if (infoEl) infoEl.textContent = 'Selected: ' + selectedDigit;
      updatePayoutCalculations();
    });
  });

  window.updateTradeTypeUI = function updateTradeTypeUI(tradeType) {
    const btnRiseTitle = document.getElementById('btnRiseTitle');
    const btnFallTitle = document.getElementById('btnFallTitle');
    const digitGroup = document.getElementById('digitPredictionGroup');
    const digitLabel = document.getElementById('digitPredictionLabel');
    const termsDesc = document.getElementById('contractTermsDesc');
    const payoutBadge = document.getElementById('tradeTypePayoutBadge');

    // Default: hide digit selector
    if (digitGroup) digitGroup.style.display = 'none';

    // Update Rise green button style
    const riseBtn = document.getElementById('btnRise');
    const fallBtn = document.getElementById('btnFall');
    if (riseBtn) {
      riseBtn.className = 'btn-trade btn-rise';
    }
    if (fallBtn) {
      fallBtn.className = 'btn-trade btn-fall';
    }

    switch (tradeType) {
      case 'rise':
        if (btnRiseTitle) btnRiseTitle.textContent = 'RISE';
        if (btnFallTitle) btnFallTitle.textContent = 'FALL';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; RISE wins if price closes strictly higher at expiry.<br>&bull; FALL wins if price closes lower.<br>&bull; 95% net profit on winning contracts.';
        break;

      case 'even_odd':
        if (btnRiseTitle) btnRiseTitle.textContent = 'EVEN';
        if (btnFallTitle) btnFallTitle.textContent = 'ODD';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; EVEN wins if the last digit of the exit price is 0, 2, 4, 6, or 8.<br>&bull; ODD wins if the last digit is 1, 3, 5, 7, or 9.<br>&bull; 95% net profit on winning contracts.';
        if (riseBtn) riseBtn.style.background = 'linear-gradient(135deg, #3772ff, #2055cc)';
        if (fallBtn) fallBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #c0392b)';
        break;

      case 'match_diff':
        if (btnRiseTitle) btnRiseTitle.textContent = 'MATCHES';
        if (btnFallTitle) btnFallTitle.textContent = 'DIFFERS';
        if (digitGroup) { digitGroup.style.display = 'block'; }
        if (digitLabel) digitLabel.textContent = 'SELECT DIGIT (0-9)';
        if (payoutBadge) payoutBadge.textContent = 'Matches: 900% | Differs: 10%';
        if (termsDesc) termsDesc.innerHTML = '&bull; MATCHES wins if the last digit of the exit price equals your selected digit. Pays 900%!<br>&bull; DIFFERS wins if the last digit does NOT equal your selection. Pays 10%.<br>&bull; High risk / high reward on Matches.';
        if (riseBtn) riseBtn.style.background = 'linear-gradient(135deg, #00c49f, #00997b)';
        if (fallBtn) fallBtn.style.background = 'linear-gradient(135deg, #ff444f, #d62b35)';
        break;

      case 'over_under':
        if (btnRiseTitle) btnRiseTitle.textContent = 'OVER';
        if (btnFallTitle) btnFallTitle.textContent = 'UNDER';
        if (digitGroup) { digitGroup.style.display = 'block'; }
        if (digitLabel) digitLabel.textContent = 'SELECT BARRIER DIGIT (0-9)';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; OVER wins if the last digit of the exit price is GREATER than your selected digit.<br>&bull; UNDER wins if the last digit is LESS than your selected digit.<br>&bull; 95% net profit on winning contracts.';
        if (riseBtn) riseBtn.style.background = 'linear-gradient(135deg, #00c49f, #00997b)';
        if (fallBtn) fallBtn.style.background = 'linear-gradient(135deg, #ff444f, #d62b35)';
        break;

      case 'higher':
        if (btnRiseTitle) btnRiseTitle.textContent = 'HIGHER';
        if (btnFallTitle) btnFallTitle.textContent = 'LOWER';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; HIGHER wins if exit price is above the barrier.<br>&bull; LOWER wins if exit price is below the barrier.<br>&bull; 95% net profit.';
        break;

      case 'touch':
        if (btnRiseTitle) btnRiseTitle.textContent = 'TOUCH';
        if (btnFallTitle) btnFallTitle.textContent = 'NO TOUCH';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; TOUCH wins if price reaches the barrier at any time before expiry.<br>&bull; NO TOUCH wins if price never reaches the barrier.<br>&bull; 95% net profit.';
        break;

      case 'in':
        if (btnRiseTitle) btnRiseTitle.textContent = 'ENDS IN';
        if (btnFallTitle) btnFallTitle.textContent = 'ENDS OUT';
        if (payoutBadge) payoutBadge.textContent = '95% Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; IN wins if exit price is between the upper and lower barriers.<br>&bull; OUT wins if exit price is outside the barriers.<br>&bull; 95% net profit.';
        break;

      case 'multiplier':
        if (btnRiseTitle) btnRiseTitle.textContent = 'UP Ã—10';
        if (btnFallTitle) btnFallTitle.textContent = 'DOWN Ã—10';
        if (payoutBadge) payoutBadge.textContent = 'Multiplied Payout';
        if (termsDesc) termsDesc.innerHTML = '&bull; UP wins if exit price is above entry; profit is multiplied.<br>&bull; DOWN wins if exit price is below entry; profit is multiplied.<br>&bull; No cap on potential profit.';
        break;
    }
    updatePayoutCalculations();
  }

  document.querySelectorAll('.trade-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.trade-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTradeType = btn.getAttribute('data-type') || 'rise';
      updateTradeTypeUI(selectedTradeType);
    });
  });

  // Timeframe selector
  document.querySelectorAll('.tf-group .tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tf-group .tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      MoneySpread.setTimeframe(btn.textContent.trim().toLowerCase());
    });
  });

  // Chart type toggle (Candles, Line/Area, Digits Only)
  document.querySelectorAll('.type-group .tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-group .tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chartType = btn.getAttribute('data-chart-type') || 'candle';
      MoneySpread.chartType = chartType;

      const chartViewport = document.getElementById('chartViewport');
      const digitsBoard = document.getElementById('digitsOnlyBoard');

      if (chartType === 'digits') {
        if (chartViewport) chartViewport.style.display = 'none';
        if (digitsBoard) {
          digitsBoard.style.display = 'flex';
          MoneySpread.renderDigitsOnlyBoard();
        }
      } else {
        if (chartViewport) chartViewport.style.display = 'block';
        if (digitsBoard) digitsBoard.style.display = 'none';
        if (MoneySpread.chart) MoneySpread.chart.update();
      }
    });
  });

  // Rise / Fall button execution (also handles Even/Odd, Matches/Differs, Over/Under)
  if (btnRise) {
    btnRise.addEventListener('click', () => {
      let type = 'rise';
      switch (selectedTradeType) {
        case 'rise': type = 'rise'; break;
        case 'even_odd': type = 'even'; break;
        case 'match_diff': type = 'matches'; break;
        case 'over_under': type = 'over'; break;
        case 'higher': type = 'higher'; break;
        case 'touch': type = 'touch'; break;
        case 'in': type = 'in'; break;
        case 'multiplier': type = 'multiplier'; break;
      }
      MoneySpread.buyContract({
        type,
        stake: parseFloat(tradeStakeInput ? tradeStakeInput.value : 10),
        durationVal: parseInt(tradeDurationInput ? tradeDurationInput.value : 15, 10),
        durationUnit: tradeDurationUnit ? tradeDurationUnit.value : 's',
        predictedDigit: selectedDigit
      });
    });
  }

  if (btnFall) {
    btnFall.addEventListener('click', () => {
      let type = 'fall';
      switch (selectedTradeType) {
        case 'rise': type = 'fall'; break;
        case 'even_odd': type = 'odd'; break;
        case 'match_diff': type = 'differs'; break;
        case 'over_under': type = 'under'; break;
        case 'higher': type = 'lower'; break;
        case 'touch': type = 'no_touch'; break;
        case 'in': type = 'out'; break;
        case 'multiplier': type = 'multiplier'; break;
      }
      MoneySpread.buyContract({
        type,
        stake: parseFloat(tradeStakeInput ? tradeStakeInput.value : 10),
        durationVal: parseInt(tradeDurationInput ? tradeDurationInput.value : 15, 10),
        durationUnit: tradeDurationUnit ? tradeDurationUnit.value : 's',
        predictedDigit: selectedDigit
      });
    });
  }

  // Bottom drawer tabs
  document.querySelectorAll('.drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      document.querySelectorAll('.drawer-tab-content').forEach(c => c.style.display = 'none');
      const el = document.getElementById(target);
      if (el) el.style.display = 'block';
    });
  });

  // Account switch pill in header
  const accountPill = document.querySelector('.account-selector-pill');
  if (accountPill) {
    accountPill.addEventListener('click', () => {
      MoneySpread.toggleAccountMode();
    });
  }

  renderAssetList();
  updatePayoutCalculations();
}

// --- LANDING PAGE (index.html) CONTROLLER ---
function initLandingPage() {
  // Hero particle effect canvas
  const canvas = document.getElementById('heroParticlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement.clientHeight || 600;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 600;
    });

    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        color: Math.random() > 0.5 ? 'rgba(255, 68, 79, 0.4)' : 'rgba(0, 196, 159, 0.4)'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // Interactive Asset category showcase on landing page
  const tabBtns = document.querySelectorAll('.asset-tabs .tab-btn');
  const showcaseContainer = document.getElementById('assetShowcaseGrid');

  function renderShowcase(cat) {
    if (!showcaseContainer) return;
    const assets = ASSET_CATALOG.filter(a => cat === 'all' || a.category === cat).slice(0, 8);
    let html = '';
    assets.forEach(a => {
      const isUp = a.changePct >= 0;
      const cls = isUp ? 'price-up' : 'price-down';
      const arrow = isUp ? '+' : '';
      html += `
        <div class="asset-card" onclick="window.location.href='trading.html?symbol=${a.id}'" style="cursor: pointer;">
          <div class="asset-card-top">
            <div class="asset-name-group">
              <span class="asset-code">${a.symbol}</span>
              <span class="asset-full-name">${a.name}</span>
            </div>
            <div class="asset-price-group">
              <span class="asset-live-price ${cls}">${a.price.toFixed(a.decimals)}</span>
              <span class="asset-change ${cls}">${arrow}${a.changePct.toFixed(2)}%</span>
            </div>
          </div>
          <div style="display:flex; justify-content: space-between; align-items:center; font-size:0.75rem; color: var(--text-muted); margin-top: 6px;">
            <span>Spread: <strong>${a.spread}</strong></span>
            <span class="badge-live" style="font-size:0.65rem;">TRADE NOW &rarr;</span>
          </div>
        </div>
      `;
    });
    showcaseContainer.innerHTML = html;
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderShowcase(btn.getAttribute('data-cat') || 'synthetic');
    });
  });

  renderShowcase('synthetic');
  MoneySpread.subscribe(() => {
    const activeBtn = document.querySelector('.asset-tabs .tab-btn.active');
    const cat = activeBtn ? activeBtn.getAttribute('data-cat') : 'synthetic';
    renderShowcase(cat);
  });
}

// --- MARKETS PAGE CONTROLLER ---
function initMarketsPage() {
  const tableBody = document.getElementById('marketsTableBody');
  const searchInput = document.getElementById('marketSearchInput');
  const categoryBtns = document.querySelectorAll('.market-category-btn');
  let currentCategory = 'all';

  function renderMarketsTable() {
    if (!tableBody) return;
    const query = (searchInput ? searchInput.value.toLowerCase() : '').trim();
    const filtered = ASSET_CATALOG.filter(a => {
      const matchCat = currentCategory === 'all' || a.category === currentCategory;
      const matchQuery = !query || a.symbol.toLowerCase().includes(query) || a.name.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    let html = '';
    filtered.forEach(a => {
      const isUp = a.changePct >= 0;
      const cls = isUp ? 'price-up' : 'price-down';
      const arrow = isUp ? '+' : '';

      html += `
        <tr>
          <td>
            <div class="asset-title-group">
              <div class="asset-icon-box">${a.symbol.slice(0, 2)}</div>
              <div>
                <strong style="color: #fff;">${a.symbol}</strong>
                <div style="font-size: 0.76rem; color: var(--text-muted);">${a.name}</div>
              </div>
            </div>
          </td>
          <td><span style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary);">${a.category}</span></td>
          <td><strong class="${cls}" style="font-family: var(--font-mono); font-size: 1rem;">${a.price.toFixed(a.decimals)}</strong></td>
          <td class="${cls}" style="font-family: var(--font-mono); font-weight: 700;">${arrow}${a.changePct.toFixed(2)}%</td>
          <td style="font-family: var(--font-mono);">${a.high24h.toFixed(a.decimals)}</td>
          <td style="font-family: var(--font-mono);">${a.low24h.toFixed(a.decimals)}</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${a.spread}</td>
          <td>
            <a href="trading.html?symbol=${a.id}" class="btn btn-primary btn-sm">Trade</a>
          </td>
        </tr>
      `;
    });
    tableBody.innerHTML = html;
  }

  if (searchInput) searchInput.addEventListener('input', renderMarketsTable);

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat') || 'all';
      renderMarketsTable();
    });
  });

  renderMarketsTable();
  MoneySpread.subscribe(renderMarketsTable);
}

// --- ACCOUNT PAGE CONTROLLER ---
function initAccountPage() {
  const balanceEl = document.getElementById('accountLargeBalance');
  const modeTag = document.getElementById('accountModeBadge');
  const toggleBtn = document.getElementById('accountModeToggleBtn');
  const resetDemoBtn = document.getElementById('btnResetDemo');

  // Populate logged-in user profile info
  renderAccountUserProfile();

  function renderAccountUserProfile() {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (!user) return;

    const nickname = user.nickname || user.name || 'collo';
    const fullName = user.name || nickname;
    const email = user.email || '';
    const cr = user.crNumber || 'CR8779020';

    const nameEl = document.getElementById('accountUserDisplayName');
    if (nameEl) nameEl.textContent = nickname;

    const crEl = document.getElementById('accountUserCrNumber');
    if (crEl) crEl.textContent = cr;

    const avatarEl = document.getElementById('accountUserAvatar');
    const removeBtn = document.getElementById('btnRemoveAvatar');
    const exportBtn = document.getElementById('btnExportAvatar');

    if (avatarEl) {
      if (user.profilePic && user.profilePic.startsWith('data:image')) {
        avatarEl.innerHTML = `<img src="${user.profilePic}" alt="${nickname}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        if (removeBtn) removeBtn.style.display = 'inline-block';
        if (exportBtn) exportBtn.style.display = 'inline-block';
      } else {
        avatarEl.innerHTML = `<span style="font-weight: 800; font-size: 1.3rem;">${(nickname.charAt(0) || 'M').toUpperCase()}</span>`;
        if (removeBtn) removeBtn.style.display = 'none';
        if (exportBtn) exportBtn.style.display = 'none';
      }
    }

    const setFullName = document.getElementById('settingsFullName');
    if (setFullName) setFullName.value = fullName;

    const setNick = document.getElementById('settingsNickname');
    if (setNick) setNick.value = '@' + nickname;

    const setEmail = document.getElementById('settingsEmail');
    if (setEmail) setEmail.value = email;

    const setCr = document.getElementById('settingsCrNumber');
    if (setCr) setCr.value = cr;

    // Top navbar avatar update as well
    const topNavAv = document.getElementById('topNavUserAvatar');
    if (topNavAv) {
      if (user.profilePic && user.profilePic.startsWith('data:image')) {
        topNavAv.innerHTML = `<img src="${user.profilePic}" alt="${nickname}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        topNavAv.textContent = (nickname.charAt(0) || 'M').toUpperCase();
      }
    }
  }

  window.compressAndResizeImage = function(file, maxSize = 256, quality = 0.85) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No image file selected.'));
      if (file.type && !file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image.'));
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error reading image file.'));
      reader.onload = function(e) {
        const img = new Image();
        img.onerror = () => reject(new Error('Invalid image file.'));
        img.onload = function() {
          try {
            const srcW = img.naturalWidth || img.width;
            const srcH = img.naturalHeight || img.height;
            const cropDim = Math.min(srcW, srcH);
            const sx = (srcW - cropDim) / 2;
            const sy = (srcH - cropDim) / 2;
            const targetSize = Math.min(cropDim, maxSize);

            const canvas = document.createElement('canvas');
            canvas.width = targetSize;
            canvas.height = targetSize;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#16162a';
            ctx.fillRect(0, 0, targetSize, targetSize);
            ctx.drawImage(img, sx, sy, cropDim, cropDim, 0, 0, targetSize, targetSize);

            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  window.handleAvatarUpload = async function(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const base64Data = await window.compressAndResizeImage(file, 256, 0.85);
      const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
      if (user) {
        user.profilePic = base64Data;
        localStorage.setItem('ms_user', JSON.stringify(user));
        renderAccountUserProfile();

        try {
          const resp = await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, profilePic: base64Data })
          });
          const data = await resp.json();
          if (data.success) {
            MoneySpread.toast('Profile Picture Updated', 'Your custom avatar has been saved permanently to your account.', 'win');
          }
        } catch (err) {
          console.warn('Profile picture update error:', err);
        }
      }
    } catch (e) {
      alert('Photo notice: ' + (e.message || 'Could not process photo.'));
    } finally {
      event.target.value = '';
    }
  };

  window.exportProfilePhoto = function() {
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (!user || !user.profilePic) {
      alert('No custom picture to export. Click "Import Picture" to set one first.');
      return;
    }
    const a = document.createElement('a');
    a.href = user.profilePic;
    a.download = `moneyspread-avatar-${user.nickname || 'collo'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    MoneySpread.toast('Picture Exported', 'Downloaded avatar to your device.', 'info');
  };

  window.removeProfilePhoto = function() {
    if (!confirm('Remove your custom avatar picture?')) return;
    const user = JSON.parse(localStorage.getItem('ms_user') || 'null');
    if (user) {
      user.profilePic = null;
      localStorage.setItem('ms_user', JSON.stringify(user));
      renderAccountUserProfile();
      fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, profilePic: null })
      }).catch(() => {});
      MoneySpread.toast('Picture Removed', 'Avatar picture has been cleared.', 'info');
    }
  };

  // Stats & History elements
  const accountHistoryBody = document.getElementById('accountHistoryTableBody');
  let currentHistoryFilter = 'all';

  window.setHistoryFilter = function(filter) {
    currentHistoryFilter = filter;
    ['btnFilterAll', 'btnFilterReal', 'btnFilterDemo', 'btnFilterWon', 'btnFilterLost'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.className = 'btn btn-sm btn-outline';
    });
    const map = { all: 'btnFilterAll', real: 'btnFilterReal', demo: 'btnFilterDemo', won: 'btnFilterWon', lost: 'btnFilterLost' };
    const activeBtn = document.getElementById(map[filter]);
    if (activeBtn) activeBtn.className = 'btn btn-sm btn-primary';
    renderAccountHistory();
  };

  function renderAccountHistory() {
    if (!accountHistoryBody) return;
    let list = MoneySpread.tradeHistory || [];
    if (currentHistoryFilter === 'real') {
      list = list.filter(h => h.mode === 'real');
    } else if (currentHistoryFilter === 'demo') {
      list = list.filter(h => h.mode === 'demo');
    } else if (currentHistoryFilter === 'won') {
      list = list.filter(h => h.status === 'WON');
    } else if (currentHistoryFilter === 'lost') {
      list = list.filter(h => h.status === 'LOST');
    }

    const countBadge = document.getElementById('historyCountBadge');
    if (countBadge) countBadge.textContent = list.length;

    if (!list.length) {
      accountHistoryBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No recorded trades matching this filter.</td></tr>`;
      return;
    }

    let html = '';
    list.forEach(h => {
      const isWin = h.status === 'WON';
      const color = isWin ? 'var(--color-green)' : 'var(--color-red)';
      const modeColor = h.mode === 'real' ? '#ff444f' : '#00c49f';
      const entryFormatted = h.entrySpot !== undefined ? Number(h.entrySpot).toFixed(2) : '--';
      const exitFormatted = h.exitSpot !== undefined ? Number(h.exitSpot).toFixed(2) : '--';

      html += `
        <tr>
          <td><code>${h.id || 'MS-TRD'}</code></td>
          <td><span style="background: ${modeColor}22; color: ${modeColor}; border: 1px solid ${modeColor}66; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">${(h.mode || 'demo').toUpperCase()}</span></td>
          <td><strong>${h.symbol || h.name}</strong> ${h.type}</td>
          <td style="font-family: var(--font-mono); font-size: 0.82rem; color: #aaa;">${entryFormatted} &rarr; <span style="color: #fff;">${exitFormatted}</span></td>
          <td>$${Number(h.stake || 0).toFixed(2)}</td>
          <td><span style="color: ${color}; font-weight: 800;">${isWin ? 'WON âœ“' : 'LOST âœ—'}</span></td>
          <td style="color: ${color}; font-weight: 800;">${h.profit >= 0 ? '+' : ''}$${Number(h.profit || 0).toFixed(2)}</td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(h.closedAt || h.startTime || Date.now()).toLocaleTimeString()}</td>
        </tr>
      `;
    });
    accountHistoryBody.innerHTML = html;
  }

  function updateAccountUI() {
    if (balanceEl) {
      balanceEl.textContent = `$${MoneySpread.getBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    if (modeTag) {
      modeTag.textContent = MoneySpread.accountMode.toUpperCase();
      modeTag.className = 'badge-live';
      modeTag.style.borderColor = MoneySpread.accountMode === 'demo' ? 'var(--color-green)' : 'var(--color-red)';
      modeTag.style.color = MoneySpread.accountMode === 'demo' ? 'var(--color-green)' : 'var(--color-red)';
    }

    // Populate Real Account Metrics
    const realStats = MoneySpread.realStats || { totalTrades: 0, wins: 0, losses: 0, netProfit: 0 };
    const realBalEl = document.getElementById('statRealBalHeader');
    if (realBalEl) realBalEl.textContent = `$${MoneySpread.realBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

    const realTotalEl = document.getElementById('statRealTotalTrades');
    if (realTotalEl) realTotalEl.textContent = realStats.totalTrades || 0;

    const realWinLossEl = document.getElementById('statRealWinLoss');
    if (realWinLossEl) realWinLossEl.textContent = `${realStats.wins || 0}W / ${realStats.losses || 0}L`;

    const realWinRateEl = document.getElementById('statRealWinRate');
    if (realWinRateEl) {
      const realRate = realStats.totalTrades > 0 ? (((realStats.wins || 0) / realStats.totalTrades) * 100).toFixed(1) : '0.0';
      realWinRateEl.textContent = `${realRate}%`;
    }

    const realNetEl = document.getElementById('statRealNetProfit');
    if (realNetEl) {
      const net = realStats.netProfit || 0;
      realNetEl.textContent = `${net >= 0 ? '+' : ''}$${net.toFixed(2)}`;
      realNetEl.style.color = net >= 0 ? 'var(--color-green)' : 'var(--color-red)';
    }

    // Populate Demo Account Metrics
    const demoStats = MoneySpread.demoStats || { totalTrades: 0, wins: 0, losses: 0, netProfit: 0 };
    const demoBalEl = document.getElementById('statDemoBalHeader');
    if (demoBalEl) demoBalEl.textContent = `$${MoneySpread.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

    const demoTotalEl = document.getElementById('statDemoTotalTrades');
    if (demoTotalEl) demoTotalEl.textContent = demoStats.totalTrades || 0;

    const demoWinLossEl = document.getElementById('statDemoWinLoss');
    if (demoWinLossEl) demoWinLossEl.textContent = `${demoStats.wins || 0}W / ${demoStats.losses || 0}L`;

    const demoWinRateEl = document.getElementById('statDemoWinRate');
    if (demoWinRateEl) {
      const demoRate = demoStats.totalTrades > 0 ? (((demoStats.wins || 0) / demoStats.totalTrades) * 100).toFixed(1) : '0.0';
      demoWinRateEl.textContent = `${demoRate}%`;
    }

    const demoNetEl = document.getElementById('statDemoNetProfit');
    if (demoNetEl) {
      const net = demoStats.netProfit || 0;
      demoNetEl.textContent = `${net >= 0 ? '+' : ''}$${net.toFixed(2)}`;
      demoNetEl.style.color = net >= 0 ? 'var(--color-green)' : 'var(--color-red)';
    }

    renderAccountHistory();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      MoneySpread.toggleAccountMode();
      updateAccountUI();
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      MoneySpread.resetDemoBalance();
      updateAccountUI();
    });
  }

  // Account Tabs
  document.querySelectorAll('.account-tab-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.account-tab-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const paneId = link.getAttribute('data-pane');
      document.querySelectorAll('.account-tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(paneId);
      if (activePane) activePane.classList.add('active');
    });
  });

  // Deposit Simulator Modal
  const depositForm = document.getElementById('depositSimulationForm');
  if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('depositAmountInput').value);
      if (amount > 0) {
        MoneySpread.setBalance(MoneySpread.getBalance() + amount);
        MoneySpread.toast('Deposit Successful', `$${amount.toFixed(2)} credited to your ${MoneySpread.accountMode.toUpperCase()} account`, 'win');
        updateAccountUI();
      }
    });
  }

  updateAccountUI();
}

// --- INITIALIZE ON DOM CONTENT LOADED ---
document.addEventListener('DOMContentLoaded', () => {
  MoneySpread.init();

  const path = window.location.pathname;
  if (path.includes('trading.html')) {
    initTradingPage();
  } else if (path.includes('markets.html')) {
    initMarketsPage();
  } else if (path.includes('account.html')) {
    initAccountPage();
  } else if (path.includes('index.html') || path.endsWith('/') || !path.includes('.html')) {
    initLandingPage();
  }
});
