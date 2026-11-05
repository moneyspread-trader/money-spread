const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');
const AFFILIATES_FILE = path.join(__dirname, 'data', 'affiliates.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'moneyspread-trader/money-spread';

// Cloud Persistence Sync to GitHub
let cloudSyncTimer = null;
let lastKnownSha = null;

function syncUsersFromCloud() {
  if (!GITHUB_TOKEN) return;
  const req = https.request({
    hostname: 'api.github.com',
    path: `/repos/${GITHUB_REPO}/contents/data/users.json`,
    headers: {
      'User-Agent': 'MoneySpread-Server',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  }, res => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const json = JSON.parse(raw);
          lastKnownSha = json.sha;
          if (json.content) {
            const content = Buffer.from(json.content, 'base64').toString('utf-8');
            const remoteUsers = JSON.parse(content);
            if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
              const localUsers = readUsers();
              const mergedMap = new Map();
              localUsers.forEach(u => mergedMap.set((u.email || u.crNumber || '').toLowerCase(), u));
              remoteUsers.forEach(u => {
                const key = (u.email || u.crNumber || '').toLowerCase();
                if (!mergedMap.has(key)) {
                  mergedMap.set(key, u);
                } else {
                  const local = mergedMap.get(key);
                  if (u.profilePic && !local.profilePic) local.profilePic = u.profilePic;
                  if (u.winRate !== undefined && u.winRate !== null) local.winRate = u.winRate;
                  if (u.realBalance !== undefined) local.realBalance = u.realBalance;
                  if (u.demoBalance !== undefined) local.demoBalance = u.demoBalance;
                  mergedMap.set(key, local);
                }
              });
              const merged = Array.from(mergedMap.values());
              const dir = path.dirname(DATA_FILE);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
              console.log(`[CloudSync] Pulled & merged ${merged.length} traders from cloud repository.`);
            }
          }
        } catch (e) {
          console.error('[CloudSync] Error parsing remote users:', e.message);
        }
      }
    });
  });
  req.on('error', err => console.error('[CloudSync] Fetch failed:', err.message));
  req.end();
}

