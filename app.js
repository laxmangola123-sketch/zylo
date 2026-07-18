document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll Active Link Highlighting ---
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    try {
      let current = '';
      const scrollPos = window.scrollY || window.pageYOffset || 0;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPos >= (sectionTop - 150)) {
          current = section.getAttribute('id') || '';
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.startsWith('#') && href.slice(1) === current) {
          item.classList.add('active');
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  // --- Live Search for Services ---
  const searchInput = document.getElementById('service-search');
  const serviceCards = document.querySelectorAll('.service-card');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      try {
        const query = e.target.value.toLowerCase().trim();
        
        serviceCards.forEach(card => {
          const titleEl = card.querySelector('h3');
          const descEl = card.querySelector('p');
          const title = titleEl ? titleEl.textContent.toLowerCase() : '';
          const desc = descEl ? descEl.textContent.toLowerCase() : '';
          
          if (title.includes(query) || desc.includes(query)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
          }
        });
      } catch (err) {
        console.error(err);
      }
    });
  }

  // --- Form Interactive Cost Calculation ---
  const planSelect = document.getElementById('plan-type');
  const websiteTypeGroup = document.getElementById('website-type-group');
  const priceDisplay = document.getElementById('calculated-price');
  
  function updatePrice() {
    if (!planSelect || !priceDisplay) return;
    
    const selectedPlan = planSelect.value;
    if (selectedPlan === 'all-in-one') {
      if (websiteTypeGroup) websiteTypeGroup.style.display = 'none';
      priceDisplay.textContent = '₹25,000/mo';
    } else if (selectedPlan === 'website-build') {
      if (websiteTypeGroup) websiteTypeGroup.style.display = 'block';
      priceDisplay.textContent = '₹25,000';
    } else {
      if (websiteTypeGroup) websiteTypeGroup.style.display = 'none';
      priceDisplay.textContent = '₹0';
    }
  }

  if (planSelect) {
    planSelect.addEventListener('change', updatePrice);
    updatePrice(); // initial run
  }

  // --- Form Submission & Booking Modal ---
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');
  
  if (bookingForm && successModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get values
      const name = document.getElementById('client-name').value;
      const email = document.getElementById('client-email').value;
      const phone = document.getElementById('client-phone').value;
      
      let detailStr = '';
      let priceVal = '';
      
      if (planSelect.value === 'all-in-one') {
        detailStr = 'All-in-One Marketing Package';
        priceVal = '₹25,000 / Month';
      } else {
        const webType = document.getElementById('web-type').value;
        const formattedWebType = webType.charAt(0).toUpperCase() + webType.slice(1);
        detailStr = `${formattedWebType} Website Design`;
        priceVal = '₹25,000 (One-time)';
      }
      
      // Generate Booking ID
      const bookingId = 'ZYLO-' + Math.floor(100000 + Math.random() * 900000);
      
      // Populate receipt
      document.getElementById('receipt-id').textContent = bookingId;
      document.getElementById('receipt-name').textContent = name;
      document.getElementById('receipt-service').textContent = detailStr;
      document.getElementById('receipt-price').textContent = priceVal;
      
      // Save to localStorage
      const bookingData = {
        bookingId,
        name,
        email,
        phone,
        service: detailStr,
        price: priceVal,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };
      
      let currentBookings = [];
      try {
        currentBookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
        if (!Array.isArray(currentBookings)) currentBookings = [];
      } catch (err) {
        currentBookings = [];
      }
      currentBookings.push(bookingData);
      localStorage.setItem('zylo_bookings', JSON.stringify(currentBookings));
      
      // Show Modal
      successModal.classList.add('active');
      
      // Reset Form
      bookingForm.reset();
      updatePrice();
    });
  }
  
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
    
    // Close modal on click outside content
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // trigger animation once
        }
      });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(el => el.classList.add('appear'));
  }

  // --- Staff Portal Login & Dashboard Logic ---
  const staffPortalTrigger = document.getElementById('staff-portal-trigger');
  const staffPortalDrawerTrigger = document.getElementById('staff-portal-drawer-trigger');
  const staffLoginModal = document.getElementById('staff-login-modal');
  const closeStaffLogin = document.getElementById('close-staff-login');
  const staffLoginForm = document.getElementById('staff-login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  
  const staffDashboardModal = document.getElementById('staff-dashboard-modal');
  const closeStaffDashboard = document.getElementById('close-staff-dashboard');
  const staffLogoutBtn = document.getElementById('staff-logout-btn');
  const bookingsListBody = document.getElementById('bookings-list-body');
  const noBookingsMsg = document.getElementById('no-bookings-msg');

  // Open login modal
  const openLogin = (e) => {
    e.preventDefault();
    if (loginErrorMsg) {
      loginErrorMsg.style.display = 'none';
    }
    if (staffLoginModal) {
      staffLoginModal.classList.add('active');
    }
    
    // Auto-close hamburger menu on mobile
    if (menuToggle && navLinks) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  };

  if (staffPortalTrigger && staffLoginModal) {
    staffPortalTrigger.addEventListener('click', openLogin);
  }
  if (staffPortalDrawerTrigger && staffLoginModal) {
    staffPortalDrawerTrigger.addEventListener('click', openLogin);
  }

  // Close login modal
  if (closeStaffLogin && staffLoginModal) {
    closeStaffLogin.addEventListener('click', () => {
      staffLoginModal.classList.remove('active');
    });
  }

  // Perform Login
  if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('staff-email').value.trim();
      const password = document.getElementById('staff-password').value;

      if (email === 'info@zylo.digital' && password === 'zylo@123@') {
        // Success
        staffLoginModal.classList.remove('active');
        staffLoginForm.reset();
        loginErrorMsg.style.display = 'none';
        
        // Open Dashboard & render
        renderStaffBookings();
        staffDashboardModal.classList.add('active');
      } else {
        // Fail
        loginErrorMsg.style.display = 'block';
      }
    });
  }

  // Render bookings in table
  function renderStaffBookings() {
    if (!bookingsListBody) return;
    
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    // Update metrics cards
    const metricTotal = document.getElementById('metric-total-bookings');
    const metricConfirmed = document.getElementById('metric-confirmed-bookings');
    if (metricTotal) {
      metricTotal.textContent = bookings.length;
    }
    if (metricConfirmed) {
      const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
      metricConfirmed.textContent = confirmedCount;
    }

    bookingsListBody.innerHTML = '';

    if (bookings.length === 0) {
      document.getElementById('staff-bookings-table').style.display = 'none';
      noBookingsMsg.style.display = 'block';
    } else {
      document.getElementById('staff-bookings-table').style.display = 'table';
      noBookingsMsg.style.display = 'none';

      bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        
        // Format timestamp
        const dateObj = new Date(booking.timestamp);
        const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Status tag
        const isConfirmed = booking.status === 'Confirmed';
        const statusBadge = isConfirmed 
          ? `<span style="background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; display: inline-block;">Confirmed</span>`
          : `<span style="background: rgba(234, 179, 8, 0.15); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; display: inline-block;">Pending</span>`;

        // Action buttons
        const confirmBtnHTML = isConfirmed 
          ? `<button class="btn-confirm" disabled style="background: rgba(255, 255, 255, 0.03); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: not-allowed; margin-right: 0.5rem;">Confirmed</button>`
          : `<button class="btn-confirm" data-index="${index}" style="background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.25); padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-right: 0.5rem; transition: all 0.2s ease;" onmouseover="this.style.background='#22c55e'; this.style.color='#000'; this.style.boxShadow='0 0 10px rgba(34,197,94,0.4)';" onmouseout="this.style.background='rgba(34, 197, 94, 0.1)'; this.style.color='#22c55e'; this.style.boxShadow='none';">Confirm</button>`;

        row.innerHTML = `
          <td style="padding: 1rem; font-weight:700; color:var(--primary);">${booking.bookingId}</td>
          <td style="padding: 1rem; color:#fff;">${booking.name}</td>
          <td style="padding: 1rem; line-height:1.4;">
            <span style="color:#fff;">${booking.email}</span><br>
            <span style="color:var(--text-muted); font-size:0.8rem;">${booking.phone}</span>
          </td>
          <td style="padding: 1rem; color:#fff;">${booking.service}</td>
          <td style="padding: 1rem;">${statusBadge}</td>
          <td style="padding: 1rem; color:var(--text-muted);">${formattedDate}</td>
          <td style="padding: 1rem; text-align:center;">
            ${confirmBtnHTML}
            <button class="btn-delete" data-index="${index}">Delete</button>
          </td>
        `;
        bookingsListBody.appendChild(row);
      });

      // Add delete handlers
      const deleteButtons = bookingsListBody.querySelectorAll('.btn-delete');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = e.target.getAttribute('data-index');
          deleteBooking(idx);
        });
      });

      // Add confirm handlers
      const confirmButtons = bookingsListBody.querySelectorAll('.btn-confirm');
      confirmButtons.forEach(btn => {
        if (!btn.disabled) {
          btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            confirmBooking(idx);
          });
        }
      });
    }
  }

  // Confirm booking function
  function confirmBooking(idx) {
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    
    if (bookings[idx]) {
      bookings[idx].status = 'Confirmed';
    }
    localStorage.setItem('zylo_bookings', JSON.stringify(bookings));
    renderStaffBookings();
  }

  // Delete booking function
  function deleteBooking(idx) {
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    bookings.splice(idx, 1);
    localStorage.setItem('zylo_bookings', JSON.stringify(bookings));
    renderStaffBookings();
  }

  // Close Dashboard
  if (closeStaffDashboard && staffDashboardModal) {
    closeStaffDashboard.addEventListener('click', () => {
      staffDashboardModal.classList.remove('active');
    });
  }

  // Sign out Dashboard
  if (staffLogoutBtn && staffDashboardModal) {
    staffLogoutBtn.addEventListener('click', () => {
      staffDashboardModal.classList.remove('active');
    });
  }

  // Close modals on clicking outside content
  if (staffLoginModal) {
    staffLoginModal.addEventListener('click', (e) => {
      if (e.target === staffLoginModal) {
        staffLoginModal.classList.remove('active');
      }
    });
  }
  if (staffDashboardModal) {
    staffDashboardModal.addEventListener('click', (e) => {
      if (e.target === staffDashboardModal) {
        staffDashboardModal.classList.remove('active');
      }
    });
  }

  // --- Automatic Theme Accent Color Cycle ---
  const colors = [
    { primary: '#84cc16', glow: 'rgba(132, 204, 22, 0.15)', glowStrong: 'rgba(132, 204, 22, 0.4)', glowBorder: 'rgba(132, 204, 22, 0.3)' }, // Lime Green
    { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)', glowStrong: 'rgba(6, 182, 212, 0.4)', glowBorder: 'rgba(6, 182, 212, 0.3)' }, // Cyan
    { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.15)', glowStrong: 'rgba(217, 70, 239, 0.4)', glowBorder: 'rgba(217, 70, 239, 0.3)' }, // Magenta/Purple
    { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)',  glowStrong: 'rgba(244, 63, 94, 0.4)',  glowBorder: 'rgba(244, 63, 94, 0.3)' },  // Rose
    { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.15)', glowStrong: 'rgba(59, 130, 246, 0.4)', glowBorder: 'rgba(59, 130, 246, 0.3)' }  // Blue
  ];
  
  let colorIndex = 0;
  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    const nextColor = colors[colorIndex];
    document.documentElement.style.setProperty('--primary', nextColor.primary);
    document.documentElement.style.setProperty('--primary-glow', nextColor.glow);
    document.documentElement.style.setProperty('--primary-glow-strong', nextColor.glowStrong);
    document.documentElement.style.setProperty('--border-glow', nextColor.glowBorder);
  }, 4000); // changes color every 4 seconds

  // --- Live Brand Reach Counter (CounterAPI Dev) ---
  const baselineViews = 2480;
  const reachCountEl = document.getElementById('site-reach-count');
  const metricViewsEl = document.getElementById('metric-site-views');

  function updateViewsUI(views) {
    const formatted = Number(views).toLocaleString();
    if (reachCountEl) {
      reachCountEl.textContent = formatted;
    }
    if (metricViewsEl) {
      metricViewsEl.textContent = formatted;
    }
  }

  // Fallback views simulation in case CounterAPI is blocked or offline
  function fallbackViews() {
    let localHits = parseInt(localStorage.getItem('zylo_simulated_hits') || '0');
    // Increment on first page load per session
    if (!sessionStorage.getItem('zylo_session_viewed')) {
      localHits += 1;
      localStorage.setItem('zylo_simulated_hits', localHits.toString());
      sessionStorage.setItem('zylo_session_viewed', 'true');
    }
    updateViewsUI(baselineViews + localHits);
  }

  // Hit the counter API
  try {
    fetch('https://api.counterapi.dev/v1/zylo_digital_agency/visits/up')
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          updateViewsUI(baselineViews + data.count);
        } else {
          fallbackViews();
        }
      })
      .catch(err => {
        console.warn('CounterAPI unreachable, using local session counter:', err);
        fallbackViews();
      });
  } catch (err) {
    fallbackViews();
  }
});
