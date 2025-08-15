// DPO Portal - Fully Functional Application (Fixed)
class DPOPortal {
    constructor() {
        this.currentModule = 'dashboard';
        this.userProfile = {
            name: "Sarah Mitchell",
            role: "Data Protection Officer",
            email: "sarah.mitchell@company.com"
        };
        
        // Sample data with functionality that actually works
        this.data = {
            activities: [
                {id: 1, title: "DSAR-2025-003 delivered", details: "Delivered data package", actor: "Mike Davis", time: "2 hours ago", type: "dsar"},
                {id: 2, title: "DPIA approved", details: "CRM assessment approved", actor: "Alice Wilson", time: "4 hours ago", type: "assessment"},
                {id: 3, title: "Vendor added", details: "New vendor assessment created", actor: "Bob Chen", time: "Yesterday", type: "vendor"}
            ],
            dsars: [
                {id: "DSAR-001", name: "John Smith", email: "john@email.com", stage: "review", days: 15},
                {id: "DSAR-002", name: "Sarah Johnson", email: "sarah@email.com", stage: "search", days: 17},
                {id: "DSAR-003", name: "Mike Davis", email: "mike@email.com", stage: "deliver", days: 10}
            ],
            vendors: [
                {id: 1, name: "CloudTech Solutions", risk: "Low", status: "Active"},
                {id: 2, name: "Analytics Corp", risk: "Medium", status: "Review"},
                {id: 3, name: "Support Services", risk: "High", status: "Expired"}
            ],
            assessments: [
                {id: 1, title: "CRM System DPIA", type: "DPIA", risk: "Medium", status: "approved"},
                {id: 2, title: "Marketing Analytics LIA", type: "LIA", risk: "High", status: "pending"},
                {id: 3, title: "Cloud Migration TIA", type: "TIA", risk: "Low", status: "draft"}
            ],
            policies: [
                {id: 1, title: "Data Protection Policy", type: "Policy", version: "v2.1", status: "approved"},
                {id: 2, title: "Incident Response SOP", type: "SOP", version: "v1.3", status: "draft"},
                {id: 3, title: "Privacy Notice Template", type: "Template", version: "v1.0", status: "pending"}
            ],
            bin: []
        };

        this.nextId = {
            activities: 4,
            dsars: 4,
            vendors: 4,
            assessments: 4,
            policies: 4
        };

        this.currentModalContext = null;
        this.confirmCallback = null;

        this.init();
    }