function pushUsersToCloud(users) {
  if (!GITHUB_TOKEN) return;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    const shaReq = https.request({
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_REPO}/contents/data/users.json`,
      headers: {
        'User-Agent': 'MoneySpread-Server',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let sha = lastKnownSha;
        if (res.statusCode === 200) {
          try { sha = JSON.parse(data).sha; } catch(e) {}
        }
        const contentBase64 = Buffer.from(JSON.stringify(users, null, 2), 'utf-8').toString('base64');
        const putBody = JSON.stringify({
          message: 'Auto-persist traders database [skip ci]',
          content: contentBase64,
          sha: sha || undefined
        });
        const putReq = https.request({
          hostname: 'api.github.com',
          path: `/repos/${GITHUB_REPO}/contents/data/users.json`,
          method: 'PUT',
          headers: {
            'User-Agent': 'MoneySpread-Server',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          }
        }, putRes => {
          let resData = '';
          putRes.on('data', c => resData += c);
          putRes.on('end', () => {
            if (putRes.statusCode === 200 || putRes.statusCode === 201) {
              try { lastKnownSha = JSON.parse(resData).content.sha; } catch(e) {}
              console.log('[CloudSync] Users database successfully synced to GitHub.');
            }
          });
        });
        putReq.on('error', e => console.error('[CloudSync] Push error:', e.message));
        putReq.write(putBody);
        putReq.end();
      });
    });
    shaReq.on('error', e => console.error('[CloudSync] SHA check error:', e.message));
    shaReq.end();
  }, 2500);
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function generateUniqueCR(users) {
  let cr;
  do {
    cr = 'CR' + Math.floor(1000000 + Math.random() * 9000000);
  } while (users.some(u => u.crNumber === cr));
  return cr;
}

function generateUniqueAffiliateCode(affiliates) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = 'SPREAD-' + rand;
  } while (affiliates.some(a => (a.affiliateCode || '').toUpperCase() === code));
  return code;
}

function readAffiliates() {
  try {
    if (!fs.existsSync(AFFILIATES_FILE)) return [];
    const raw = fs.readFileSync(AFFILIATES_FILE, 'utf-8');
    const affiliates = JSON.parse(raw || '[]');
    let modified = false;
    affiliates.forEach(a => {
      if (!a.affiliateCode) {
        a.affiliateCode = generateUniqueAffiliateCode(affiliates);
        modified = true;
      }
      if (!a.crNumber) {
        a.crNumber = 'CR' + Math.floor(1000000 + Math.random() * 9000000);
        modified = true;
      }
    });
    if (modified) saveAffiliates(affiliates);
    return affiliates;
  } catch (e) {
    return [];
  }
}

function saveAffiliates(affiliates) {
  try {
    const dir = path.dirname(AFFILIATES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AFFILIATES_FILE, JSON.stringify(affiliates, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving affiliates:', e);
  }
}

function readUsers() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const users = JSON.parse(raw || '[]');
    let modified = false;
    users.forEach(u => {
      if (!u.crNumber) {
        u.crNumber = generateUniqueCR(users);
        modified = true;
      }
      if (u.demoBalance === undefined) {
        u.demoBalance = 10000.00;
        modified = true;
      }
      if (u.realBalance === undefined) {
        u.realBalance = 0.00;
        modified = true;
      }
      if (!u.demoStats) {
        u.demoStats = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 };
        modified = true;
      }
      if (!u.realStats) {
        u.realStats = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 };
        modified = true;
      }
      if (!Array.isArray(u.demoTradeHistory)) {
        u.demoTradeHistory = [];
        modified = true;
      }
      if (!Array.isArray(u.realTradeHistory)) {
        u.realTradeHistory = [];
        modified = true;
      }
            if (u.winRate === undefined) {
        u.winRate = null; // null = natural market evaluation, number 0-100 = forced percentage
        modified = true;
      }
      if (!Array.isArray(u.transactions)) {
        u.transactions = [];
        modified = true;
      }
    });
    if (modified) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    }
    return users;
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    pushUsersToCloud(users);
  } catch (e) {
    console.error('Error saving users:', e);
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // API: Register
  if (req.method === 'POST' && pathname === '/api/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, nickname, email, pass, affiliateCode } = JSON.parse(body);
        const users = readUsers();

        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanNick = (nickname || '').trim().toLowerCase();

        if (users.some(u => (u.email || '').toLowerCase() === cleanEmail)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This email is already registered. Please log in.' }));
          return;
        }

        if (users.some(u => (u.nickname || '').toLowerCase() === cleanNick)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `The nickname "${nickname}" is already taken.` }));
          return;
        }

        const crNumber = generateUniqueCR(users);

        // Check if an optional affiliate code was provided
        let linkedAffiliateCode = null;
        if (affiliateCode && affiliateCode.trim()) {
          const codeUpper = affiliateCode.trim().toUpperCase();
          const affiliates = readAffiliates();
          const matchedAff = affiliates.find(a => (a.affiliateCode || '').toUpperCase() === codeUpper);
          if (matchedAff) {
            linkedAffiliateCode = matchedAff.affiliateCode;
            matchedAff.totalReferred = (matchedAff.totalReferred || 0) + 1;
            if (!matchedAff.referredTraders) matchedAff.referredTraders = [];
            matchedAff.referredTraders.unshift({
              name: (name || '').trim(),
              nickname: cleanNick,
              email: cleanEmail,
              crNumber: crNumber,
              registeredAt: new Date().toISOString()
            });
            saveAffiliates(affiliates);
          }
        }

        const newUser = {
          crNumber,
          name: (name || '').trim(),
          nickname: cleanNick,
          email: cleanEmail,
          pass,
          demoBalance: 10000.00,
          realBalance: 0.00,
          demoStats: { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 },
          realStats: { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 },
          demoTradeHistory: [],
          realTradeHistory: [],
          transactions: [],
          referredBy: linkedAffiliateCode,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: newUser }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process registration.' }));
      }
    });
    return;
  }

  // API: Login
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { identifier, pass } = JSON.parse(body);
        const users = readUsers();

        const cleanId = (identifier || '').trim().toLowerCase();
        const user = users.find(u => 
          ((u.email || '').toLowerCase() === cleanId || (u.nickname || '').toLowerCase() === cleanId) &&
          u.pass === pass
        );

        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid credentials. Please verify your email/nickname and password.' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process login.' }));
      }
    });
    return;
  }

  // API: Secure Password Reset with Ownership Verification Proof
  if (req.method === 'POST' && pathname === '/api/reset-password') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, crNumber, newPassword } = JSON.parse(body);
        if (!email || !crNumber || !newPassword || newPassword.length < 4) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'All fields required: Registered Email, Secret CR Account Number, and New Password.' }));
          return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanCr = crNumber.trim().toUpperCase();

        // 1. Check Traders
        const users = readUsers();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (user) {
          // Strictly verify ownership with CR Number
          if ((user.crNumber || '').toUpperCase() !== cleanCr) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Security Verification Failed: The provided CR Account Number does not match this email address. You must prove ownership with your secret CR Account ID.' }));
            return;
          }

          user.pass = newPassword;
          saveUsers(users);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Ownership verified! Password reset successfully.', 
            accountType: 'trader',
            user 
          }));
          return;
        }

        // 2. Check Affiliates
        const affiliates = readAffiliates();
        const aff = affiliates.find(a => (a.email || '').toLowerCase() === cleanEmail);

        if (aff) {
          // Verify ownership with CR Number or Affiliate Tracking Code
          const matchCr = (aff.crNumber || '').toUpperCase() === cleanCr;
          const matchCode = (aff.affiliateCode || '').toUpperCase() === cleanCr;
          if (!matchCr && !matchCode) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Security Verification Failed: The provided CR/Partner Code does not match this affiliate account.' }));
            return;
          }

          aff.pass = newPassword;
          saveAffiliates(affiliates);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Ownership verified! Affiliate password reset successfully.', 
            accountType: 'affiliate',
            affiliate: aff 
          }));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No account registered with this email address.' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error processing password reset.' }));
      }
    });
    return;
  }

  // API: Update Profile (Avatar Image, Nickname, Name)
  if (req.method === 'POST' && pathname === '/api/update-profile') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, nickname, name, profilePic } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trader not found.' }));
          return;
        }

        if (nickname) user.nickname = nickname.trim();
        if (name) user.name = name.trim();
        if (profilePic !== undefined) user.profilePic = profilePic;

        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update profile.' }));
      }
    });
    return;
  }

  // API: Sync Client User (Guarantees accounts registered on mobile/local are never lost)
  if (req.method === 'POST' && pathname === '/api/sync-client-user') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const clientUser = JSON.parse(body);
        if (!clientUser || (!clientUser.email && !clientUser.crNumber)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid client user data' }));
          return;
        }
        const users = readUsers();
        const cleanEmail = (clientUser.email || '').trim().toLowerCase();
        const cleanCr = (clientUser.crNumber || '').trim().toUpperCase();
        const idx = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail || (u.crNumber || '').toUpperCase() === cleanCr);
        if (idx === -1) {
          users.push(clientUser);
          saveUsers(users);
          console.log('[SyncClient] Added trader account to server:', clientUser.name, clientUser.email);
        } else {
          let changed = false;
          if (clientUser.profilePic && !users[idx].profilePic) {
            users[idx].profilePic = clientUser.profilePic;
            changed = true;
          }
          if (clientUser.realBalance !== undefined) {
            const clientBal = parseFloat(clientUser.realBalance);
            if (isNaN(users[idx].realBalance) || clientBal > (users[idx].realBalance || 0)) {
              users[idx].realBalance = clientBal;
              changed = true;
            }
          }
          if (clientUser.demoBalance !== undefined && users[idx].demoBalance === undefined) {
            users[idx].demoBalance = parseFloat(clientUser.demoBalance);
            changed = true;
          }
          if (changed) saveUsers(users);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: users.length }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Sync failed' }));
      }
    });
    return;
  }

  // API: Update Balance
  if (req.method === 'POST' && pathname === '/api/update-balance') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, demoBalance, realBalance } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const idx = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (idx !== -1) {
          if (demoBalance !== undefined) users[idx].demoBalance = parseFloat(parseFloat(demoBalance).toFixed(2));
          if (realBalance !== undefined) users[idx].realBalance = parseFloat(parseFloat(realBalance).toFixed(2));
          saveUsers(users);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: users[idx] }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update balance.' }));
      }
    });
    return;
  }

  // API: Get User Profile (Returns accurate real-time balances, stats, and trade history)
  if (req.method === 'GET' && pathname === '/api/user-profile') {
    const emailParam = parsedUrl.searchParams.get('email');
    if (!emailParam) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email parameter required.' }));
      return;
    }
    const users = readUsers();
    const cleanEmail = emailParam.trim().toLowerCase();
    const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Trader not found.' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, user }));
    return;
  }

  // API: Record Trade & Update Exact Stats & Balances Permanently
  if (req.method === 'POST' && pathname === '/api/record-trade') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, trade, newDemoBalance, newRealBalance } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trader not found.' }));
          return;
        }

        if (newDemoBalance !== undefined) user.demoBalance = parseFloat(parseFloat(newDemoBalance).toFixed(2));
        if (newRealBalance !== undefined) user.realBalance = parseFloat(parseFloat(newRealBalance).toFixed(2));

        if (trade) {
          const isReal = trade.mode === 'real';
          const statsKey = isReal ? 'realStats' : 'demoStats';
          const historyKey = isReal ? 'realTradeHistory' : 'demoTradeHistory';

          if (!user[statsKey]) {
            user[statsKey] = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 };
          }
          if (!Array.isArray(user[historyKey])) {
            user[historyKey] = [];
          }

          const stats = user[statsKey];
          stats.totalTrades = (stats.totalTrades || 0) + 1;
          if (trade.status === 'WON') {
            stats.wins = (stats.wins || 0) + 1;
          } else {
            stats.losses = (stats.losses || 0) + 1;
          }
          const profit = parseFloat(trade.profit) || 0;
          stats.netProfit = parseFloat(((stats.netProfit || 0) + profit).toFixed(2));

          // Save trade to history (most recent first)
          user[historyKey].unshift(trade);
          if (user[historyKey].length > 300) user[historyKey].pop();
        }

        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to record trade.' }));
      }
    });
    return;
  }

  // API: Reset Demo Balance & Demo History
  if (req.method === 'POST' && pathname === '/api/reset-demo') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trader not found.' }));
          return;
        }

        user.demoBalance = 10000.00;
        user.demoStats = { totalTrades: 0, wins: 0, losses: 0, netProfit: 0.00 };
        user.demoTradeHistory = [];

        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to reset demo account.' }));
      }
    });
    return;
  }

  // API: Record Transaction (Deposit / Withdrawal log)
  if (req.method === 'POST' && pathname === '/api/record-transaction') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, transaction } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Trader not found.' }));
          return;
        }

        if (!Array.isArray(user.transactions)) user.transactions = [];
        if (transaction) {
          user.transactions.unshift({
            id: transaction.id || ('TX-' + Math.floor(10000000 + Math.random() * 90000000)),
            type: transaction.type, // 'deposit' or 'withdrawal'
            amount: parseFloat(transaction.amount) || 0,
            method: transaction.method || 'M-Pesa STK Push',
            status: transaction.status || 'COMPLETED',
            date: transaction.date || new Date().toISOString()
          });
          if (user.transactions.length > 200) user.transactions.pop();
        }

        saveUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to record transaction.' }));
      }
    });
    return;
  }

  // API: Admin Login
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body);
        if (password === 'COLWAY16') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, token: 'admin_authenticated' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Incorrect admin password.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to authenticate admin.' }));
      }
    });
    return;
  }

  // API: Admin Get All Users
  if (req.method === 'GET' && pathname === '/api/admin/users') {
    const authHeader = req.headers['authorization'];
    if (authHeader !== 'Bearer admin_authenticated') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized.' }));
      return;
    }
    const users = readUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, users }));
    return;
  }

  // API: Admin Update User
  if (req.method === 'POST' && pathname === '/api/admin/update-user') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const authHeader = req.headers['authorization'];
        if (authHeader !== 'Bearer admin_authenticated') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized.' }));
          return;
        }

        const { email, demoBalance, realBalance, pass, name, nickname, winRate } = JSON.parse(body);
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const idx = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail);

        if (idx !== -1) {
          if (demoBalance !== undefined) users[idx].demoBalance = parseFloat(demoBalance);
          if (realBalance !== undefined) users[idx].realBalance = parseFloat(realBalance);
          if (pass) users[idx].pass = pass;
          if (name) users[idx].name = name;
          if (nickname) users[idx].nickname = nickname;
          if (winRate !== undefined) {
            users[idx].winRate = winRate === '' || winRate === null ? null : parseFloat(winRate);
          }

          saveUsers(users);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: users[idx] }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update user.' }));
      }
    });
    return;
  }

  // API: Admin Delete User
  if (req.method === 'POST' && pathname === '/api/admin/delete-user') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const authHeader = req.headers['authorization'];
        if (authHeader !== 'Bearer admin_authenticated') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized.' }));
          return;
        }

        const { email } = JSON.parse(body);
        let users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const initialLen = users.length;
        users = users.filter(u => (u.email || '').toLowerCase() !== cleanEmail);

        if (users.length < initialLen) {
          saveUsers(users);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to delete user.' }));
      }
    });
    return;
  }

  // API: Record Deposit & Award Affiliate Commission (10%)
  if (req.method === 'POST' && pathname === '/api/record-deposit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, amount } = JSON.parse(body);
        const depAmount = parseFloat(amount) || 0;
        const users = readUsers();
        const cleanEmail = (email || '').trim().toLowerCase();
        const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail || (u.nickname || '').toLowerCase() === cleanEmail);

        let commissionAwarded = 0;
        let affiliateCodeUsed = null;

        if (user) {
          if (!Array.isArray(user.transactions)) user.transactions = [];
          user.transactions.unshift({
            id: 'DEP-' + Math.floor(10000000 + Math.random() * 90000000),
            type: 'deposit',
            amount: depAmount,
            method: 'M-Pesa STK Push',
            status: 'COMPLETED',
            date: new Date().toISOString()
          });
          saveUsers(users);
        }

        if (user && user.referredBy && depAmount > 0) {
          const affiliates = readAffiliates();
          const aff = affiliates.find(a => (a.affiliateCode || '').toUpperCase() === user.referredBy.toUpperCase());
          if (aff) {
            commissionAwarded = parseFloat((depAmount * 0.10).toFixed(2));
            aff.commissionEarned = parseFloat(((aff.commissionEarned || 0) + commissionAwarded).toFixed(2));
            aff.realBalance = parseFloat(((aff.realBalance || 0) + commissionAwarded).toFixed(2));
            if (!aff.commissionLedger) aff.commissionLedger = [];
            aff.commissionLedger.unshift({
              trader: user.nickname || user.name || user.email,
              depositAmount: depAmount,
              commission: commissionAwarded,
              date: new Date().toISOString()
            });
            saveAffiliates(affiliates);
            affiliateCodeUsed = aff.affiliateCode;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, commissionAwarded, affiliateCodeUsed }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to record deposit.' }));
      }
    });
    return;
  }

  // API: Affiliate Register
  if (req.method === 'POST' && pathname === '/api/affiliate/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, phone, email, pass } = JSON.parse(body);
        const affiliates = readAffiliates();

        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPhone = (phone || '').trim();

        if (affiliates.some(a => (a.email || '').toLowerCase() === cleanEmail)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This email is already registered as an affiliate.' }));
          return;
        }

        if (affiliates.some(a => (a.phone || '').trim() === cleanPhone)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This payment phone number is already registered.' }));
          return;
        }

        const affiliateCode = generateUniqueAffiliateCode(affiliates);
        const crNumber = 'CR' + Math.floor(1000000 + Math.random() * 9000000);

        const newAffiliate = {
          crNumber,
          affiliateCode,
          name: (name || '').trim(),
          phone: cleanPhone,
          email: cleanEmail,
          pass,
          demoBalance: 10000.00,
          realBalance: 0.00,
          commissionEarned: 0.00,
          totalReferred: 0,
          referredTraders: [],
          commissionLedger: [],
          createdAt: new Date().toISOString()
        };

        affiliates.push(newAffiliate);
        saveAffiliates(affiliates);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, affiliate: newAffiliate }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to register affiliate.' }));
      }
    });
    return;
  }

  // API: Affiliate Login
  if (req.method === 'POST' && pathname === '/api/affiliate/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { identifier, pass } = JSON.parse(body);
        const affiliates = readAffiliates();

        const cleanId = (identifier || '').trim().toLowerCase();
        const aff = affiliates.find(a => 
          ((a.email || '').toLowerCase() === cleanId || 
           (a.affiliateCode || '').toLowerCase() === cleanId || 
           (a.phone || '').trim() === cleanId) &&
          a.pass === pass
        );

        if (!aff) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid affiliate credentials.' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, affiliate: aff }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process affiliate login.' }));
      }
    });
    return;
  }

  // API: Admin Get All Affiliates
  if (req.method === 'GET' && pathname === '/api/admin/affiliates') {
    const authHeader = req.headers['authorization'];
    if (authHeader !== 'Bearer admin_authenticated') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized.' }));
      return;
    }
    const affiliates = readAffiliates();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, affiliates }));
    return;
  }

  // API: Admin Update Affiliate
  if (req.method === 'POST' && pathname === '/api/admin/update-affiliate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const authHeader = req.headers['authorization'];
        if (authHeader !== 'Bearer admin_authenticated') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized.' }));
          return;
        }

        const { email, commissionEarned, realBalance, phone, name, pass } = JSON.parse(body);
        const affiliates = readAffiliates();
        const cleanEmail = (email || '').trim().toLowerCase();
        const idx = affiliates.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);

        if (idx !== -1) {
          if (commissionEarned !== undefined) affiliates[idx].commissionEarned = parseFloat(commissionEarned);
          if (realBalance !== undefined) affiliates[idx].realBalance = parseFloat(realBalance);
          if (phone) affiliates[idx].phone = phone;
          if (name) affiliates[idx].name = name;
          if (pass) affiliates[idx].pass = pass;

          saveAffiliates(affiliates);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, affiliate: affiliates[idx] }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Affiliate not found.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to update affiliate.' }));
      }
    });
    return;
  }

  // API: Admin Delete Affiliate
  if (req.method === 'POST' && pathname === '/api/admin/delete-affiliate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const authHeader = req.headers['authorization'];
        if (authHeader !== 'Bearer admin_authenticated') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized.' }));
          return;
        }

        const { email } = JSON.parse(body);
        let affiliates = readAffiliates();
        const cleanEmail = (email || '').trim().toLowerCase();
        const initialLen = affiliates.length;
        affiliates = affiliates.filter(a => (a.email || '').toLowerCase() !== cleanEmail);

        if (affiliates.length < initialLen) {
          saveAffiliates(affiliates);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Affiliate not found.' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to delete affiliate.' }));
      }
    });
    return;
  }

  // Static File Serving
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Money Spread server running on port ${PORT}`);
  syncUsersFromCloud();
});
