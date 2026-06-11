/* ============================================================
   CrowdShield — Dashboard JavaScript
   Live data simulation, sub-page navigation, clock, charts
   ============================================================ */

(function () {
    'use strict';

    // ============================
    // ZONE DATA MODEL
    // ============================
    var zones = [
        { id: 'stage-front', name: 'Stage Front', num: '03', base: 96, capacity: 2400, current: 2304, status: 'critical', temp: 34.2 },
        { id: 'floor-right', name: 'Floor Right', num: '06', base: 84, capacity: 2000, current: 1680, status: 'caution', temp: 31.8 },
        { id: 'general-entry', name: 'General Entry', num: '07', base: 71, capacity: 3000, current: 2130, status: 'caution', temp: 30.1 },
        { id: 'floor-left', name: 'Floor Left', num: '04', base: 64, capacity: 2000, current: 1280, status: 'safe', temp: 27.9 },
        { id: 'stage-rear', name: 'Stage Rear', num: '02', base: 58, capacity: 2200, current: 1276, status: 'safe', temp: 28.4 },
        { id: 'balcony-left', name: 'Balcony Left', num: '01', base: 42, capacity: 1500, current: 630, status: 'safe', temp: 25.1 },
        { id: 'balcony-right', name: 'Balcony Right', num: '05', base: 38, capacity: 1200, current: 456, status: 'safe', temp: 24.6 }
    ];

    function getStatus(pct) {
        if (pct >= 85) return 'critical';
        if (pct >= 70) return 'caution';
        return 'safe';
    }

    function fluctuate(base, range) {
        var delta = Math.floor(Math.random() * range * 2) - range;
        return Math.max(5, Math.min(99, base + delta));
    }

    // ============================
    // CLOCK
    // ============================
    function updateClocks() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        var timeStr = h + ':' + m + ':' + s;

        var sidebarClock = document.getElementById('sidebar-clock');
        var topbarTime = document.getElementById('topbar-time');
        if (sidebarClock) sidebarClock.textContent = timeStr;
        if (topbarTime) topbarTime.textContent = timeStr;
    }

    setInterval(updateClocks, 1000);
    updateClocks();

    // ============================
    // SUB-PAGE NAVIGATION
    // ============================
    var sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
    var subpages = document.querySelectorAll('.dash-subpage');

    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var targetPage = this.dataset.page;

            sidebarLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');

            subpages.forEach(function (p) { p.classList.remove('active'); });
            var target = document.getElementById('page-' + targetPage);
            if (target) target.classList.add('active');
        });
    });

    // ============================
    // ZONE DETAIL CARDS (Generate)
    // ============================
    function generateZoneCards() {
        var grid = document.getElementById('zone-detail-grid');
        if (!grid) return;
        grid.innerHTML = '';

        zones.forEach(function (z, i) {
            var isFeatured = z.id === 'stage-front';
            var card = document.createElement('div');
            card.className = 'zone-detail-card' + (isFeatured ? ' featured' : '');
            card.id = 'zd-' + z.id;

            var extraInfo = '';
            if (isFeatured) {
                extraInfo = '<div style="margin-top:16px;display:flex;gap:24px;">' +
                    '<div><p class="dash-stat-label">OCCUPANCY VECTOR</p><p style="font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--red);">↑ Rising</p></div>' +
                    '<div><p class="dash-stat-label">DYNAMIC THRESHOLD</p><p style="font-family:var(--font-display);font-size:1rem;font-weight:600;">80% max</p></div>' +
                    '</div>';
            }

            card.innerHTML =
                '<div class="zone-detail-header">' +
                '<span class="zone-detail-num">ZONE ' + z.num + '</span>' +
                '<span class="zone-badge ' + z.status + '">' + z.status.toUpperCase() + '</span>' +
                '</div>' +
                '<p class="zone-detail-name">' + z.name + '</p>' +
                '<p class="zone-detail-pct" id="zd-pct-' + z.id + '" style="color:var(--' + (z.status === 'safe' ? 'teal' : z.status === 'caution' ? 'amber' : 'red') + ');">' + z.base + '%</p>' +
                '<p class="zone-detail-occ" id="zd-occ-' + z.id + '">' + z.current.toLocaleString() + ' / ' + z.capacity.toLocaleString() + '</p>' +
                '<div class="zone-progress"><div class="zone-progress-fill ' + z.status + '" id="zd-bar-' + z.id + '" style="width:' + z.base + '%"></div></div>' +
                extraInfo;

            grid.appendChild(card);
        });
    }

    generateZoneCards();

    // ============================
    // BAR CHART (Analytics page)
    // ============================
    function generateBarChart() {
        var container = document.getElementById('bar-chart-container');
        if (!container) return;
        container.innerHTML = '';

        zones.forEach(function (z) {
            var row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML =
                '<span class="bar-label">' + z.name + '</span>' +
                '<div class="bar-track"><div class="bar-fill ' + z.status + '" id="bar-' + z.id + '" style="width:' + z.base + '%"></div></div>' +
                '<span class="bar-value" id="bar-val-' + z.id + '">' + z.base + '%</span>';
            container.appendChild(row);
        });
    }

    generateBarChart();

    // ============================
    // HISTORICAL COMPARISON CHART (Canvas)
    // ============================
    function drawHistoryChart() {
        var canvas = document.getElementById('history-chart');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (var i = 0; i <= 4; i++) {
            var y = 20 + (i * (h - 40) / 4);
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(w - 20, y);
            ctx.stroke();
        }

        // Time labels
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px Inter';
        var times = ['10:00', '11:00', '12:00', '13:00', '14:00'];
        times.forEach(function (t, i) {
            ctx.fillText(t, 40 + i * ((w - 60) / 4), h - 5);
        });

        // Current event line (red)
        var currentData = [30, 45, 62, 85, 92, 88, 96, 91, 87, 78];
        drawLine(ctx, currentData, 'rgba(255,59,48,0.8)', w, h);

        // Previous average line (muted)
        var prevData = [25, 35, 48, 55, 60, 62, 58, 55, 50, 45];
        drawLine(ctx, prevData, 'rgba(255,255,255,0.2)', w, h);

        // Legend
        ctx.fillStyle = 'rgba(255,59,48,0.8)';
        ctx.fillRect(w - 200, 10, 12, 3);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px Inter';
        ctx.fillText('Current Event', w - 182, 14);

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(w - 200, 24, 12, 3);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Previous Average', w - 182, 28);
    }

    function drawLine(ctx, data, color, w, h) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        var padding = 40;
        var plotW = w - padding - 20;
        var plotH = h - 40;

        data.forEach(function (val, i) {
            var x = padding + (i / (data.length - 1)) * plotW;
            var y = 20 + plotH - (val / 100) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    drawHistoryChart();

    // ============================
    // LIVE DATA SIMULATION (every 3 seconds)
    // ============================
    function updateSimulation() {
        var totalHeadcount = 0;
        var peakDensity = 0;

        zones.forEach(function (z) {
            // Fluctuate percentage
            z.base = fluctuate(z.base, 3);
            z.status = getStatus(z.base);
            z.current = Math.round((z.base / 100) * z.capacity);
            z.temp = parseFloat((20 + (z.base / 100) * 16 + (Math.random() * 2 - 1)).toFixed(1));
            totalHeadcount += z.current;
            if (z.base > peakDensity) peakDensity = z.base;

            // Update Venue Map Grid
            var mapEl = document.getElementById('map-' + z.id);
            if (mapEl) {
                mapEl.textContent = z.base + '%';
                var cell = mapEl.closest('.zone-cell');
                if (cell) {
                    cell.className = 'zone-cell ' + z.status;
                    if (z.id === 'general-entry') cell.classList.add('full-width');
                }
            }

            // Update Zone Detail Cards
            var zdPct = document.getElementById('zd-pct-' + z.id);
            var zdOcc = document.getElementById('zd-occ-' + z.id);
            var zdBar = document.getElementById('zd-bar-' + z.id);
            var zdCard = document.getElementById('zd-' + z.id);

            if (zdPct) {
                zdPct.textContent = z.base + '%';
                zdPct.style.color = z.status === 'safe' ? 'var(--teal)' : z.status === 'caution' ? 'var(--amber)' : 'var(--red)';
            }
            if (zdOcc) zdOcc.textContent = z.current.toLocaleString() + ' / ' + z.capacity.toLocaleString();
            if (zdBar) {
                zdBar.style.width = z.base + '%';
                zdBar.className = 'zone-progress-fill ' + z.status;
            }
            if (zdCard) {
                var badge = zdCard.querySelector('.zone-badge');
                if (badge) {
                    badge.className = 'zone-badge ' + z.status;
                    badge.textContent = z.status.toUpperCase();
                }
            }

            // Update Analytics bar chart
            var barFill = document.getElementById('bar-' + z.id);
            var barVal = document.getElementById('bar-val-' + z.id);
            if (barFill) {
                barFill.style.width = z.base + '%';
                barFill.className = 'bar-fill ' + z.status;
            }
            if (barVal) barVal.textContent = z.base + '%';

            // Update Thermal heatmap
            var thPct = document.getElementById('th-' + z.id);
            if (thPct) thPct.textContent = z.base + '%';

            // Update thermal heatmap colors
            var thZone = thPct ? thPct.closest('.thermal-zone') : null;
            if (thZone) {
                if (z.base >= 85) {
                    thZone.style.background = 'linear-gradient(135deg, #cc2200, #ff4422)';
                } else if (z.base >= 60) {
                    thZone.style.background = 'linear-gradient(135deg, #cc8800, #cc4400)';
                } else if (z.base >= 40) {
                    thZone.style.background = 'linear-gradient(135deg, #2266aa, #cc8800)';
                } else {
                    thZone.style.background = 'linear-gradient(135deg, #1a4a7a, #2266aa)';
                }
            }
        });

        // Update top-level stats
        var headcountEl = document.getElementById('total-headcount');
        var peakEl = document.getElementById('peak-density');
        var analyticsHc = document.getElementById('analytics-headcount');
        var analyticsPct = document.getElementById('analytics-crowded-pct');

        if (headcountEl) headcountEl.textContent = totalHeadcount.toLocaleString();
        if (peakEl) peakEl.textContent = peakDensity + '%';
        if (analyticsHc) analyticsHc.textContent = totalHeadcount.toLocaleString();
        if (analyticsPct) analyticsPct.textContent = zones[0].base + '%';

        // Update thermal table
        updateThermalTable();

        // Update heat distribution
        updateHeatBars();

        // Update bottleneck
        updateBottleneck();

        // Generate dynamic alerts based on zone status
        updateDynamicAlerts();
    }

    function updateDynamicAlerts() {
        var dashContainer = document.getElementById('dash-alerts-container');
        var listContainer = document.getElementById('alerts-list');
        var dashBadge = document.getElementById('dash-alert-badge');
        var liveCount = document.getElementById('alert-live-count');

        var dashHtml = '';
        var listHtml = '';
        var criticalCount = 0;
        var activeCount = 0;

        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        var timeStr = h + ':' + m + ':' + s;

        // Active alerts based on current state
        zones.forEach(function(z) {
            if (z.status === 'critical') {
                criticalCount++;
                activeCount++;
                dashHtml += `
                    <div class="panel-alert-card critical-alert">
                        <p class="panel-alert-title">Zone ${z.num} Threshold Violation</p>
                        <p class="panel-alert-desc">${z.base}% density detected. Immediate redirection recommended.</p>
                        <div class="panel-alert-footer">
                            <span class="panel-alert-time">${timeStr}</span>
                            <button class="panel-alert-btn action">ACTION</button>
                        </div>
                    </div>`;
                listHtml += `
                    <div class="alert-card-full critical" data-status="active">
                        <div class="alert-icon critical">⚠</div>
                        <div class="alert-body">
                            <p class="alert-body-title">Zone ${z.num} Threshold Violation</p>
                            <p class="alert-body-desc">${z.base}% density detected. Immediate redirection recommended.</p>
                            <div class="alert-meta">
                                <span class="alert-zone-tag">Zone: ${z.name}</span>
                                <span class="alert-timestamp">${timeStr}</span>
                            </div>
                        </div>
                        <button class="alert-action-btn action">ACTION</button>
                    </div>`;
            } else if (z.status === 'caution') {
                activeCount++;
                // Limit dash alerts to critical ones or at most a few warnings, here we just show them
                dashHtml += `
                    <div class="panel-alert-card info-alert">
                        <p class="panel-alert-title">${z.name} Approaching Limit</p>
                        <p class="panel-alert-desc">${z.base}% density. Monitor closely for further increase.</p>
                        <div class="panel-alert-footer">
                            <span class="panel-alert-time">${timeStr}</span>
                            <button class="panel-alert-btn dismiss">DISMISS</button>
                        </div>
                    </div>`;
                listHtml += `
                    <div class="alert-card-full warning" data-status="active">
                        <div class="alert-icon warning">⚡</div>
                        <div class="alert-body">
                            <p class="alert-body-title">${z.name} Approaching Threshold</p>
                            <p class="alert-body-desc">${z.base}% occupancy. Monitor closely for further increase.</p>
                            <div class="alert-meta">
                                <span class="alert-zone-tag">Zone: ${z.name}</span>
                                <span class="alert-timestamp">${timeStr}</span>
                            </div>
                        </div>
                        <button class="alert-action-btn dismiss">DISMISS</button>
                    </div>`;
            }
        });

        if (dashHtml === '') {
            dashHtml = '<div style="color:var(--text-muted);font-size:0.875rem;padding:16px;">No critical or caution alerts active.</div>';
        }
        if (listHtml === '') {
            listHtml = '<div style="color:var(--text-muted);font-size:1rem;padding:24px 0;">All zones operating within safe parameters.</div>';
        }

        if (dashContainer) dashContainer.innerHTML = dashHtml;
        if (listContainer) listContainer.innerHTML = listHtml;
        if (dashBadge) dashBadge.textContent = criticalCount;
        if (liveCount) liveCount.textContent = activeCount;

        // Re-apply filter logic if needed
        var activeFilterBtn = document.querySelector('.alert-filter-btn.active');
        if(activeFilterBtn) {
            activeFilterBtn.click();
        }
    }

    function updateThermalTable() {
        // Table IDs mapped: sf, fr, ge, sr, fl, bl, br
        var mapping = [
            { prefix: 'sf', zone: zones[0] },
            { prefix: 'fr', zone: zones[1] },
            { prefix: 'ge', zone: zones[2] },
            { prefix: 'sr', zone: zones[4] },
            { prefix: 'fl', zone: zones[3] },
            { prefix: 'bl', zone: zones[5] },
            { prefix: 'br', zone: zones[6] }
        ];

        mapping.forEach(function (m) {
            var tempEl = document.getElementById('tt-temp-' + m.prefix);
            var densEl = document.getElementById('tt-dens-' + m.prefix);
            if (tempEl) tempEl.textContent = m.zone.temp + '°C';
            if (densEl) densEl.textContent = m.zone.base + '%';
        });
    }

    function updateHeatBars() {
        var mainGatePct = fluctuate(92, 4);
        var northPct = fluctuate(45, 5);
        var vipPct = fluctuate(12, 4);

        var elMainVal = document.getElementById('heat-main-gate');
        var elMainFill = document.getElementById('heat-fill-main');
        var elNorthVal = document.getElementById('heat-north');
        var elNorthFill = document.getElementById('heat-fill-north');
        var elVipVal = document.getElementById('heat-vip');
        var elVipFill = document.getElementById('heat-fill-vip');

        if (elMainVal) elMainVal.textContent = mainGatePct + '%';
        if (elMainFill) elMainFill.style.width = mainGatePct + '%';
        if (elNorthVal) elNorthVal.textContent = northPct + '%';
        if (elNorthFill) elNorthFill.style.width = northPct + '%';
        if (elVipVal) elVipVal.textContent = vipPct + '%';
        if (elVipFill) elVipFill.style.width = vipPct + '%';
    }

    function updateBottleneck() {
        var sfEl = document.getElementById('bottleneck-sf');
        var frEl = document.getElementById('bottleneck-fr');
        if (sfEl) sfEl.textContent = zones[0].base + '%';
        if (frEl) frEl.textContent = zones[1].base + '%';
    }

    // Run simulation every 3 seconds
    setInterval(updateSimulation, 3000);

    // ============================
    // EXIT ROUTING - Update every 5 seconds
    // ============================
    var gateStates = [
        { id: 'a', statuses: ['clear', 'clear', 'clear', 'moderate', 'clear'] },
        { id: 'b', statuses: ['congested', 'congested', 'moderate', 'congested', 'congested'] },
        { id: 'c', statuses: ['clear', 'clear', 'clear', 'clear', 'moderate'] },
        { id: 'd', statuses: ['moderate', 'moderate', 'clear', 'moderate', 'moderate'] }
    ];
    var gateIndex = 0;

    function updateExitRouting() {
        gateStates.forEach(function (gate) {
            var status = gate.statuses[gateIndex % gate.statuses.length];
            var dot = document.getElementById('gate-' + gate.id + '-dot');
            var label = document.getElementById('gate-' + gate.id + '-label');

            if (dot) {
                dot.className = 'exit-gate-dot ' + status;
            }
            if (label) {
                label.className = 'exit-gate-label ' + status;
                label.textContent = status.toUpperCase();
            }
        });

        gateIndex++;
    }

    setInterval(updateExitRouting, 5000);

    // ============================
    // ALERT FILTERS
    // ============================
    var filterBtns = document.querySelectorAll('.alert-filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            var filter = this.dataset.filter;
            var cards = document.querySelectorAll('.alert-card-full');

            cards.forEach(function (card) {
                var status = card.dataset.status;
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else if (filter === 'active' && status === 'active') {
                    card.style.display = 'flex';
                } else if (filter === 'resolved' && status === 'resolved') {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ============================
    // ANALYTICS REPORTS
    // ============================

    // Simulated footfall data model (cumulative visitors per zone)
    var zoneFootfall = {
        'stage-front':   { visitors: 8420, dwellMin: 42, trend: 'up' },
        'floor-right':   { visitors: 6890, dwellMin: 28, trend: 'up' },
        'general-entry': { visitors: 9150, dwellMin: 8,  trend: 'flat' },
        'floor-left':    { visitors: 5230, dwellMin: 25, trend: 'down' },
        'stage-rear':    { visitors: 4100, dwellMin: 35, trend: 'down' },
        'balcony-left':  { visitors: 2780, dwellMin: 18, trend: 'flat' },
        'balcony-right': { visitors: 2340, dwellMin: 15, trend: 'down' }
    };

    // Simulated entry/exit gate data
    var gates = [
        { id: 'gate-a', name: 'Gate A — Main Entry',   type: 'entry', throughput: 4820 },
        { id: 'gate-b', name: 'Gate B — North Entry',   type: 'entry', throughput: 3150 },
        { id: 'gate-c', name: 'Gate C — VIP Entry',     type: 'entry', throughput: 1210 },
        { id: 'gate-d', name: 'Gate D — South Exit',    type: 'exit',  throughput: 3690 },
        { id: 'gate-e', name: 'Gate E — East Exit',     type: 'exit',  throughput: 2480 },
        { id: 'gate-f', name: 'Gate F — Emergency Exit', type: 'exit', throughput: 420 }
    ];

    function renderMostVisitedReport() {
        var container = document.getElementById('report-most-visited');
        if (!container) return;

        // Remove old rows
        var oldRows = container.querySelectorAll('.report-row');
        oldRows.forEach(function (r) { r.remove(); });

        // Sort zones by visitors descending
        var sorted = zones.map(function (z) {
            var ff = zoneFootfall[z.id];
            return { name: z.name, visitors: ff.visitors, trend: ff.trend };
        }).sort(function (a, b) { return b.visitors - a.visitors; });

        var maxVisitors = sorted[0].visitors;

        sorted.forEach(function (item, i) {
            var pct = Math.round((item.visitors / maxVisitors) * 100);
            var barClass = pct >= 70 ? 'high' : pct >= 40 ? 'med' : 'low';
            var trendArrow = item.trend === 'up' ? '▲ Rising' : item.trend === 'down' ? '▼ Falling' : '— Steady';
            var trendClass = item.trend;

            var row = document.createElement('div');
            row.className = 'report-row';
            row.innerHTML =
                '<span class="rank ' + (i === 0 ? 'top' : '') + '">' + (i + 1) + '</span>' +
                '<span class="zone-name">' + item.name + '</span>' +
                '<span class="value">' + item.visitors.toLocaleString() + '</span>' +
                '<div class="mini-bar"><div class="mini-bar-fill ' + barClass + '" style="width:' + pct + '%"></div></div>' +
                '<span class="trend ' + trendClass + '">' + trendArrow + '</span>';
            container.appendChild(row);
        });
    }

    function renderAdExposureReport() {
        var container = document.getElementById('report-ad-exposure');
        if (!container) return;

        var oldRows = container.querySelectorAll('.report-row');
        oldRows.forEach(function (r) { r.remove(); });

        // Score = visitors × dwellTime (higher dwell = more ad exposure)
        var scored = zones.map(function (z) {
            var ff = zoneFootfall[z.id];
            var impressions = Math.round(ff.visitors * (ff.dwellMin / 10));
            var score = Math.round((impressions / 400) * 10) / 10; // normalised score out of ~100
            return { name: z.name, impressions: impressions, score: Math.min(score, 99.9) };
        }).sort(function (a, b) { return b.impressions - a.impressions; });

        var maxImpressions = scored[0].impressions;

        scored.forEach(function (item, i) {
            var pct = Math.round((item.impressions / maxImpressions) * 100);
            var barClass = pct >= 70 ? 'high' : pct >= 40 ? 'med' : 'low';
            var scoreClass = item.score >= 70 ? 'excellent' : item.score >= 45 ? 'good' : item.score >= 25 ? 'moderate' : 'low-score';

            var row = document.createElement('div');
            row.className = 'report-row';
            row.innerHTML =
                '<span class="rank ' + (i === 0 ? 'top' : '') + '">' + (i + 1) + '</span>' +
                '<span class="zone-name">' + item.name + '</span>' +
                '<span class="value">' + item.impressions.toLocaleString() + '</span>' +
                '<div class="mini-bar"><div class="mini-bar-fill ' + barClass + '" style="width:' + pct + '%"></div></div>' +
                '<span class="score ' + scoreClass + '">' + item.score.toFixed(1) + '</span>';
            container.appendChild(row);
        });
    }

    function renderEntryExitReport() {
        var container = document.getElementById('report-entry-exit');
        if (!container) return;

        container.innerHTML = '';

        var maxThroughput = 0;
        var minThroughput = Infinity;
        gates.forEach(function (g) {
            if (g.throughput > maxThroughput) maxThroughput = g.throughput;
            if (g.throughput < minThroughput) minThroughput = g.throughput;
        });

        gates.forEach(function (g) {
            var usageClass = g.throughput >= maxThroughput * 0.7 ? 'high-usage' : g.throughput >= maxThroughput * 0.35 ? 'med-usage' : 'low-usage';
            var badge = '';
            if (g.throughput === maxThroughput) {
                badge = '<span class="gate-badge most-used">Most Used</span>';
            } else if (g.throughput === minThroughput) {
                badge = '<span class="gate-badge least-used">Least Used</span>';
            }

            var card = document.createElement('div');
            card.className = 'entry-exit-card';
            card.innerHTML =
                '<p class="gate-type ' + g.type + '">' + g.type + '</p>' +
                badge +
                '<p class="gate-name">' + g.name + '</p>' +
                '<p class="gate-throughput">' + g.throughput.toLocaleString() + '</p>' +
                '<p class="gate-unit">People / Session</p>' +
                '<div class="gate-bar ' + usageClass + '"></div>';
            container.appendChild(card);
        });
    }

    // Periodically fluctuate footfall and gate data
    function updateReportData() {
        Object.keys(zoneFootfall).forEach(function (key) {
            var ff = zoneFootfall[key];
            ff.visitors += Math.floor(Math.random() * 40) - 10;
            if (ff.visitors < 100) ff.visitors = 100;
        });
        gates.forEach(function (g) {
            g.throughput += Math.floor(Math.random() * 30) - 8;
            if (g.throughput < 50) g.throughput = 50;
        });
    }

    // Initial render
    renderMostVisitedReport();
    renderAdExposureReport();
    renderEntryExitReport();

    // Update reports every 3 seconds alongside the simulation
    setInterval(function () {
        updateReportData();
        renderMostVisitedReport();
        renderAdExposureReport();
        renderEntryExitReport();
    }, 3000);

})();