    init() {
        console.log('DPO Portal initializing...');
        // Wait for DOM to be fully ready
        setTimeout(() => {
            this.setupEventListeners();
            this.populateAllContent();
            this.setupResponsiveNavigation();
            this.updateDashboardCounts();
            console.log('DPO Portal initialized successfully');
        }, 100);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - direct event listeners for reliability
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const module = item.dataset.module;
                if (module) {
                    console.log('Navigation clicked:', module);
                    this.switchModule(module);
                }
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSidebar();
            });
        }

        // User name editing
        this.setupUserNameEdit();

        // KPI cards - direct event listeners
        const kpiCards = document.querySelectorAll('.kpi-card[data-metric]');
        kpiCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const metric = card.dataset.metric;
                console.log('KPI card clicked:', metric);
                this.showMetricDetails(metric);
            });
        });

        // Quick actions - direct event listeners
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.dataset.action;
                console.log('Quick action clicked:', action);
                this.handleQuickAction(action);
            });
        });

        // All "New" buttons with direct IDs
        this.setupDirectButtonListeners();

        // Modal controls
        this.setupModalControls();

        console.log('Event listeners set up successfully');
    }

    setupDirectButtonListeners() {
        // New buttons
        const buttonMap = {
            'newDsarBtn': () => this.showAddModal('newDsarBtn'),
            'newVendorBtn': () => this.showAddModal('newVendorBtn'),
            'newAssessmentBtn': () => this.showAddModal('newAssessmentBtn'),
            'newPolicyBtn': () => this.showAddModal('newPolicyBtn'),
            'addActivityBtn': () => this.showAddActivityModal(),
            'viewAllActivitiesBtn': () => this.showAllActivities(),
            'emptyBinBtn': () => this.emptyBin()
        };

        Object.keys(buttonMap).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked:', btnId);
                    buttonMap[btnId]();
                });
            }
        });

        // Dynamic button handlers that will be attached when tables are populated
        this.setupDynamicEventDelegation();
    }

    setupDynamicEventDelegation() {
        // Use event delegation for dynamically generated buttons
        document.body.addEventListener('click', (e) => {
            const target = e.target;
            
            // Delete button handler
            if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = target.classList.contains('delete-btn') ? target : target.closest('.delete-btn');
                const type = btn.dataset.type;
                const id = btn.dataset.id;
                console.log('Delete button clicked:', type, id);
                this.deleteItem(type, id);
                return;
            }

            // Edit button handler
            if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = target.classList.contains('edit-btn') ? target : target.closest('.edit-btn');
                const type = btn.dataset.type;
                const id = btn.dataset.id;
                console.log('Edit button clicked:', type, id);
                this.editItem(type, id);
                return;
            }

            // Action button handler
            if (target.classList.contains('action-btn') || target.closest('.action-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = target.classList.contains('action-btn') ? target : target.closest('.action-btn');
                const action = btn.dataset.action;
                const type = btn.dataset.type;
                const id = btn.dataset.id;
                console.log('Action button clicked:', action, type, id);
                this.handleAction(action, type, id);
                return;
            }

            // Click anywhere on a DSAR metric item or its "Open" button
            if (target.dataset.openDsar || target.closest('[data-open-dsar]')) {
                e.preventDefault(); 
                e.stopPropagation();
                const el = target.dataset.openDsar ? target : target.closest('[data-open-dsar]');
                this.openDsarDetail(el.dataset.openDsar);
                return;
            }

            // "Open Vendors" toolbar button in the modal
            if (target.classList.contains('open-vendors-btn') || target.closest('.open-vendors-btn')) {
                e.preventDefault(); 
                e.stopPropagation();
                this.switchModule('vendors');
                this.hideModal();
                return;
            }

            // "Clean Up All" in the Bin details modal
            if (target.classList.contains('cleanup-bin-btn') || target.closest('.cleanup-bin-btn')) {
                e.preventDefault(); 
                e.stopPropagation();
                this.emptyBin();
                this.hideModal();
                return;
            }
        });
    }

    setupModalControls() {
        // Generic modal
        const modal = document.getElementById('genericModal');
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalSave = document.getElementById('modalSave');
        const modalOverlay = modal?.querySelector('.modal-overlay');

        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal();
            });
        }

        if (modalCancel) {
            modalCancel.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal();
            });
        }

        if (modalSave) {
            modalSave.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Modal save clicked');
                this.handleModalSave();
            });
        }

        // Confirmation modal
        const confirmModal = document.getElementById('confirmModal');
        const confirmClose = document.getElementById('confirmClose');
        const confirmCancel = document.getElementById('confirmCancel');
        const confirmOk = document.getElementById('confirmOk');
        const confirmOverlay = confirmModal?.querySelector('.modal-overlay');

        if (confirmClose) {
            confirmClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideConfirmModal();
            });
        }

        if (confirmCancel) {
            confirmCancel.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideConfirmModal();
            });
        }

        if (confirmOverlay) {
            confirmOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideConfirmModal();
            });
        }

        if (confirmOk) {
            confirmOk.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Confirm OK clicked');
                this.handleConfirmOk();
            });
        }

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideConfirmModal();
            }
        });
    }

    setupUserNameEdit() {
        const userName = document.getElementById('userName');
        const userNameEdit = document.getElementById('userNameEdit');
        const userNameInput = document.getElementById('userNameInput');

        if (userName && userNameEdit && userNameInput) {
            userName.addEventListener('click', (e) => {
                e.preventDefault();
                this.startUserNameEdit();
            });

            userNameEdit.addEventListener('click', (e) => {
                e.preventDefault();
                this.startUserNameEdit();
            });

            userNameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.saveUserName();
                } else if (e.key === 'Escape') {
                    this.cancelUserNameEdit();
                }
            });

            userNameInput.addEventListener('blur', () => {
                this.saveUserName();
            });
        }
    }

    startUserNameEdit() {
        const userName = document.getElementById('userName');
        const userNameInput = document.getElementById('userNameInput');
        
        userName.classList.add('hidden');
        userNameInput.classList.remove('hidden');
        userNameInput.focus();
        userNameInput.select();
    }

    saveUserName() {
        const userName = document.getElementById('userName');
        const userNameInput = document.getElementById('userNameInput');
        
        const newName = userNameInput.value.trim();
        if (newName && newName !== this.userProfile.name) {
            this.userProfile.name = newName;
            userName.textContent = newName;
            
            // Update avatar initials
            const avatar = document.querySelector('.user-avatar');
            if (avatar) {
                const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                avatar.textContent = initials;
            }
            
            this.showSuccessMessage('Name updated successfully');
        }
        
        this.cancelUserNameEdit();
    }

    cancelUserNameEdit() {
        const userName = document.getElementById('userName');
        const userNameInput = document.getElementById('userNameInput');
        
        userName.classList.remove('hidden');
        userNameInput.classList.add('hidden');
        userNameInput.value = this.userProfile.name;
    }

    switchModule(module) {
        console.log(`Switching to module: ${module}`);
        
        // Clear active navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Set new active navigation
        const navItem = document.querySelector(`[data-module="${module}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Hide all views
        document.querySelectorAll('.module-view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(`${module}-view`);
        if (targetView) {
            targetView.classList.add('active');
            console.log(`Switched to ${module} view`);
        }

        this.currentModule = module;
        this.refreshModuleContent(module);
    }

    refreshModuleContent(module) {
        console.log(`Refreshing content for module: ${module}`);
        switch(module) {
            case 'dashboard':
                this.populateRecentActivities();
                this.updateDashboardCounts();
                break;
            case 'dsar':
                this.populateDSARTable();
                break;
            case 'vendors':
                this.populateVendorsTable();
                break;
            case 'assessments':
                this.populateAssessmentsTable();
                break;
            case 'policies':
                this.populatePoliciesTable();
                break;
            case 'bin':
                this.populateBinTable();
                break;
        }
    }

    populateAllContent() {
        console.log('Populating all content...');
        this.populateRecentActivities();
        this.populateDSARTable();
        this.populateVendorsTable();
        this.populateAssessmentsTable();
        this.populatePoliciesTable();
        this.populateBinTable();
    }

    updateDashboardCounts() {
        const dsarCount = document.getElementById('dsarCount');
        const approvalCount = document.getElementById('approvalCount');
        const vendorCount = document.getElementById('vendorCount');
        const binCount = document.getElementById('binCount');

        if (dsarCount) dsarCount.textContent = this.data.dsars.length;
        if (approvalCount) approvalCount.textContent = this.data.assessments.filter(a => a.status === 'pending').length;
        if (vendorCount) vendorCount.textContent = this.data.vendors.length;
        if (binCount) binCount.textContent = this.data.bin.length;

        // ---- KPI trend lines (dynamic) ----
        const trendApprovals = document.querySelector('.kpi-card[data-metric="pending-approvals"] .kpi-trend');
        if (trendApprovals) {
            const high = this.data.assessments.filter(a => a.status === 'pending' && a.risk === 'High').length;
            trendApprovals.textContent = high > 0 ? `${high} high priority` : 'All clear';
        }

        const trendVendors = document.querySelector('.kpi-card[data-metric="vendors"] .kpi-trend');
        if (trendVendors) {
            const review = this.data.vendors.filter(v => v.status === 'Review' || v.status === 'Expired').length;
            trendVendors.textContent = review > 0 ? `${review} review needed` : 'All up to date';
        }

        const trendBin = document.querySelector('.kpi-card[data-metric="bin-items"] .kpi-trend');
        if (trendBin) {
            const n = this.data.bin.length;
            trendBin.textContent = n > 0 ? `${n} items can be purged` : 'Ready for cleanup';
        }
        }

    populateRecentActivities() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        if (this.data.activities.length === 0) {
            activityList.innerHTML = '<div class="empty-state">No recent activities</div>';
            return;
        }

        activityList.innerHTML = this.data.activities.slice(0, 5).map(activity => `
            <div class="activity-item" data-activity-id="${activity.id}">
                <div class="activity-icon status--${this.getActivityStatus(activity.type)}">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-meta">${activity.time} • ${activity.actor}</div>
                </div>
                <div class="activity-actions-menu">
                    <button class="activity-action-btn edit-btn" data-type="activities" data-id="${activity.id}" title="Edit">✏️</button>
                    <button class="activity-action-btn delete-btn" data-type="activities" data-id="${activity.id}" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    populateDSARTable() {
        const tbody = document.getElementById('dsarTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.dsars.map(dsar => `
            <tr>
            <td><a href="#" class="open-dsar" data-open-dsar="${dsar.id}"><strong>${dsar.id}</strong></a></td>
            <td>${dsar.name}</td>
            <td>${dsar.email}</td>
            <td><span class="status status--${dsar.stage}">${this.formatStatus(dsar.stage)}</span></td>
            <td><span class="${this.getDaysClass(dsar.days)}">${dsar.days} days</span></td>
            <td>
                <button class="btn btn--sm btn--outline action-btn" data-action="take-action" data-type="dsars" data-id="${dsar.id}">Take Action</button>
                <button class="btn btn--sm btn--outline edit-btn" data-type="dsars" data-id="${dsar.id}">Edit</button>
                <button class="btn btn--sm btn--outline delete-btn" data-type="dsars" data-id="${dsar.id}">Delete</button>
            </td>
            </tr>
          `).join('');
        }

    populateVendorsTable() {
        const tbody = document.getElementById('vendorsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.vendors.map(vendor => `
            <tr>
                <td><strong>${vendor.name}</strong></td>
                <td><span class="status status--${vendor.risk.toLowerCase()}">${vendor.risk}</span></td>
                <td><span class="status status--${vendor.status.toLowerCase()}">${vendor.status}</span></td>
                <td>
                    <button class="btn btn--sm btn--outline edit-btn" data-type="vendors" data-id="${vendor.id}">Edit</button>
                    <button class="btn btn--sm btn--outline delete-btn" data-type="vendors" data-id="${vendor.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    openDsarDetail(id) {
  const dsar = this.data.dsars.find(d => String(d.id) === String(id));
  if (!dsar) { this.showErrorMessage('DSAR not found'); return; }

  // Ensure we’re on the DSAR module
  this.switchModule('dsar');

  // Build detail modal
  const modal = document.getElementById('genericModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = `${dsar.id} — ${dsar.name}`;
  body.innerHTML = `
    <div class="detail-grid">
      <div class="detail-field"><div class="detail-label">Subject</div><div>${dsar.name}</div></div>
      <div class="detail-field"><div class="detail-label">Email</div><div>${dsar.email}</div></div>
      <div class="detail-field">
        <div class="detail-label">Stage</div>
        <select class="form-control" id="dsarDetailStage">
          <option value="review"${dsar.stage==='review'?' selected':''}>Review</option>
          <option value="search"${dsar.stage==='search'?' selected':''}>Search</option>
          <option value="deliver"${dsar.stage==='deliver'?' selected':''}>Deliver</option>
        </select>
      </div>
      <div class="detail-field">
        <div class="detail-label">Days Remaining</div>
        <input type="number" class="form-control" id="dsarDetailDays" value="${dsar.days}">
      </div>
    </div>
    <div class="form-group" style="margin-top:12px">
      <label class="form-label">Notes</label>
      <textarea class="form-control" id="dsarDetailNotes" rows="4" placeholder="Add notes..."></textarea>
    </div>
  `;

  this.currentModalContext = { type: 'dsarDetail', mode: 'edit', data: dsar };
  modal.classList.remove('hidden');
}

    populateAssessmentsTable() {
        const tbody = document.getElementById('assessmentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.assessments.map(assessment => `
            <tr>
                <td><strong>${assessment.title}</strong></td>
                <td>${assessment.type}</td>
                <td><span class="status status--${assessment.risk.toLowerCase()}">${assessment.risk}</span></td>
                <td><span class="status status--${assessment.status}">${this.formatStatus(assessment.status)}</span></td>
                <td>
                    ${assessment.status === 'pending' ? 
                        `<button class="btn btn--sm btn--primary action-btn" data-action="approve" data-type="assessments" data-id="${assessment.id}">Approve</button>` : 
                        ''
                    }
                    <button class="btn btn--sm btn--outline edit-btn" data-type="assessments" data-id="${assessment.id}">Edit</button>
                    <button class="btn btn--sm btn--outline delete-btn" data-type="assessments" data-id="${assessment.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    populatePoliciesTable() {
        const tbody = document.getElementById('policiesTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.policies.map(policy => `
            <tr>
                <td><strong>${policy.title}</strong></td>
                <td>${policy.type}</td>
                <td>${policy.version}</td>
                <td><span class="status status--${policy.status}">${this.formatStatus(policy.status)}</span></td>
                <td>
                    <button class="btn btn--sm btn--outline edit-btn" data-type="policies" data-id="${policy.id}">Edit</button>
                    <button class="btn btn--sm btn--outline delete-btn" data-type="policies" data-id="${policy.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    populateBinTable() {
        const binEmptyState = document.getElementById('binEmptyState');
        const binTableContainer = document.getElementById('binTableContainer');
        const binTableBody = document.getElementById('binTableBody');

        if (!binEmptyState || !binTableContainer || !binTableBody) return;

        if (this.data.bin.length === 0) {
            binEmptyState.classList.remove('hidden');
            binTableContainer.classList.add('hidden');
        } else {
            binEmptyState.classList.add('hidden');
            binTableContainer.classList.remove('hidden');
            
            binTableBody.innerHTML = this.data.bin.map(item => `
                <tr>
                    <td><strong>${item.name || item.title}</strong></td>
                    <td>${item.originalType}</td>
                    <td>${item.deletedAt}</td>
                    <td>
                        <button class="btn btn--sm btn--primary action-btn" data-action="restore" data-type="bin" data-id="${item.binKey || item.id}">Restore</button>
                        <button class="btn btn--sm btn--outline action-btn" data-action="permanent-delete" data-type="bin" data-id="${item.binKey || item.id}">Delete Forever</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Modal handling
    showMetricDetails(metric) {
        console.log('Showing metric details for:', metric);
        const modal = document.getElementById('genericModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        const metricTitles = {
            'active-dsars': 'Active DSARs',
            'pending-approvals': 'Pending Approvals',
            'vendors': 'Active Vendors',
            'bin-items': 'Deleted Items'
        };

        title.textContent = metricTitles[metric] || 'Details';

        let content = '';
        switch(metric) {
            case 'active-dsars':
                content = this.renderDSARDetails();
                break;
            case 'pending-approvals':
                content = this.renderApprovalDetails();
                break;
            case 'vendors':
                content = this.renderVendorDetails();
                break;
            case 'bin-items':
                content = this.renderBinDetails();
                break;
        }

        body.innerHTML = content;
        modal.classList.remove('hidden');
    }

    renderDSARDetails() {
        if (this.data.dsars.length === 0) {
            return '<p>No active DSARs</p>';
         }
        return `
            <div class="metric-details-list">
                ${this.data.dsars.map(dsar => `
                    <div class="metric-item dsar-link" data-open-dsar="${dsar.id}">
                        <div class="metric-item-content">
                            <div class="metric-item-title"><strong>${dsar.id}</strong> — ${dsar.name}</div>
                            <div class="metric-item-meta">Stage: ${this.formatStatus(dsar.stage)} • ${dsar.days} days remaining</div>
                        </div>
                    <div class="metric-item-actions">
                <button class="btn btn--sm btn--outline" data-open-dsar="${dsar.id}">Open</button>
            </div>
        </div>
      `).join('')}
    </div>
  `;
}

    renderApprovalDetails() {
        const pendingApprovals = this.data.assessments.filter(a => a.status === 'pending');
        if (pendingApprovals.length === 0) {
            return '<p>No pending approvals</p>';
        }
        return `
            <div class="metric-details-list">
                ${pendingApprovals.map(assessment => `
                    <div class="metric-item">
                        <div class="metric-item-content">
                            <div class="metric-item-title">${assessment.title}</div>
                            <div class="metric-item-meta">${assessment.type} • Risk: ${assessment.risk}</div>
                        </div>
                        <div class="metric-item-actions">
                            <button class="btn btn--sm btn--primary action-btn" data-action="approve" data-type="assessments" data-id="${assessment.id}">Approve</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderVendorDetails() {
        if (this.data.vendors.length === 0) {
            return '<p>No active vendors</p>';
        }
            return `
                <div class="modal-toolbar">
                    <button class="btn btn--secondary open-vendors-btn">Open Vendors Module</button>
                </div>
                <div class="metric-card-grid">
                    ${this.data.vendors.map(v => `
                        <div class="metric-card">
                            <div class="metric-card-header">
                        <div class="metric-card-title">${v.name}</div>
                    <span class="status status--${v.risk.toLowerCase()}">${v.risk}</span>
                </div>
                <div class="metric-card-meta">Status: <span class="status status--${v.status.toLowerCase()}">${v.status}</span></div>
                </div>
                `).join('')}
            </div>
  `     ;
    }

    renderBinDetails() {
        if (this.data.bin.length === 0) {
            return '<p>Bin is empty</p>';
         }
            return `
                <div class="modal-toolbar">
                    <button class="btn btn--secondary cleanup-bin-btn">Clean Up All</button>
                </div>
                <div class="metric-details-list">
                    ${this.data.bin.map(item => `
                        <div class="metric-item">
                            <div class="metric-item-content">
                        <div class="metric-item-title">${item.name || item.title}</div>
                    <div class="metric-item-meta">${item.originalType} • Deleted: ${item.deletedAt}</div>
                </div>
            <div class="metric-item-actions">
            <button class="btn btn--sm btn--primary action-btn" data-action="restore" data-type="bin" data-id="${item.binKey || item.id}">Restore</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

    handleQuickAction(action) {
        console.log('Handling quick action:', action);
        const actionMap = {
            'new-dsar': () => this.showAddModal('newDsarBtn'),
            'new-assessment': () => this.showAddModal('newAssessmentBtn'),
            'new-vendor': () => this.showAddModal('newVendorBtn'),
            'new-policy': () => this.showAddModal('newPolicyBtn')
        };

        if (actionMap[action]) {
            actionMap[action]();
        }
    }

    showAddModal(buttonType) {
        console.log('Showing add modal for:', buttonType);
        const modal = document.getElementById('genericModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        const modalContent = this.getModalContent(buttonType);
        title.textContent = modalContent.title;
        body.innerHTML = modalContent.body;

        // Set the current modal context
        this.currentModalContext = { type: buttonType, mode: 'add', data: null };

        modal.classList.remove('hidden');
    }

    showAddActivityModal() {
        console.log('Showing add activity modal');
        const modal = document.getElementById('genericModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Add New Activity';
        body.innerHTML = `
            <form class="activity-form">
                <div class="form-group">
                    <label class="form-label">Activity Title *</label>
                    <input type="text" class="form-control" id="activityTitle" placeholder="Enter activity title" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Actor *</label>
                    <input type="text" class="form-control" id="activityActor" placeholder="Enter person responsible" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Activity Type</label>
                    <select class="form-control" id="activityType">
                        <option value="dsar">DSAR</option>
                        <option value="assessment">Assessment</option>
                        <option value="vendor">Vendor</option>
                        <option value="policy">Policy</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Details</label>
                    <textarea class="form-control" id="activityDetails" rows="3" placeholder="Enter activity details"></textarea>
                </div>
            </form>
        `;

        this.currentModalContext = { type: 'addActivityBtn', mode: 'add', data: null };
        modal.classList.remove('hidden');
    }

    showAllActivities() {
        console.log('Showing all activities');
        const modal = document.getElementById('genericModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'All Recent Activities';
        body.innerHTML = `
            <div class="activity-list" style="max-height: 400px; overflow-y: auto;">
                ${this.data.activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon status--${this.getActivityStatus(activity.type)}">${this.getActivityIcon(activity.type)}</div>
                        <div class="activity-content">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-meta">${activity.time} • ${activity.actor}</div>
                            <div style="margin-top: 8px; font-size: 13px; color: var(--color-text-secondary);">${activity.details}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    getModalContent(buttonType) {
        const contentMap = {
            'newDsarBtn': {
                title: 'New DSAR Request',
                body: `
                    <form class="dsar-form">
                        <div class="form-group">
                            <label class="form-label">Subject Name *</label>
                            <input type="text" class="form-control" id="dsarName" placeholder="Enter subject name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Subject Email *</label>
                            <input type="email" class="form-control" id="dsarEmail" placeholder="Enter subject email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Stage</label>
                            <select class="form-control" id="dsarStage">
                                <option value="review">Review</option>
                                <option value="search">Search</option>
                                <option value="deliver">Deliver</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Days Remaining</label>
                            <input type="number" class="form-control" id="dsarDays" value="30" min="1" max="90">
                        </div>
                    </form>
                `
            },
            'newVendorBtn': {
                title: 'Add New Vendor',
                body: `
                    <form class="vendor-form">
                        <div class="form-group">
                            <label class="form-label">Vendor Name *</label>
                            <input type="text" class="form-control" id="vendorName" placeholder="Enter vendor name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Risk Level</label>
                            <select class="form-control" id="vendorRisk">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" id="vendorStatus">
                                <option value="Active">Active</option>
                                <option value="Review">Review</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                    </form>
                `
            },
            'newAssessmentBtn': {
                title: 'Create New Assessment',
                body: `
                    <form class="assessment-form">
                        <div class="form-group">
                            <label class="form-label">Assessment Title *</label>
                            <input type="text" class="form-control" id="assessmentTitle" placeholder="Enter assessment title" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Assessment Type</label>
                            <select class="form-control" id="assessmentType">
                                <option value="DPIA">DPIA</option>
                                <option value="LIA">LIA</option>
                                <option value="TIA">TIA</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Risk Level</label>
                            <select class="form-control" id="assessmentRisk">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" id="assessmentStatus">
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                    </form>
                `
            },
            'addActivityBtn': {
                title: 'Add New Activity',
                body: `
                    <form class="activity-form">
                        <div class="form-group">
                            <label class="form-label">Activity Title *</label>
                            <input type="text" class="form-control" id="activityTitle" placeholder="Enter activity title" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Actor *</label>
                            <input type="text" class="form-control" id="activityActor" placeholder="Enter person responsible" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Activity Type</label>
                            <select class="form-control" id="activityType">
                                <option value="dsar">DSAR</option>
                                <option value="assessment">Assessment</option>
                                <option value="vendor">Vendor</option>
                                <option value="policy">Policy</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Details</label>
                            <textarea class="form-control" id="activityDetails" rows="3" placeholder="Enter activity details"></textarea>
                        </div>
                    </form>
                `
            },
            'newPolicyBtn': {
                title: 'New Policy',
                body: `
                    <form class="policy-form">
                        <div class="form-group">
                            <label class="form-label">Policy Title *</label>
                            <input type="text" class="form-control" id="policyTitle" placeholder="Enter policy title" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Policy Type</label>
                            <select class="form-control" id="policyType">
                                <option value="Policy">Policy</option>
                                <option value="SOP">SOP</option>
                                <option value="Template">Template</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Version</label>
                            <input type="text" class="form-control" id="policyVersion" value="v1.0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" id="policyStatus">
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                    </form>
                `
            }
        };

        return contentMap[buttonType] || { title: 'Add New Item', body: '<p>Form content not available</p>' };
    }

    handleModalSave() {
        console.log('Handling modal save');
        if (!this.currentModalContext) {
            console.log('No modal context');
            return;
        }

        const { type, mode, data } = this.currentModalContext;
        console.log('Modal context:', type, mode, data);

        try {
            if (type === 'newDsarBtn') {
                this.saveDsar(mode, data);
            } else if (type === 'newVendorBtn') {
                this.saveVendor(mode, data);
            } else if (type === 'newAssessmentBtn') {
                this.saveAssessment(mode, data);
            } else if (type === 'newPolicyBtn') {
                this.savePolicy(mode, data);
            } else if (type === 'addActivityBtn') {
                this.saveActivity(mode, data);
            } else if (type === 'dsarDetail') {
                const stage = document.getElementById('dsarDetailStage')?.value;
                const days = parseInt(document.getElementById('dsarDetailDays')?.value);
                const notes = document.getElementById('dsarDetailNotes')?.value?.trim();
                    if (data) {
                        data.stage = stage;
                    if (!Number.isNaN(days)) data.days = days;
                    if (notes) this.logActivity(`Note added to ${data.id}`, notes, 'dsar');
                        this.populateDSARTable();
                        this.updateDashboardCounts();
                        this.showSuccessMessage('DSAR updated');
            }
        this.hideModal();
    }

        } catch (error) {
            console.error('Error saving data:', error);
            this.showErrorMessage('Failed to save data. Please check required fields.');
        }
    }

    saveDsar(mode, existingData) {
        console.log('Saving DSAR');
        const name = document.getElementById('dsarName')?.value?.trim();
        const email = document.getElementById('dsarEmail')?.value?.trim();
        const stage = document.getElementById('dsarStage')?.value;
        const days = parseInt(document.getElementById('dsarDays')?.value);

        if (!name || !email) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        if (mode === 'add') {
            const newDsar = {
                id: `DSAR-${String(this.nextId.dsars).padStart(3, '0')}`,
                name,
                email,
                stage,
                days
            };
            this.data.dsars.push(newDsar);
            this.nextId.dsars++;
        } else {
            // Edit mode
            const dsar = this.data.dsars.find(d => d.id === existingData.id);
            if (dsar) {
                dsar.name = name;
                dsar.email = email;
                dsar.stage = stage;
                dsar.days = days;
            }
        }

        this.hideModal();
        this.populateDSARTable();
        this.updateDashboardCounts();
        this.showSuccessMessage(mode === 'add' ? 'DSAR created successfully' : 'DSAR updated successfully');
        
        if (this.currentModule === 'dashboard') {
            this.populateRecentActivities();
        }
    }

    saveVendor(mode, existingData) {
        console.log('Saving vendor');
        const name = document.getElementById('vendorName')?.value?.trim();
        const risk = document.getElementById('vendorRisk')?.value;
        const status = document.getElementById('vendorStatus')?.value;

        if (!name) {
            this.showErrorMessage('Please enter vendor name');
            return;
        }

        if (mode === 'add') {
            const newVendor = {
                id: this.nextId.vendors,
                name,
                risk,
                status
            };
            this.data.vendors.push(newVendor);
            this.nextId.vendors++;
        } else {
            // Edit mode
            const vendor = this.data.vendors.find(v => v.id == existingData.id);
            if (vendor) {
                vendor.name = name;
                vendor.risk = risk;
                vendor.status = status;
            }
        }

        this.hideModal();
        this.populateVendorsTable();
        this.updateDashboardCounts();
        this.showSuccessMessage(mode === 'add' ? 'Vendor added successfully' : 'Vendor updated successfully');
    }

    saveAssessment(mode, existingData) {
        console.log('Saving assessment');
        const title = document.getElementById('assessmentTitle')?.value?.trim();
        const type = document.getElementById('assessmentType')?.value;
        const risk = document.getElementById('assessmentRisk')?.value;
        const status = document.getElementById('assessmentStatus')?.value;

        if (!title) {
            this.showErrorMessage('Please enter assessment title');
            return;
        }

        if (mode === 'add') {
            const newAssessment = {
                id: this.nextId.assessments,
                title,
                type,
                risk,
                status
            };
            this.data.assessments.push(newAssessment);
            this.nextId.assessments++;
        } else {
            // Edit mode
            const assessment = this.data.assessments.find(a => a.id == existingData.id);
            if (assessment) {
                assessment.title = title;
                assessment.type = type;
                assessment.risk = risk;
                assessment.status = status;
            }
        }

        this.hideModal();
        this.populateAssessmentsTable();
        this.updateDashboardCounts();
        this.showSuccessMessage(mode === 'add' ? 'Assessment created successfully' : 'Assessment updated successfully');
    }

    savePolicy(mode, existingData) {
        console.log('Saving policy');
        const title = document.getElementById('policyTitle')?.value?.trim();
        const type = document.getElementById('policyType')?.value;
        const version = document.getElementById('policyVersion')?.value?.trim();
        const status = document.getElementById('policyStatus')?.value;

        if (!title) {
            this.showErrorMessage('Please enter policy title');
            return;
        }

        if (mode === 'add') {
            const newPolicy = {
                id: this.nextId.policies,
                title,
                type,
                version,
                status
            };
            this.data.policies.push(newPolicy);
            this.nextId.policies++;
        } else {
            // Edit mode
            const policy = this.data.policies.find(p => p.id == existingData.id);
            if (policy) {
                policy.title = title;
                policy.type = type;
                policy.version = version;
                policy.status = status;
            }
        }

        this.hideModal();
        this.populatePoliciesTable();
        this.showSuccessMessage(mode === 'add' ? 'Policy created successfully' : 'Policy updated successfully');
    }

    saveActivity(mode, existingData) {
        console.log('Saving activity');
        const title = document.getElementById('activityTitle')?.value?.trim();
        const actor = document.getElementById('activityActor')?.value?.trim();
        const type = document.getElementById('activityType')?.value;
        const details = document.getElementById('activityDetails')?.value?.trim();

        if (!title || !actor) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        if (mode === 'add') {
            const newActivity = {
                id: this.nextId.activities,
                title,
                actor,
                type,
                details,
                time: 'Just now'
            };
            this.data.activities.unshift(newActivity);
            this.nextId.activities++;
        } else {
            // Edit mode
            const activity = this.data.activities.find(a => a.id == existingData.id);
            if (activity) {
                activity.title = title;
                activity.actor = actor;
                activity.type = type;
                activity.details = details;
            }
        }

        this.hideModal();
        this.populateRecentActivities();
        this.showSuccessMessage(mode === 'add' ? 'Activity added successfully' : 'Activity updated successfully');
    }

    deleteItem(type, id) {
        console.log(`Deleting ${type} item with id:`, id);
        this.confirmAction(`Are you sure you want to delete this item? It will be moved to the Bin.`, () => {
            const dataKey = type;
            const itemIndex = this.data[dataKey].findIndex(item => item.id == id);
            
            if (itemIndex === -1) {
                this.showErrorMessage('Item not found');
                return;
            }

            const item = this.data[dataKey][itemIndex];

            // Move to bin
            const binItem = {
                ...item,
                originalType: type,
                deletedAt: new Date().toLocaleDateString(),
                binKey: `${type}:${String(item.id)}`
            };

            this.data.bin.push(binItem);

            // Remove from original data
            this.data[dataKey].splice(itemIndex, 1);

            // Refresh UI
            this.refreshCurrentView();
            this.updateDashboardCounts();
            this.showSuccessMessage('Item moved to bin');
        });
    }

    editItem(type, id) {
        console.log(`Editing ${type} item with id:`, id);
        
        const dataKey = type;
        const item = this.data[dataKey].find(item => item.id == id);
        
        if (!item) {
            this.showErrorMessage('Item not found');
            return;
        }

        // Show edit modal
        const buttonTypeMap = {
            'dsars': 'newDsarBtn',
            'vendors': 'newVendorBtn',
            'assessments': 'newAssessmentBtn',
            'policies': 'newPolicyBtn',
            'activities': 'addActivityBtn'
        };

        const buttonType = buttonTypeMap[type];
        if (!buttonType) {
            this.showErrorMessage('Edit not supported for this item type');
            return;
        }

        this.showEditModal(buttonType, item);
    }

    showEditModal(buttonType, item) {
        console.log('Showing edit modal for:', buttonType, item);
        const modal = document.getElementById('genericModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        const modalContent = this.getModalContent(buttonType);
        title.textContent = `Edit ${modalContent.title.replace('New ', '').replace('Add ', '')}`;
        body.innerHTML = modalContent.body;

        // Pre-populate form fields
        setTimeout(() => {
            this.populateEditForm(buttonType, item);
        }, 10);

        // Set the current modal context
        this.currentModalContext = { type: buttonType, mode: 'edit', data: item };

        modal.classList.remove('hidden');
    }

    populateEditForm(buttonType, item) {
        console.log('Populating edit form for:', buttonType, item);
        if (buttonType === 'newDsarBtn') {
            const nameField = document.getElementById('dsarName');
            const emailField = document.getElementById('dsarEmail');
            const stageField = document.getElementById('dsarStage');
            const daysField = document.getElementById('dsarDays');
            
            if (nameField) nameField.value = item.name;
            if (emailField) emailField.value = item.email;
            if (stageField) stageField.value = item.stage;
            if (daysField) daysField.value = item.days;
        } else if (buttonType === 'newVendorBtn') {
            const nameField = document.getElementById('vendorName');
            const riskField = document.getElementById('vendorRisk');
            const statusField = document.getElementById('vendorStatus');
            
            if (nameField) nameField.value = item.name;
            if (riskField) riskField.value = item.risk;
            if (statusField) statusField.value = item.status;
        } else if (buttonType === 'newAssessmentBtn') {
            const titleField = document.getElementById('assessmentTitle');
            const typeField = document.getElementById('assessmentType');
            const riskField = document.getElementById('assessmentRisk');
            const statusField = document.getElementById('assessmentStatus');
            
            if (titleField) titleField.value = item.title;
            if (typeField) typeField.value = item.type;
            if (riskField) riskField.value = item.risk;
            if (statusField) statusField.value = item.status;
        } else if (buttonType === 'newPolicyBtn') {
            const titleField = document.getElementById('policyTitle');
            const typeField = document.getElementById('policyType');
            const versionField = document.getElementById('policyVersion');
            const statusField = document.getElementById('policyStatus');
            
            if (titleField) titleField.value = item.title;
            if (typeField) typeField.value = item.type;
            if (versionField) versionField.value = item.version;
            if (statusField) statusField.value = item.status;
        } else if (buttonType === 'addActivityBtn') {
            const titleField = document.getElementById('activityTitle');
            const actorField = document.getElementById('activityActor');
            const typeField = document.getElementById('activityType');
            const detailsField = document.getElementById('activityDetails');
            
            if (titleField) titleField.value = item.title;
            if (actorField) actorField.value = item.actor;
            if (typeField) typeField.value = item.type;
            if (detailsField) detailsField.value = item.details;
        }
    }

    handleAction(action, type, id) {
        console.log(`Handling action: ${action} for ${type} id: ${id}`);
        
        switch(action) {
            case 'take-action':
                // simple stage advance for DSARs: review -> search -> deliver -> review
                if (type === 'dsars') {
                    const dsar = this.data.dsars.find(d => d.id == id);
                    if (dsar) {
                        const order = ['review','search','deliver'];
                        const next = order[(order.indexOf(dsar.stage) + 1) % order.length];
                        dsar.stage = next;
                        this.populateDSARTable();
                        this.logActivity(`DSAR stage changed: ${id}`, `New stage: ${this.formatStatus(next)}`, 'dsar');
                        this.showSuccessMessage(`Stage updated to ${this.formatStatus(next)}`);
                    } else {
                        this.showErrorMessage('DSAR not found');
                    }
                } else {
                    this.showSuccessMessage(`Action taken for ${type} ${id}`);
                }
                break;
            case 'approve':
                this.approveItem(type, id);
                break;
            case 'restore':
                this.restoreItem(id);
                break;
            case 'permanent-delete':
                this.permanentDeleteItem(id);
                break;
            default:
                this.showSuccessMessage(`Action "${action}" executed successfully`);
        }
    }

    approveItem(type, id) {
        console.log('Approving item:', type, id);
        this.confirmAction(`Are you sure you want to approve this item?`, () => {
            const dataKey = type;
            const item = this.data[dataKey].find(item => item.id == id);
            
            if (item) {
                item.status = 'approved';
                this.refreshCurrentView();
                this.updateDashboardCounts();
                this.showSuccessMessage('Item approved successfully');
            }
        });
    }

    restoreItem(id) {
        console.log('Restoring item:', id);
        const binItemIndex = this.data.bin.findIndex(item => (item.binKey || String(item.id)) == String(id));
        if (binItemIndex === -1) {
            this.showErrorMessage('Item not found in bin');
            return;
        }

        const binItem = this.data.bin[binItemIndex];

        // Remove from bin
        this.data.bin.splice(binItemIndex, 1);

        // Restore to original data
        const originalItem = { ...binItem };
        delete originalItem.originalType;
        delete originalItem.deletedAt;

        this.data[binItem.originalType].push(originalItem);

        this.refreshCurrentView();
        this.updateDashboardCounts();
        this.showSuccessMessage('Item restored successfully');
    }

    permanentDeleteItem(id) {
        console.log('Permanently deleting item:', id);
        this.confirmAction(`Are you sure you want to permanently delete this item? This action cannot be undone.`, () => {
            const binItemIndex = this.data.bin.findIndex(item => item.id == id);
            if (binItemIndex !== -1) {
                this.data.bin.splice(binItemIndex, 1);
                this.refreshCurrentView();
                this.updateDashboardCounts();
                this.showSuccessMessage('Item permanently deleted');
            }
        });
    }

    emptyBin() {
        console.log('Emptying bin');
        if (this.data.bin.length === 0) {
            this.showErrorMessage('Bin is already empty');
            return;
        }

        this.confirmAction(`Are you sure you want to permanently delete all items in the bin? This action cannot be undone.`, () => {
            this.data.bin = [];
            this.refreshCurrentView();
            this.updateDashboardCounts();
            this.showSuccessMessage('Bin emptied successfully');
        });
    }

    refreshCurrentView() {
        console.log('Refreshing current view:', this.currentModule);
        this.refreshModuleContent(this.currentModule);
    }

    confirmAction(message, callback) {
        console.log('Showing confirmation dialog:', message);
        const modal = document.getElementById('confirmModal');
        const title = document.getElementById('confirmTitle');
        const body = document.getElementById('confirmBody');

        title.textContent = 'Confirm Action';
        body.textContent = message;

        this.confirmCallback = callback;
        modal.classList.remove('hidden');
    }

    handleConfirmOk() {
        console.log('Confirm OK clicked');
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.hideConfirmModal();
    }

    hideModal() {
        const modal = document.getElementById('genericModal');
        modal.classList.add('hidden');
        this.currentModalContext = null;
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.add('hidden');
        this.confirmCallback = null;
    }

    showSuccessMessage(message) {
        console.log('Success message:', message);
        const toast = document.getElementById('successToast');
        const messageEl = toast.querySelector('.toast-message');
        
        messageEl.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    showErrorMessage(message) {
        console.log('Error message:', message);
        const toast = document.getElementById('errorToast');
        const messageEl = toast.querySelector('.toast-message');
        
        messageEl.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    setupResponsiveNavigation() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        this.handleResponsiveChange(mediaQuery);
        mediaQuery.addListener(this.handleResponsiveChange.bind(this));
    }

    handleResponsiveChange(mediaQuery) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (mediaQuery.matches) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('sidebar-collapsed');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        if (mediaQuery.matches) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        }
    }

    logActivity(title, details = '', type = 'policy', actor = this.userProfile.name) {
        const entry = {
            id: this.nextId.activities++,
            title,
            details,
            actor,
            time: 'Just now',
            type
        };
        this.data.activities.unshift(entry);
        // refresh dashboard if visible
        if (this.currentModule === 'dashboard') {
        this.populateRecentActivities();
        }
    }


    // Helper functions
    getActivityStatus(type) {
        const statusMap = {
            'dsar': 'success',
            'assessment': 'info',
            'vendor': 'warning',
            'policy': 'success'
        };
        return statusMap[type] || 'info';
    }

    getActivityIcon(type) {
        const iconMap = {
            'dsar': '🔒',
            'assessment': '⚖️',
            'vendor': '🏢',
            'policy': '📚'
        };
        return iconMap[type] || '📝';
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    isValidEmail(email) {
    // simple RFC5322-ish check; good enough for UI validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    getDaysClass(days) {
        if (days <= 5) return 'days-critical';
        if (days <= 10) return 'days-warning';
        return 'days-ok';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DPO Portal...');
    window.dpoPortal = new DPOPortal();
    console.log('DPO Portal ready!');
});