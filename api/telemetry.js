// AirGrove Real-Time Telemetry & Metrics Engine
// Automatically deployed as a Vercel Serverless Function

let stats = {
  activeTransfers: 0,
  totalTransfers: 0,
  successfulTransfers: 0,
  failedTransfers: 0,
  totalBytesTransferred: 0,
  recentLogs: []
};

function addLog(entry) {
  stats.recentLogs.unshift(entry);
  if (stats.recentLogs.length > 50) {
    stats.recentLogs.pop();
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const successRate = stats.totalTransfers > 0
      ? Math.round((stats.successfulTransfers / stats.totalTransfers) * 100)
      : 100;

    // Check if HTML view requested (?format=html or ?view=html)
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.searchParams.get('format') === 'html' || url.searchParams.get('view') === 'html') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const logRows = stats.recentLogs.map(l => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding: 10px 12px; color: #8892b0; font-family: monospace; font-size: 12px;">${new Date(l.timestamp).toLocaleTimeString()}</td>
          <td style="padding: 10px 12px; font-weight: 600; color: ${l.event.includes('COMPLETE') || l.event.includes('SUCCESS') ? '#10b981' : (l.event.includes('TIMEOUT') || l.event.includes('FAIL') ? '#ef4444' : '#60a5fa')};">${l.event}</td>
          <td style="padding: 10px 12px; color: #cbd5e1; font-size: 13px;">${l.details || JSON.stringify(l)}</td>
        </tr>
      `).join('');

      return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AirGrove Live Telemetry & Vercel Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #06090e; color: #e2e8f0; padding: 32px 20px; }
    .container { max-width: 960px; margin: 0 auto; }
    h1 { font-size: 26px; font-weight: 700; margin-bottom: 6px; color: #f8fafc; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .card { background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
    .card-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px; }
    .card-value { font-size: 28px; font-weight: 800; color: #f8fafc; }
    .card-value.highlight { color: #10b981; }
    .card-value.warn { color: #f59e0b; }
    .card-value.error { color: #ef4444; }
    .logs-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .logs-header { padding: 16px 20px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 600; font-size: 15px; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; background: rgba(0,0,0,0.2); }
    .btn-refresh { display: inline-flex; align-items: center; gap: 8px; background: #10b981; color: #022c22; font-weight: 700; border: none; padding: 10px 18px; border-radius: 9999px; cursor: pointer; text-decoration: none; font-size: 13px; float: right; }
    .btn-refresh:hover { background: #34d399; }
  </style>
</head>
<body>
  <div class="container">
    <div style="margin-bottom: 24px; overflow: hidden;">
      <a href="/api/stats?format=html" class="btn-refresh">↻ Refresh Stats</a>
      <h1>🌿 AirGrove Telemetry</h1>
      <p class="subtitle">Live status of active transfers and failure logs on Vercel</p>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-label">Active Transfers</div>
        <div class="card-value highlight">${Math.max(0, stats.activeTransfers)}</div>
      </div>
      <div class="card">
        <div class="card-label">Total Completed</div>
        <div class="card-value">${stats.successfulTransfers}</div>
      </div>
      <div class="card">
        <div class="card-label">Success Rate</div>
        <div class="card-value ${successRate < 75 ? 'warn' : 'highlight'}">${successRate}%</div>
      </div>
      <div class="card">
        <div class="card-label">Total Failed</div>
        <div class="card-value ${stats.failedTransfers > 0 ? 'error' : ''}">${stats.failedTransfers}</div>
      </div>
      <div class="card">
        <div class="card-label">Total Data</div>
        <div class="card-value">${(stats.totalBytesTransferred / (1024 * 1024)).toFixed(1)} MB</div>
      </div>
    </div>

    <div class="logs-card">
      <div class="logs-header">Recent Telemetry & Connection Logs</div>
      <table>
        <thead>
          <tr>
            <th style="width: 110px;">Time</th>
            <th style="width: 180px;">Event</th>
            <th>Details & Error Diagnostics</th>
          </tr>
        </thead>
        <tbody>
          ${logRows || '<tr><td colspan="3" style="padding: 24px; text-align: center; color: #64748b;">No logs recorded yet. Start a transfer to see live logs!</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
      `);
    }

    return res.status(200).json({
      status: 'online',
      service: 'AirGrove WebRTC Telemetry',
      timestamp: new Date().toISOString(),
      activeTransfers: Math.max(0, stats.activeTransfers),
      totalTransfers: stats.totalTransfers,
      successfulTransfers: stats.successfulTransfers,
      failedTransfers: stats.failedTransfers,
      successRate: `${successRate}%`,
      totalBytesTransferred: stats.totalBytesTransferred,
      totalMBTransferred: (stats.totalBytesTransferred / (1024 * 1024)).toFixed(2),
      recentLogs: stats.recentLogs.slice(0, 25)
    });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(_) {}
      }
      if (!body) body = {};

      const event = String(body.event || 'UNKNOWN').toUpperCase();
      const data = body.data || {};
      const timestamp = new Date().toISOString();
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Update counters
      if (event === 'TRANSFER_START') {
        stats.activeTransfers++;
        stats.totalTransfers++;
      } else if (event === 'TRANSFER_COMPLETE') {
        stats.activeTransfers = Math.max(0, stats.activeTransfers - 1);
        stats.successfulTransfers++;
        if (data.bytes) {
          stats.totalBytesTransferred += Number(data.bytes) || 0;
        }
      } else if (event === 'TRANSFER_FAILED' || event === 'PAIRING_TIMEOUT' || event === 'PAIRING_ERROR') {
        if (event === 'TRANSFER_FAILED') {
          stats.activeTransfers = Math.max(0, stats.activeTransfers - 1);
        }
        stats.failedTransfers++;
      }

      // Format details string for clean readability in Vercel logs and dashboard
      let details = '';
      if (data.reason || data.error) {
        details = `Error: ${data.reason || data.error} | ICE: ${data.iceState || 'unknown'} | Elapsed: ${data.elapsedMs || 0}ms`;
      } else if (data.bytes) {
        details = `File: ${data.name || 'unnamed'} | Size: ${(Number(data.bytes)/(1024*1024)).toFixed(2)} MB | Speed: ${data.speedMBs || 0} MB/s | Time: ${data.durationSec || 0}s`;
      } else if (data.name) {
        details = `File: ${data.name} (${data.size ? (Number(data.size)/(1024*1024)).toFixed(2) + ' MB' : ''})`;
      } else if (data.targetPeerId || data.peerId) {
        details = `Peer: ${data.peerId || data.targetPeerId} | Role: ${data.isReceiver ? 'Receiver' : 'Sender'}`;
      } else {
        details = JSON.stringify(data);
      }

      const logEntry = {
        timestamp,
        event,
        clientIp: clientIp.split(',')[0].trim(),
        details,
        ...data
      };

      addLog(logEntry);

      // PROMINENT VERCEL LOG OUTPUT
      // This prints directly to the Vercel Runtime Logs dashboard!
      console.log(`[AirGrove Telemetry] [${event}] ${details} | IP: ${logEntry.clientIp} | Device: ${userAgent}`);

      return res.status(200).json({ ok: true, activeTransfers: Math.max(0, stats.activeTransfers) });
    } catch (err) {
      console.error('[AirGrove Telemetry Error]:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
